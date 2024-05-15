import { Server } from './server.js';

if (process.argv.length < 3) {
  throw new Error('Usage: npm start <name> <neighbour1> <neighbour2> ...');
}
const name = process.argv[2];

const server = new Server(name);
server.testReceive();
// for (let i = 3; i < process.argv.length; i++) {
//   console.log(`Adding neighbour ${process.argv[i]}`);
//   await server.addNeighbour(process.argv[i]);
// }
