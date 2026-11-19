(() => {
 const entry=document.querySelector('.entry-screen');
 if(!entry||!entry.showModal)return;
 document.body.classList.add('intro-ready');
 const button=entry.querySelector('.entry-button');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let closing=false;
 const seen=()=>{try{return sessionStorage.getItem('ibn-majdi-entered')==='yes'}catch{return false}};
 function open(){
  closing=false;entry.classList.remove('entry-leaving');entry.showModal();document.body.classList.add('entry-open');
  button.focus({preventScroll:true});
 }
 function finish(){
  entry.close();entry.classList.remove('entry-leaving');document.body.classList.remove('entry-open');
  document.querySelector('.home-hero h1').setAttribute('tabindex','-1');
  document.querySelector('.home-hero h1').focus({preventScroll:true});
 }
 function enter(){
  if(closing)return;closing=true;
  try{sessionStorage.setItem('ibn-majdi-entered','yes')}catch{}
  entry.classList.add('entry-leaving');
  if(reduced.matches)finish();else setTimeout(finish,650);
 }
 button.addEventListener('click',enter);
 entry.addEventListener('cancel',e=>{e.preventDefault();enter()});
 entry.addEventListener('pointermove',e=>{
  if(reduced.matches||e.pointerType==='touch')return;
  const x=(e.clientX/innerWidth-.5),y=(e.clientY/innerHeight-.5);
  entry.style.setProperty('--entry-x',`${x*12}px`);entry.style.setProperty('--entry-y',`${y*12}px`);
 });
 entry.addEventListener('pointerleave',()=>{entry.style.setProperty('--entry-x','0px');entry.style.setProperty('--entry-y','0px')});
 document.querySelector('.replay-intro').addEventListener('click',open);
 if(!seen()||new URLSearchParams(location.search).get('intro')==='1')open();
})();
