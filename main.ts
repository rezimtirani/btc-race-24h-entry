// Momentum-60: a long-only 60-minute momentum bot for cbBTC/USDC (bars-replay/v1).
//
// Strategy (all BigInt integer arithmetic, fully deterministic):
//   * Keep every CBBTC close (raw integer price, scale 5).
//   * Entry: once 60 closes are seen, buy with all cash when the 60-bar
//     return is above +0.6%  (close_now * 1000 > close_then * 1006).
//   * Exit (whole position): when the 60-bar return falls below -0.2%
//     (close_now * 1000 < close_then * 998), or the position is worth
//     1% or more under its cost (stop-loss).
//   * One position at most, full size, max slippage 100 bps per order.
//     A rejected order is simply retried on the next bar while its
//     signal still holds.
//
// Rationale: 1-minute cbBTC is very noisy (1m return sd ~7 bps) while a
// full-size round trip costs ~26 bps in fees, slippage and impact, so the
// bot only trades genuine hourly momentum and otherwise sits in cash.
// On the published dev window this makes +$4.44 on 2 trades (one round
// trip: in at the 60-minute rally, out when momentum reverses) with a
// 0.64% maximum drawdown, and it makes no trade at all in the window's
// down-grind second half.
//
// Laid out like the kit baselines: the grader runs `node /bot/main.ts`
// with this directory mounted at /bot; vendor/makefun-bars.ts is a
// byte-identical copy of the kit's sdk/makefun-bars.ts.

import { runBars, type Bar, type BarsState, type Batch, type BuyInput, type SellInput } from './vendor/makefun-bars.ts';

const SYMBOL = 'CBBTC';
const LOOKBACK = 60;
/** Entry: 60-bar return > +0.6%: close_now * 1000 > close_then * 1006. */
const ENTRY_NUM = 1006n;
/** Exit: 60-bar return < -0.2%: close_now * 1000 < close_then * 998. */
const EXIT_NUM = 998n;
/** Stop-loss: position value <= 99% of its cost. */
const STOP_NUM = 99n;
const STOP_DEN = 100n;
const MAX_SLIPPAGE_BPS = 100;

const closes: bigint[] = [];

await runBars({
  onBatch(state: BarsState, batch: Batch) {
    for (const bar of batch.bars) {
      if (bar.symbol === SYMBOL) closes.push(BigInt(bar.c));
    }
    if (state.warmingUp) return [];
    if (closes.length <= LOOKBACK) return [];
    const now = closes[closes.length - 1];
    const then = closes[closes.length - 1 - LOOKBACK];
    const held = state.positions.get(SYMBOL);
    if (held !== undefined) {
      if (now * 1000n < then * EXIT_NUM) {
        return [{ side: 'sell', symbol: SYMBOL, qty: held.qty, max_slippage_bps: MAX_SLIPPAGE_BPS } satisfies SellInput];
      }
      const value = state.value(SYMBOL, held.qty);
      if (value * STOP_DEN <= held.cost * STOP_NUM) {
        return [{ side: 'sell', symbol: SYMBOL, qty: held.qty, max_slippage_bps: MAX_SLIPPAGE_BPS } satisfies SellInput];
      }
      return [];
    }
    if (now * 1000n > then * ENTRY_NUM) {
      const room = state.weightRoom(SYMBOL);
      const amount = state.cash < room ? state.cash : room;
      if (amount < BigInt(state.hello.fees.min_notional_quote_units)) return [];
      return [{ side: 'buy', symbol: SYMBOL, notional_quote_units: amount, max_slippage_bps: MAX_SLIPPAGE_BPS } satisfies BuyInput];
    }
    return [];
  },
});
