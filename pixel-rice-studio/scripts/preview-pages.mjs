import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const {directory,basePath}=JSON.parse(await readFile('artifacts/pages-output.json','utf8'));
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff','.txt':'text/plain'};
createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://127.0.0.1');
    if(!url.pathname.startsWith(basePath+'/')){res.writeHead(404);res.end();return;}
    let file=resolve(directory,'.'+decodeURIComponent(url.pathname.slice(basePath.length)));
    if(file!==directory && !file.startsWith(directory+sep)){res.writeHead(403);res.end();return;}
    if((await stat(file)).isDirectory())file=resolve(file,'index.html');
    res.setHeader('Content-Type',mime[extname(file)] || 'application/octet-stream');
    res.end(await readFile(file));
  }catch{res.writeHead(404);res.end();}
}).listen(3002,'127.0.0.1',()=>console.log(`Static preview: http://127.0.0.1:3002${basePath}/`));
