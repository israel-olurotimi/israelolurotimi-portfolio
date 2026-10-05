const C='io-v2';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).pathname.startsWith('/api/'))return;
if(r.mode==='navigate')e.respondWith(fetch(r).then(x=>{if(x.ok){const c=x.clone();caches.open(C).then(k=>k.put('/',c))}return x}).catch(()=>caches.match('/')))});
