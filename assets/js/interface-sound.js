
/* Soft interface tap: gesture initiated, never auto-plays or interrupts navigation. */
(()=>{let context=null,last=0;const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
document.addEventListener('pointerdown',e=>{
  if(reduced.matches || !e.isTrusted || e.button>0 || Date.now()-last<85)return;
  if(!e.target.closest('button,a,[role="button"],[role="tab"],.pill,.pill2,.tab,.btn'))return;
  try {
    const AudioContextClass=window.AudioContext||window.webkitAudioContext;
    if(!AudioContextClass)return;
    if(!context)context=new AudioContextClass();
    if(context.state==='suspended')context.resume().catch(()=>{});
    const t=context.currentTime,osc=context.createOscillator(),gain=context.createGain();
    osc.type='sine';osc.frequency.setValueAtTime(510,t);osc.frequency.exponentialRampToValueAtTime(320,t+0.047);
    gain.gain.setValueAtTime(0.0001,t);gain.gain.exponentialRampToValueAtTime(0.018,t+0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001,t+0.065);
    osc.connect(gain);gain.connect(context.destination);osc.start(t);osc.stop(t+0.07);last=Date.now();
  }catch(_){}
},{passive:true,capture:true});
})();
