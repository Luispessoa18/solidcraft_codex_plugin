const fs = require('node:fs');
const path = require('node:path');
function findSolidCraft() {
  const candidates = [process.env.SOLIDCRAFT_CLI,
    path.join(process.env.ProgramFiles || 'C:/Program Files', 'SolidCraft', 'solidcraft-cli.exe'),
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Programs', 'SolidCraft', 'solidcraft-cli.exe')].filter(Boolean);
  const cli = candidates.find(p => fs.existsSync(p));
  if (!cli) throw new Error('SolidCraft nao encontrado. Defina SOLIDCRAFT_CLI com o caminho de solidcraft-cli.exe.');
  return {cli, app:path.join(path.dirname(cli), 'solidcraft.exe')};
}
module.exports = {findSolidCraft};
