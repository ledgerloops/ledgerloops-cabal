import Client from 'cabal-client';

const client = new Client({
  config: {
    dbdir: '/tmp/cabals'
  }
})

client.addCabal('cabal://411dbe21d6f8e222733ac88d2da3cf953aa9f5466db94fa9fa967a765be3875e').then((cabal) => {
  console.log(cabal.key);
  cabal.on('new-message', (event) => {
    console.log(event.channel, event.author.key, event.message.value.content.text);
  });
  cabal.processLine('/join default');
  cabal.processLine('hello cabal');
  // resolves when the cabal is ready, returns a CabalDetails instance
});