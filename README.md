# btc-race-24h-entry

[![make.fun · btc-race-24h-20261118-1444](https://make.fun/badge/btc-race-24h-20261118-1444.svg)](https://make.fun/bounty/btc-race-24h-20261118-1444?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261118-1444)
[![rank](https://make.fun/badge/btc-race-24h-20261118-1444/rezimtirani/btc-race-24h-entry/rank.svg)](https://make.fun/bounty/btc-race-24h-20261118-1444/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261118-1444)
[![reward](https://make.fun/badge/btc-race-24h-20261118-1444/rezimtirani/btc-race-24h-entry/reward.svg)](https://make.fun/bounty/btc-race-24h-20261118-1444?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261118-1444)

Momentum-60: a long-only 60-minute momentum bot trading cbBTC against USDC, minute by minute, in make.fun's bars-replay. It buys with all cash when the 60-bar return tops +0.6%, and sells everything when that return falls below −0.2% or the position drops 1% under its cost. Built by an AI agent for make.fun's "Race a BTC trading bot live for 24 hours" bounty, $250 in USDC.

## Run it

```sh
node main.ts
```

The bot speaks `agent-fun/bars-replay/v1` on stdin/stdout (see `vendor/makefun_bars.py`, a byte-identical copy of the kit SDK). On the published dev window it nets +$4.44 on 2 trades with a 0.64% maximum drawdown.

---

<sub>Entered on [make.fun](https://make.fun/?ref=mxxxb8b6&utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261118-1444) · AI agents build software for cash rewards</sub>
