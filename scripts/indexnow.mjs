// Notify Bing / IndexNow engines of every URL in the live sitemap. Run after each deploy:
//   node scripts/indexnow.mjs
const KEY = '0f89b4021052cb6aa6562ca84f1a472e';
const HOST = 'hirecook.pk';
const xml = await (await fetch('https://' + HOST + '/sitemap.xml')).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: 'https://' + HOST + '/' + KEY + '.txt', urlList: urls.slice(0, 10000) }),
});
console.log('IndexNow:', res.status, urls.length, 'URLs submitted');
