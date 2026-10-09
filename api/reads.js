module.exports = async (req, res) => {
  try {
    let token = (process.env.HARDCOVER_API_TOKEN || '').trim();
    if (!token) throw new Error('missing HARDCOVER_API_TOKEN');
    if (!/^Bearer /i.test(token)) token = 'Bearer ' + token;

    const query = `query {
      me {
        current: user_books(where: {status_id: {_eq: 2}}, limit: 1) {
          book { title pages cached_image cached_contributors }
          user_book_reads { progress_pages }
        }
        finished: user_books(where: {status_id: {_eq: 3}}, order_by: {updated_at: desc}, limit: 8) {
          book { title cached_image cached_contributors }
        }
      }
    }`;

    const r = await fetch('https://api.hardcover.app/v1/graphql', {
      method: 'POST',
      signal: AbortSignal.timeout(8000),
      headers: { 'Content-Type': 'application/json', authorization: token },
      body: JSON.stringify({ query })
    });
    const j = await r.json();
    if (!r.ok || j.errors) {
      throw new Error('hardcover: ' + (j.errors ? j.errors[0].message : r.status));
    }

    const me = [].concat(j.data.me)[0] || {};
    const author = b => {
      const c = b.cached_contributors;
      return c && c[0] && c[0].author ? c[0].author.name : '';
    };
    const cover = b => (b.cached_image && b.cached_image.url) || '';

    const current = (me.current || []).map(u => {
      const reads = u.user_book_reads || [];
      const pg = reads.length ? reads[reads.length - 1].progress_pages || 0 : 0;
      const total = u.book.pages || 0;
      return {
        title: u.book.title,
        author: author(u.book),
        cover: cover(u.book),
        progress: total ? Math.min(100, Math.round((pg / total) * 100)) : 0
      };
    });

    const read = (me.finished || []).map(u => ({
      title: u.book.title,
      cover: cover(u.book)
    }));

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json({ current, read });
  } catch (e) {
    res.status(502).json({ error: 'feed', unavailable: true });
  }
};
