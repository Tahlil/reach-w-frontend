import {loadStdlib, ask} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib(process.env);

const isAlice = await ask.ask(
  'Are you Alice',
  ask.yesno
);
const who = isAlice ? 'Alice' : 'Bob';
console.log(`Starting RPS! as ${who}`);

let acc = null;
const createAcc = await ask.ask(
  `Would you like to create an account ${who} on devnet?`,
  ask.yesno
);

if (createAcc) {
  acc = await stdlib.newTestAccounts(stdlib.parseCurrency(100));
}
else{
  const secret = await ask.ask(
    `What is your secret?`,
    (x => x)
  );
  acc = await stdlib.newAccountFromSecret(secret);
}

let ctc = null;
if(isAlice){
  ctc = acc.contract(backend);
  ctc.getInfo().then((info) => {
    console.log(`The contract is deployed as = ${JSON.stringify(info)}`);
  }).catch((err) => {
    console.error(err);
  });
}
else{
  const info = await ask.ask(
    `Please paste the contract information: `,
    JSON.parse
  );
  ctc = acc.contract(backend, info);
}

console.log('Launching...');

const ctcBob = accBob.contract(backend, ctcAlice.getInfo());

console.log('Starting backends...');
await Promise.all([
  backend.Alice(ctcAlice, {
    ...stdlib.hasRandom,
    // implement Alice's interact object here
  }),
  backend.Bob(ctcBob, {
    ...stdlib.hasRandom,
    // implement Bob's interact object here
  }),
]);

console.log('Goodbye, Alice and Bob!');
