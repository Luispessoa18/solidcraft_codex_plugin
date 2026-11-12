const fs = require('node:fs');
const path = require('node:path');
try {
  const {cli} = require('./caminhos.cjs').findSolidCraft();
  if (cli.includes("'") || /[\r\n]/.test(cli)) throw new Error('Caminho do SolidCraft nao suportado pelo instalador.');
  const target = path.join(process.env.LOCALAPPDATA, 'SolidCraft', 'plugins', 'codex-control');
  const config = path.join(process.env.CODEX_HOME || path.join(process.env.USERPROFILE, '.codex'), 'config.toml');
  const text = fs.existsSync(config) ? fs.readFileSync(config, 'utf8') : '';
  const block = `[mcp_servers.solidcraft-live]\r\ncommand = '${cli}'\r\nargs = ["mcp", "--connect", "127.0.0.1:7878"]\r\n\r\n`;
  const section = /^\[mcp_servers\.solidcraft-live\][^\r\n]*\r?\n[\s\S]*?(?=^\[|(?![\s\S]))/m;
  const updated = section.test(text) ? text.replace(section, () => block) : text.trimEnd() + '\r\n\r\n' + block;
  fs.mkdirSync(target, {recursive:true});
  for (const name of ['plugin.json', 'README.md', 'LICENSE', 'caminhos.cjs', 'iniciar.cjs', 'iniciar.cmd', 'diagnostico.cjs', 'diagnostico.cmd', 'instalar.cjs', 'instalar.cmd']) {
    const src = path.join(__dirname, name), dest = path.join(target, name);
    if (path.resolve(src).toLowerCase() !== path.resolve(dest).toLowerCase()) fs.copyFileSync(src, dest);
  }
  fs.mkdirSync(path.dirname(config), {recursive:true});
  if (text !== updated) {
    if (fs.existsSync(config)) fs.copyFileSync(config, config + '.backup-' + Date.now(), fs.constants.COPYFILE_EXCL);
    const temp = config + '.tmp-' + process.pid;
    fs.writeFileSync(temp, updated, {encoding:'utf8',flag:'wx'});
    fs.renameSync(temp, config);
  }
  console.log('Integracao instalada em ' + target);
  console.log('Salve seu projeto, feche o SolidCraft e abra iniciar.cmd. Depois reabra o Codex.');
} catch (error) {
  console.error('Falha na instalacao: ' + error.message);
  process.exitCode = 1;
}
