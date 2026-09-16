import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const base=process.argv[2];
async function walk(dir){const paths=[];for(const f of await readdir(dir,{withFileTypes:true})){if(f.isDirectory())paths.push(...await walk(path.join(dir,f.name)));else paths.push(path.join(dir,f.name));}return paths;}
const files=await walk(root),pages=files.filter(f=>f.endsWith('.html'));
assert.equal(pages.length,9,'Eight JP/EN pages + 404 required');
for(const f of files)assert.ok((await stat(f)).size>0,`${f} empty`);
for(const page of pages){const text=await readFile(page,'utf8'),relative=path.relative(root,page);assert.ok(text.startsWith('<!doctype html>'));assert.ok(text.includes('<html lang="'+(relative.startsWith('en/')?'en':'ja')+'">'));assert.equal((text.match(/<h1[ >]/g)||[]).length,1);assert.ok(!/TODO|Lorem ipsum|mailto:|andriverkatsuura|要確認|準備中/.test(text));assert.ok(text.includes('tel:+819064746012'));assert.ok(text.includes('catering_restaurant_otto'));for(const match of text.matchAll(/(?:src|href)="([^"]+)"/g)){const href=match[1];if(/^(?:https?:|tel:|data:)/.test(href))continue;const [pathname,hash]=href.split('#');const target=pathname?path.resolve(pathname.startsWith('/')?root:path.dirname(page),'.'+(pathname.startsWith('/')?pathname:'/'+pathname)):page;const candidate=pathname==='/'?path.join(root,'index.html'):target;assert.ok((await stat(candidate)).isFile(),`${relative}: missing ${href}`);if(hash){const html=await readFile(candidate,'utf8');assert.ok(html.includes(`id="${hash}"`),`${relative}: missing fragment ${href}`);}}
 if(!relative.includes('404'))assert.ok(text.includes('090-6474-6012')||text.includes('+81 90-6474-6012'));
 if(base){const response=await fetch(new URL(relative,base));assert.equal(response.status,200,relative);assert.equal(await response.text(),text,`${relative} served version mismatch`);}
}
const index=await readFile(path.join(root,'index.html'),'utf8');assert.ok(index.indexOf('id="story"')<index.indexOf('class="services'));assert.ok(index.includes('41歳'));assert.ok(index.includes('究極のお節介'));assert.ok(index.includes('出張職場体験'));
for(const lang of ['','en/']){const html=await readFile(path.join(root,lang,'restaurant.html'),'utf8');for(const value of ['2,800','8,000','14:30','21:30'])assert.ok(html.includes(value));const catering=await readFile(path.join(root,lang,'catering.html'),'utf8');assert.equal((catering.match(/class="gallery-slide"/g)||[]).length,4);}
if(base){for(const f of files.filter(f=>f.includes('/assets/'))){const response=await fetch(new URL(path.relative(root,f),base));assert.equal(response.status,200,f);assert.equal((await response.arrayBuffer()).byteLength,(await stat(f)).size,f);}const response=await fetch(new URL('not-a-real-page-otto',base));assert.equal(response.status,404);assert.ok((await response.text()).includes('ページが見つかりません'));}
console.log(`PASS: ${pages.length} pages, ${files.length-pages.length} support files, links, photos, language pairs, business facts${base?', exact served HTML/assets and 404':''}.`);
