// /api/scores: Pong leaderboard on Upstash Redis (REST, no npm packages).
// Env vars (added automatically by the Vercel Upstash/KV integration):
//   KV_REST_API_URL + KV_REST_API_TOKEN  (or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN)
import { randomBytes, createHash } from 'node:crypto';

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
// Preview deploys use their own keys so test scores never reach the live board.
const P = process.env.VERCEL_ENV === 'production' ? 'pong' : 'pongdev';
const Z = P + ':scores', KEEP = 50, SHOW = 10;

const run = async (...cmds) => {
  const r = await fetch(URL_ + '/pipeline', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + TOKEN, 'content-type': 'application/json' },
    body: JSON.stringify(cmds),
  });
  if (!r.ok) throw new Error('redis ' + r.status);
  return (await r.json()).map((x) => x.result);
};
const sha = (s) => createHash('sha256').update(String(s)).digest('hex');
const calc = (a, b, r, h) => Math.max(0, a * 100 - b * 35 + Math.min(r, 30) * 15 + (a >= 7 ? 500 : 0)) * (h ? 2 : 1);
const int = (v, max) => (Number.isInteger(v) && v >= 0 && v <= max ? v : null);

async function top() {
  const [flat] = await run(['ZREVRANGE', Z, 0, SHOW - 1, 'WITHSCORES']);
  const out = [];
  for (let i = 0; i < flat.length; i += 2) {
    const [id, n] = flat[i].split(':');
    out.push({ id, n, s: Number(flat[i + 1]) });
  }
  return out;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!URL_ || !TOKEN) return res.status(503).json({ error: 'db not configured' });
  try {
    if (req.method === 'GET') return res.status(200).json({ scores: await top() });

    const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};

    if (req.method === 'POST') {
      const n = String(b.n || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
      const you = int(b.you, 20), cl = int(b.cl, 20), r = int(b.r, 500), ms = int(b.ms, 3.6e6);
      if (n.length < 2 || you === null || cl === null || r === null || ms === null) return res.status(400).json({ error: 'bad score' });
      if (ms < 1200 * (you + cl)) return res.status(400).json({ error: 'too fast' }); // a point takes longer than this
      const score = calc(you, cl, r, !!b.h);
      if (score <= 0) return res.status(400).json({ error: 'no score' });

      const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'x';
      const [gate] = await run(['SET', P + ':rl:' + sha(ip), 1, 'NX', 'EX', 20]);
      if (!gate) return res.status(429).json({ error: 'slow down' });

      const id = randomBytes(5).toString('hex'), tok = randomBytes(16).toString('hex');
      await run(
        ['ZADD', Z, score, id + ':' + n],
        ['SET', P + ':tok:' + id, sha(tok), 'EX', 60 * 60 * 24 * 90],
        ['ZREMRANGEBYRANK', Z, 0, -(KEEP + 1)],
      );
      return res.status(200).json({ scores: await top(), score, id, tok });
    }

    if (req.method === 'DELETE') {
      const id = String(b.id || '').replace(/[^A-Za-z0-9]/g, ''), tok = String(b.tok || '');
      if (!id || !tok) return res.status(400).json({ error: 'bad request' });
      const [saved] = await run(['GET', P + ':tok:' + id]);
      if (!saved || saved !== sha(tok)) return res.status(403).json({ error: 'not yours' });
      const [all] = await run(['ZRANGE', Z, 0, -1]);
      const hit = all.find((m) => m.startsWith(id + ':'));
      await run(...(hit ? [['ZREM', Z, hit]] : []), ['DEL', P + ':tok:' + id]);
      return res.status(200).json({ scores: await top() });
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'method' });
  } catch (e) {
    return res.status(500).json({ error: 'server' });
  }
}
