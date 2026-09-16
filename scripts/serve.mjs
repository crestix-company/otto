import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const port=Number(process.env.PORT||4214);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.webp':'image/webp','.svg':'image/svg+xml'};
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');let relative=decodeURIComponent(url.pathname);if(relative.endsWith('/'))relative+='index.html';let file=path.resolve(root,'.'+relative);if(!file.startsWith(root+path.sep))throw new Error('Invalid path');try{await stat(file);}catch{if(!path.extname(file))file+='.html';await stat(file);}const bytes=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(bytes);}catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await readFile(path.join(root,'404.html')));}}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}/`));
