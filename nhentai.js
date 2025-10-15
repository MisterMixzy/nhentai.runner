{
  "name": "nhentai",
  "version": "1.1",
  "baseUrl": "https://nhentai.net",
  "lang": "en",
  "isNSFW": true,
  "headers": {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
  },

  "list": async (page) => {
    const url = `${baseUrl}/api/galleries/all?page=${page}`;
    const response = await fetch(url, { headers: headers });
    const data = await response.json();
    
    const galleries = [];
    data.result.forEach(item => {
      const title = item.title.english || item.title.japanese || "Untitled";
      const id = item.id.toString();
      const media_id = item.media_id;
      const coverType = item.images.cover.t === 'j' ? 'jpg' : item.images.cover.t === 'p' ? 'png' : 'gif';
      const cover = `https://t.nhentai.net/galleries/${media_id}/cover.${coverType}`;
      galleries.push({ title, id, cover });
    });
    return galleries;
  },

  "search": async (query, page) => {
    const url = `${baseUrl}/api/galleries/search?query=${encodeURIComponent(query)}&page=${page}`;
    const response = await fetch(url, { headers: headers });
    const data = await response.json();
    
    const galleries = [];
    data.result.forEach(item => {
      const title = item.title.english || item.title.japanese || "Untitled";
      const id = item.id.toString();
      const media_id = item.media_id;
      const coverType = item.images.cover.t === 'j' ? 'jpg' : item.images.cover.t === 'p' ? 'png' : 'gif';
      const cover = `https://t.nhentai.net/galleries/${media_id}/cover.${coverType}`;
      galleries.push({ title, id, cover });
    });
    return galleries;
  },

  "details": async (id) => {
    const url = `${baseUrl}/api/gallery/${id}`;
    const response = await fetch(url, { headers: headers });
    const data = await response.json();
    
    const title = data.title.english || data.title.japanese || "Untitled";
    const media_id = data.media_id;
    const coverType = data.images.cover.t === 'j' ? 'jpg' : data.images.cover.t === 'p' ? 'png' : 'gif';
    const cover = `https://t.nhentai.net/galleries/${media_id}/cover.${coverType}`;
    
    const pages = data.images.pages.map((page, index) => {
      const ext = page.t === 'j' ? 'jpg' : page.t === 'p' ? 'png' : 'gif';
      return `https://i.nhentai.net/galleries/${media_id}/${index + 1}.${ext}`;
    });
    
    return { title, cover, pages };
  },

  "chapter": async (id, pageNum) => {
    const details = await details(id);  // Reuse details to get pages
    return details.pages[pageNum - 1] || null;
  }
}