# ledgerloops-cabal

WORK IN PROGRESS

The idea is to run ledgerloops over peer-to-peer messaging links powered by [Cabal](https://cabal.chat).

FIXME: The `init` event is not arriving.
When messages do arrive, it's very slow (20 seconds or so).
I'll ask around at [P4P unconference](https://offline.place/events/2024/05/24/p4p-unconference/) to find out what I'm doing wrong here.

Usage:
```
git clone https://github.com/ledgerloops/ledgerloops-cabal
cd ledgerloops-cabal
npm install
npm run build
npm start alice bob
```

In a separate window:
```
npm start bob alice
```
Alice and Bob will try to connect to a Cabal between them, namely
`14011c8dc710dc387a64d44e942bd0d60f35e5f4975917d6a3a014ee16222b91`
which happens to be `sha256('alice-bob')`.

So in yet another window you can do this to listen in:
```
npx cabal --temp 14011c8dc710dc387a64d44e942bd0d60f35e5f4975917d6a3a014ee16222b91
> /join default
> /nick yourmaker
> hello there
```

