document.getElementById('year').textContent=new Date().getFullYear();document.getElementById('join-button').addEventListener('click',()=>{alert('¡Gracias por tu interés! Estamos preparando las suscripciones. Muy pronto vas a poder sumarte.');});
(function(){
'use strict';
const grid=document.getElementById('public-recipe-grid');
const sample=document.getElementById('sample-recipes');
const note=document.getElementById('demo-note');
const msg=document.getElementById('recipe-load-message');
const dialog=document.getElementById('recipe-dialog');
const detail=document.getElementById('recipe-detail');
const close=document.getElementById('close-recipe');
const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=String(text);return node;};
const list=(items,ordered)=>{const node=document.createElement(ordered?'ol':'ul');for(const item of Array.isArray(items)?items:[]){node.append(el('li','',typeof item==='string'?item:JSON.stringify(item)));}return node;};
function openRecipe(recipe){
detail.replaceChildren();
if(recipe.imagen_url){const img=el('img','detail-image');img.src=recipe.imagen_url;img.alt=recipe.titulo;detail.append(img);}
detail.append(el('span','recipe-tag',recipe.categoria||'RECETA'),el('h2','',recipe.titulo));
if(recipe.descripcion)detail.append(el('p','detail-description',recipe.descripcion));
const bits=[];if(recipe.minutos)bits.push(recipe.minutos+' minutos');if(recipe.porciones)bits.push(recipe.porciones+' porciones');
if(bits.length)detail.append(el('p','detail-meta',bits.join(' · ')));
detail.append(el('h3','','Ingredientes'),list(recipe.ingredientes,false),el('h3','','Preparación'),list(recipe.pasos,true));
dialog.showModal();
}
close.addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
async function load(){
try{
const db=window.supabase.createClient(window.MSS_SUPABASE_URL,window.MSS_SUPABASE_KEY);
const {data,error}=await db.from('recetas').select('id,titulo,descripcion,categoria,minutos,porciones,imagen_url,ingredientes,pasos').eq('publicada',true).order('created_at',{ascending:false});
if(error)throw error;
if(!data||!data.length)return;
grid.replaceChildren();
for(const r of data){
const card=el('article','recipe-card');
const photo=el('div','recipe-image');
if(r.imagen_url){photo.style.backgroundImage='url('+JSON.stringify(r.imagen_url)+')';}else{photo.classList.add('recipe-no-image');photo.textContent='✿';}
const body=el('div','recipe-body');
body.append(el('span','recipe-tag',(r.categoria||'RECETA').toUpperCase()),el('h3','',r.titulo),el('p','',r.descripcion||'Una receta rica para disfrutar cada día.'));
const button=el('button','recipe-view','Ver receta completa');
button.type='button';button.addEventListener('click',()=>openRecipe(r));
body.append(button);card.append(photo,body);grid.append(card);
}
grid.hidden=false;sample.hidden=true;note.hidden=true;
}catch(err){console.error('No se pudieron cargar las recetas',err);msg.textContent='Por ahora no pudimos cargar las recetas. Volvé a intentar más tarde.';msg.hidden=false;}
}
load();
})();