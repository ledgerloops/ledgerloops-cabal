import Client from 'cabal-client';
import { createHmac } from "node:crypto";

function generateHypercoreKey(input: string): string {
  return createHmac('sha256', input).digest('hex');
}

// const client = new Client({
//   config: {
//     dbdir: '/tmp/cabals'
//   }
// })

// console.log(process.argv);

// client.addCabal('cabal://411dbe21d6f8e222733ac88d2da3cf953aa9f5466db94fa9fa967a765be3875e').then((cabal) => {
//   console.log(cabal.key);
//   cabal.on('new-message', (event) => {
//     console.log(event.channel, event.author.key, event.message.value.content.text);
//   });
//   cabal.processLine('/join default');
//   cabal.processLine('hello cabal');
//   // resolves when the cabal is ready, returns a CabalDetails instance
// });

export class Server {
  name: string;
  neighbours: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [name: string]: any // FIXME: would like to use [CabalDetails](https://github.com/cabal-club/cabal-client/blob/master/src/cabal-details.js) as the type here
  } = {};
  client: Client;
  constructor(name: string) {
    console.log('Server started');
    this.name = name;
    this.client = new Client({
      config: {
        dbdir: `/tmp/cabals-${this.name}`
      }
    });
  }
  testInitialize(): void {
    const client = new Client()

    // the client is the interface for initializing cabals while
    // cabalDetails contains all information and methods for one specific cabal
    client.createCabal().then((cabalDetails) => {
      console.log('Cabal created', cabalDetails.key);
      // each cabal is an event emitter
      client.on('init', () => {
        console.log('Yay, I\'m ready!')
        // the key is the unique identifier of this cabal
        console.log('My key: ' + cabalDetails.key)
      })
    })
  }
  testReceive(): void {
    // we have two clients in this example, one for sending and one for recieving
    const client = new Client()
    const client2 = new Client()

    client.createCabal().then((cabalDetails) => {
      cabalDetails.on('new-message', ({ channel, message }) => {
        console.log('Recieved: "' + message.value.content.text + '" in channel ' + channel)
      })

      client.on('init', () => {
        client2.addCabal(cabalDetails.key).then((cabalDetails2) => {
          // both clients are now connected to the cabal
          cabalDetails2.on('init', () => {
            // this tells the other clients how we want to be called
            cabalDetails2.publishNick('CabalUser10', () => {
              // every new cabal has a channel named default
              cabalDetails2.publishMessage({
                type: 'chat/text',
                content: {
                  text: 'Hey there!',
                  channel: 'default'
                }
              })

              // other channels will be created when we start using them
              cabalDetails2.publishMessage({
                type: 'chat/text',
                content: {
                  text: 'People call me ' + cabalDetails2.getLocalName(),
                  channel: 'introduction'
                }
              })
            })
          })
        })
      })
    })
  }
  async addNeighbour(name: string): Promise<void> {
    const channelName = generateHypercoreKey([this.name, name].sort().join('-'));
    console.log(channelName);
    this.neighbours[name] = await this.client.addCabal(`cabal://${channelName}`);
    console.log(`connecting to default channel of cabal between ${this.name} and ${name}, awaiting in init event`);
    await new Promise((resolve) => {
      this.neighbours[name].on('init', resolve);
    });
    console.log('Cabal is ready', this.neighbours[name].key, this.neighbours[name].getChannels());
    this.neighbours[name].on('new-message', (event) => {
      console.log(event.channel, event.author.name, event.message.value.content.text);
    });
    console.log('Joining default channel and sending hello message to neighbour');
    await this.neighbours[name].processLine('/join default');
    console.log(`Setting nick to ${this.name} in neighbour cabal`);
    await this.neighbours[name].processLine(`/nick ${this.name}`);
    console.log(`Sending hello message to neighbour ${name}`);
    await this.neighbours[name].processLine(`hello ${name}`);
    console.log('Message sent');
  }
}