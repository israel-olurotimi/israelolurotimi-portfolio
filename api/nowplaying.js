module.exports = async (req, res) => {
  try {
    const key = (process.env.LASTFM_API_KEY || '').trim();
    const user = (process.env.LASTFM_USER || '').trim();
    if (!key || !user) throw new Error('missing: ' + (!key ? 'LASTFM_API_KEY ' : '') + (!user ? 'LASTFM_USER' : ''));
    const r = await fetch(
      'https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&limit=1&format=json&user=' +
        encodeURIComponent(user) +
        '&api_key=' +
        encodeURIComponent(key), {signal: AbortSignal.timeout(8000)}
    );
    const data = await r.json();
    if (!r.ok || data.error) throw new Error('lastfm: ' + (data.message || r.status));

    const t = [].concat(data.recenttracks.track)[0];
    if (!t) throw new Error('no tracks yet');

    const playing = !!(t['@attr'] && t['@attr'].nowplaying === 'true');
    const img = (t.image || []).filter(i => i['#text']).pop();
    const art =
      img && !/2a96cbd8b46e442fc41c2b86b821562f/.test(img['#text']) ? img['#text'] : '';

    res.setHeader('Cache-Control', 's-maxage=20, stale-while-revalidate=60');
    res.status(200).json({
      playing,
      title: t.name,
      artist: t.artist['#text'],
      art,
      at: playing || !t.date ? null : +t.date.uts
    });
  } catch (e) {
    res.status(502).json({ error: 'feed', unavailable: true });
  }
};
