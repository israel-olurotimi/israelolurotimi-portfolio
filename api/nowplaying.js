module.exports = async (req, res) => {
  try {
    const { LASTFM_API_KEY: key, LASTFM_USER: user } = process.env;
    const r = await fetch('https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&limit=1&format=json&user=' + encodeURIComponent(user) + '&api_key=' + key);
    if (!r.ok) throw new Error('lastfm');
    const t = [].concat((await r.json()).recenttracks.track)[0];
    const playing = !!(t['@attr'] && t['@attr'].nowplaying === 'true');
    const img = (t.image || []).filter(i => i['#text']).pop();
    const art = img && !/2a96cbd8b46e442fc41c2b86b821562f/.test(img['#text']) ? img['#text'] : '';
    res.setHeader('Cache-Control', 's-maxage=20, stale-while-revalidate=60');
    res.status(200).json({ playing, title: t.name, artist: t.artist['#text'], art, at: playing || !t.date ? null : +t.date.uts });
  } catch (e) {
    res.status(502).json({ error: 'feed' });
  }
};
