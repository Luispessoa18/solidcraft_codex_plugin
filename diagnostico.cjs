const {spawn}=require('node:child_process');
const fs=require('node:fs');
const path=require('node:path');
const base=path.join(process.env.LOCALAPPDATA,'SolidCraft');
for(const dir of [base,path.join(process.env.APPDATA,'SolidCraft','data')]) {
  for(const sub of ['control','']) {
    const p=path.join(dir,sub,'current.port');
    try { if(fs.existsSync(p)) console.log('Porta descoberta: '+fs.readFileSync(p,'utf8').trim()); }
    catch(e) { console.error('Nao foi possivel ler a porta de descoberta: '+e.code); }
  }
}
const child=spawn(require('./caminhos.cjs').findSolidCraft().cli,['mcp','--connect','127.0.0.1:7878'],{windowsHide:true});
let buffer='';
const timer=setTimeout(()=>{console.error('Sem resposta em 15 segundos. Ative o controle no aplicativo ou abra pelo iniciar.cmd.');child.kill();process.exitCode=1;},15000);
child.stderr.on('data',d=>process.stderr.write(d));
child.stdout.on('data',d=>{
 buffer+=d; let i;
 while((i=buffer.indexOf('\n'))>=0){const line=buffer.slice(0,i);buffer=buffer.slice(i+1);let r;try{r=JSON.parse(line);}catch{continue;}
 if(r.id===1){child.stdin.write(JSON.stringify({jsonrpc:'2.0',method:'notifications/initialized'})+'\n');child.stdin.write(JSON.stringify({jsonrpc:'2.0',id:2,method:'tools/list',params:{}})+'\n');}
 if(r.id===2){console.log('Ferramentas MCP: '+(r.result?.tools||[]).map(t=>t.name).join(', ')); const t=r.result?.tools?.find(t=>t.name==='inspect_design'); if(t){child.stdin.write(JSON.stringify({jsonrpc:'2.0',id:3,method:'tools/call',params:{name:t.name,arguments:{}}})+'\n');}else{clearTimeout(timer);child.kill();process.exitCode=1;}}
 if(r.id===3){console.log(JSON.stringify(r,null,2));clearTimeout(timer);child.kill();if(r.error||r.result?.isError)process.exitCode=1;}
 }
});
child.on('error',e=>{clearTimeout(timer);console.error(e.message);process.exitCode=1;});
child.stdin.write(JSON.stringify({jsonrpc:'2.0',id:1,method:'initialize',params:{protocolVersion:'2024-11-05',capabilities:{},clientInfo:{name:'solidcraft-codex-check',version:'1.0.0'}}})+'\n');
