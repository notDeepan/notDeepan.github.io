import {cp,mkdir,writeFile} from 'node:fs/promises';
import {resolve,relative,sep} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';

const root=process.cwd();
// Fresh isolated build: the Node contact route remains available in the source.
const stage=resolve(root,'artifacts',`pages-${Date.now()}`);
await mkdir(stage,{recursive:true});
for(const file of ['package.json','package-lock.json','next.config.ts','next-env.d.ts','tsconfig.json']){
  await cp(resolve(root,file),resolve(stage,file));
}
for(const dir of ['src','public']){
  await cp(resolve(root,dir),resolve(stage,dir),{recursive:true,filter:source=>{
    const path=relative(root,source).split(sep).join('/');
    return !path.includes('graphify-out') && !/(^|\/)src\/app\/api(\/|$)/.test(path);
  }});
}
const require=createRequire(import.meta.url);
const result=spawnSync(process.execPath,[require.resolve('next/dist/bin/next'),'build'],{
  cwd:stage,stdio:'inherit',env:{...process.env,NODE_ENV:'production',NEXT_PUBLIC_STATIC_EXPORT:'1',NEXT_PUBLIC_BASE_PATH:'/pixel-rice'},
});
if(result.status!==0)process.exit(result.status || 1);
await writeFile(resolve(stage,'out','.nojekyll'),'');
await writeFile(resolve(root,'artifacts','pages-output.json'),JSON.stringify({directory:resolve(stage,'out'),basePath:'/pixel-rice'},null,2));
console.log(`GitHub Pages output: ${resolve(stage,'out')}`);
