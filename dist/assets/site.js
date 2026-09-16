const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.mobile-nav');
function closeMenu(returnFocus=false){nav.hidden=true;toggle.setAttribute('aria-expanded','false');if(returnFocus)toggle.focus();}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';nav.hidden=open;toggle.setAttribute('aria-expanded',String(!open));});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!nav.hidden)closeMenu(true);});
document.addEventListener('click',e=>{if(!nav.hidden&&!e.target.closest('.site-header'))closeMenu();});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeMenu()));
matchMedia('(min-width:801px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
if('IntersectionObserver' in window&&!reducedMotion.matches){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}
let frame=false;
function progress(){const h=document.documentElement.scrollHeight-innerHeight;document.querySelector('.reading-progress').style.transform=`scaleX(${h>0?scrollY/h:0})`;frame=false;}
addEventListener('scroll',()=>{if(!frame){frame=true;requestAnimationFrame(progress);}}, {passive:true});
addEventListener('resize',progress);progress();
const slides=[...document.querySelectorAll('.gallery-slide')];
if(slides.length){let active=0;const count=document.querySelector('[data-count]'),status=document.querySelector('[data-gallery-status]');function show(delta){active=(active+delta+slides.length)%slides.length;slides.forEach((el,i)=>el.hidden=i!==active);count.textContent=`${String(active+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;status.textContent=slides[active].querySelector('figcaption').textContent;}
document.querySelector('[data-next]').addEventListener('click',()=>show(1));document.querySelector('[data-prev]').addEventListener('click',()=>show(-1));}
document.querySelectorAll('.language-nav a').forEach(a=>{if(location.hash)a.href+=location.hash;});
