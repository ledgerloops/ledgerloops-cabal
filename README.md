# ledgerloops-cabal

WORK IN PROGRESS

The idea is to run ledgerloops over peer-to-peer messaging links powered by [Cabal](https://cabal.chat).

Usage:
```
git clone https://github.com/ledgerloops/ledgerloops-cabal
cd ledgerloops-cabal
npm install
npm run build
npm start
```

In a separate window:
```
npx cabal --temp 411dbe21d6f8e222733ac88d2da3cf953aa9f5466db94fa9fa967a765be3875e
> /join default
> hello there
```

You will see the messaging working.

Next step: set up a number of nodes, with links between them, for instance in an hourglass topology like [the one from Strategy Pit](https://github.com/ledgerloops/strategy-pit?tab=readme-ov-file#hour-glass), and then run [Saiga nodes](https://github.com/ledgerloops/strategy-pit?tab=readme-ov-file#-saiga)
and see if they find loops and resolve them.

For this, I'll need one proces per node.