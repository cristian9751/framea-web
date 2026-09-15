import { readFileSync, createHash } from 'node:fs';
for (const f of ['package.json', 'package-lock.json']) {
  const raw = readFileSync(f, 'utf8');
  const hash = createHash('sha256').update(raw).digest('hex').slice(0, 16);
  console.log('== ' + f + ' [' + hash + '] ==');
  console.log(raw);
}
