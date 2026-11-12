const {spawn} = require('node:child_process');
const fs = require('node:fs');
try {
  const {app} = require('./caminhos.cjs').findSolidCraft();
  if (!fs.existsSync(app)) throw new Error('solidcraft.exe nao encontrado ao lado do CLI.');
  const child = spawn(app, ['--control', '7878'], {detached:true, stdio:'ignore', windowsHide:false});
  child.on('error', e => {console.error(e.message);process.exitCode=1;});
  child.unref();
} catch(e) {console.error(e.message);process.exitCode=1;}
