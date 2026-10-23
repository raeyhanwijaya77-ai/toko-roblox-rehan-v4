const fs = require('fs'), path = require('path');
for (const f of fs.readdirSync('.')) {
  if (f === 'app__error.js') { fs.unlinkSync(f); continue; }
  if (!f.includes('__') || f.startsWith('.')) continue;
  const p = f.split('__').map((s) => (s === 'IDX' ? '[id]' : s)).join('/');
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.renameSync(f, p);
}
