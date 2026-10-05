const C='io-v1';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).pathname.startsWith('/api/'))return;
if(r.mode==='navigate')e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(C).then(k=>k.put('/',c));return x}).catch(()=>caches.match('/')))});
