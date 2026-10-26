(function(){
  var S = window.CP_SITE;
  var $ = function(id){ return document.getElementById(id); };
  var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
  var fmt = function(t){ t = Math.max(0, Math.floor(t || 0)); return Math.floor(t/60) + ':' + String(t%60).padStart(2,'0'); };
  var PLAY_ICON = '<svg width="16" height="16" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 1l11 6-11 6z" fill="currentColor"></path></svg>';

  /* ---------- static content from config ---------- */
  $('updated').textContent = S.updated;
  $('maintLink').href = S.maintainer.url;
  var rel = S.hero.release;
  $('heroChip').href = rel.link;
  $('heroChipLabel').textContent = rel.label;
  $('heroChipTitle').textContent = rel.title + ' — ' + rel.feat;

  var tick = S.collabs.map(function(c){ return c.title + ' ✕ ' + c.with; }).concat(['UP! ✕ Forrest Frank','Paperboys ✕ Nic D']).join(' — ').toUpperCase() + ' —';
  $('ticker').innerHTML = '<span>' + esc(tick) + '</span><span>' + esc(tick) + '</span>';

  $('stats').innerHTML = S.stats.map(function(s){ return '<div class="stat"><strong>' + esc(s.value) + '</strong><span class="mono">' + esc(s.label) + '</span></div>'; }).join('');

  $('socials').innerHTML = S.socials.map(function(s){ return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.name) + '</a>'; }).join('');

  /* ---------- mobile menu ---------- */
  var top = $('top'), menuBtn = $('menuBtn');
  menuBtn.addEventListener('click', function(){
    var open = top.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  $('nav').addEventListener('click', function(e){ if (e.target.tagName === 'A'){ top.classList.remove('open'); menuBtn.setAttribute('aria-expanded','false'); } });

  /* ---------- YouTube API (loads on the live domain; blocked previews fall back cleanly) ---------- */
  var yt = { ready:false, failed:false, queue:[] };
  function whenYT(fn){ if (yt.ready) fn(); else if (!yt.failed) yt.queue.push(fn); }
  window.onYouTubeIframeAPIReady = function(){ yt.ready = true; yt.queue.splice(0).forEach(function(f){ f(); }); };
  (function(){
    var s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.onerror = function(){ yt.failed = true; yt.queue = []; };
    document.head.appendChild(s);
    setTimeout(function(){ if (!yt.ready) yt.failed = true; }, 8000);
  })();

  /* ---------- hero film ---------- */
  var hero = $('home'), heroMedia = $('heroMedia'), heroPlayer = null;
  function coverHero(){
    var f = heroMedia.querySelector('iframe'); if (!f) return;
    var w = heroMedia.clientWidth, h = heroMedia.clientHeight;
    if (w / h > 16/9){ f.style.width = w + 'px'; f.style.height = Math.ceil(w * 9/16) + 'px'; }
    else { f.style.height = h + 'px'; f.style.width = Math.ceil(h * 16/9) + 'px'; }
  }
  if (S.hero.mp4){
    var v = document.createElement('video');
    v.src = S.hero.mp4; v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true; v.setAttribute('playsinline','');
    v.addEventListener('playing', function(){ hero.classList.add('is-live'); });
    heroMedia.appendChild(v);
  } else if (S.hero.youtube){
    whenYT(function(){
      heroPlayer = new YT.Player('heroYT', {
        videoId: S.hero.youtube,
        host: 'https://www.youtube-nocookie.com',
        playerVars: { autoplay:1, mute:1, controls:0, loop:1, playlist:S.hero.youtube, playsinline:1, rel:0, modestbranding:1, iv_load_policy:3, disablekb:1, start:S.hero.startAt || 0 },
        events: {
          onReady: function(e){ e.target.mute(); e.target.playVideo(); coverHero(); },
          onStateChange: function(e){ if (e.data === 1) hero.classList.add('is-live'); }
        }
      });
    });
    window.addEventListener('resize', coverHero);
  }
  if ('IntersectionObserver' in window){
    new IntersectionObserver(function(es){
      es.forEach(function(en){
        if (!heroPlayer || !heroPlayer.playVideo) return;
        if (en.isIntersecting) heroPlayer.playVideo(); else heroPlayer.pauseVideo();
      });
    }).observe(hero);
  }

  /* ---------- player ---------- */
  var P = { i:0, playing:false, mode:null, audio:null, ytp:null, ytPending:null };
  var tracks = S.tracks;

  $('tracklist').innerHTML = tracks.map(function(t, i){
    return '<button type="button" class="track" data-i="' + i + '" aria-label="Play ' + esc(t.title) + '">' +
      '<span class="n">' + String(i+1).padStart(2,'0') + '</span>' +
      '<span class="t"><strong>' + esc(t.title) + '</strong><span>' + esc(t.feat) + '</span></span>' +
      '<span class="tag mono">' + esc(t.tag) + '</span>' +
      '<span class="ico"><span class="eq" aria-hidden="true"><b></b><b></b><b></b><b></b></span></span>' +
    '</button>';
  }).join('');
  $('tracklist').addEventListener('click', function(e){
    var b = e.target.closest('.track'); if (!b) return;
    var i = +b.dataset.i;
    if (i === P.i && P.mode) toggle(); else play(i);
  });

  function paintTrack(){
    var t = tracks[P.i];
    $('nowTitle').textContent = t.title;
    $('nowFeat').textContent = 'Connor Price ' + t.feat;
    $('sleeveTitle').textContent = t.title;
    $('fullLink').href = t.link;
    $('miniLabel').textContent = t.title + ' · official video';
    document.querySelectorAll('.track').forEach(function(el){ el.classList.toggle('is-current', +el.dataset.i === P.i); });
  }
  function setPlaying(on){
    P.playing = on;
    document.body.classList.toggle('is-playing', on);
    $('playBtn').setAttribute('aria-label', on ? 'Pause' : 'Play');
  }
  function note(html){ var n = $('dockNote'); if (!html){ n.hidden = true; return; } n.innerHTML = html; n.hidden = false; }

  function stopAll(){
    if (P.audio){ P.audio.pause(); }
    if (P.ytp && P.ytp.pauseVideo) P.ytp.pauseVideo();
  }
  function play(i){
    P.i = (i + tracks.length) % tracks.length;
    var t = tracks[P.i];
    stopAll(); paintTrack(); note('');
    if (t.audio){
      P.mode = 'audio';
      $('mini').hidden = true;
      if (!P.audio){
        P.audio = new Audio();
        P.audio.preload = 'metadata';
        P.audio.addEventListener('play', function(){ if (P.mode === 'audio') setPlaying(true); });
        P.audio.addEventListener('pause', function(){ if (P.mode === 'audio') setPlaying(false); });
        P.audio.addEventListener('ended', function(){ play(P.i + 1); });
      }
      P.audio.src = t.audio;
      P.audio.play().catch(function(){ setPlaying(false); });
      return;
    }
    if (t.youtube){
      if (yt.failed){
        P.mode = null; setPlaying(false);
        note('Playback runs on the live site. <a href="' + esc(t.link) + '" target="_blank" rel="noopener">Play ' + esc(t.title) + ' in your app →</a>');
        return;
      }
      P.mode = 'yt';
      $('mini').hidden = false;
      whenYT(function(){
        if (P.ytp && P.ytp.loadVideoById){ P.ytp.loadVideoById(t.youtube); return; }
        if (P.ytPending) { P.ytPending = t.youtube; return; }
        P.ytPending = t.youtube;
        P.ytp = new YT.Player('miniYT', {
          videoId: t.youtube,
          host: 'https://www.youtube-nocookie.com',
          playerVars: { autoplay:1, controls:0, playsinline:1, rel:0, modestbranding:1, iv_load_policy:3 },
          events: {
            onReady: function(e){ if (P.ytPending && P.ytPending !== t.youtube) e.target.loadVideoById(P.ytPending); else e.target.playVideo(); P.ytPending = null; },
            onStateChange: function(e){
              if (P.mode !== 'yt') return;
              if (e.data === 1) setPlaying(true);
              else if (e.data === 2) setPlaying(false);
              else if (e.data === 0) play(P.i + 1);
            }
          }
        });
      });
      return;
    }
    window.open(t.link, '_blank', 'noopener');
  }
  function toggle(){
    if (!P.mode){ play(P.i); return; }
    if (P.mode === 'audio'){ P.audio.paused ? P.audio.play() : P.audio.pause(); return; }
    if (P.mode === 'yt' && P.ytp && P.ytp.getPlayerState){
      P.ytp.getPlayerState() === 1 ? P.ytp.pauseVideo() : P.ytp.playVideo();
    }
  }
  $('playBtn').addEventListener('click', toggle);
  $('nextBtn').addEventListener('click', function(){ play(P.i + 1); });
  $('prevBtn').addEventListener('click', function(){ play(P.i - 1); });
  $('heroPlay').addEventListener('click', function(){ play(0); });
  $('miniClose').addEventListener('click', function(){ stopAll(); setPlaying(false); P.mode = null; $('mini').hidden = true; });

  var seek = $('seek'), seeking = false;
  seek.addEventListener('input', function(){ seeking = true; seek.style.setProperty('--p', (seek.value/10) + '%'); });
  seek.addEventListener('change', function(){
    var f = seek.value / 1000;
    if (P.mode === 'audio' && P.audio.duration) P.audio.currentTime = f * P.audio.duration;
    if (P.mode === 'yt' && P.ytp && P.ytp.getDuration) P.ytp.seekTo(f * P.ytp.getDuration(), true);
    seeking = false;
  });
  setInterval(function(){
    var cur = 0, dur = 0;
    if (P.mode === 'audio' && P.audio){ cur = P.audio.currentTime; dur = P.audio.duration || 0; }
    else if (P.mode === 'yt' && P.ytp && P.ytp.getCurrentTime){ cur = P.ytp.getCurrentTime(); dur = P.ytp.getDuration() || 0; }
    $('tCur').textContent = fmt(cur); $('tDur').textContent = fmt(dur);
    if (!seeking){ var p = dur ? (cur/dur*1000) : 0; seek.value = p; seek.style.setProperty('--p', (p/10) + '%'); }
  }, 250);
  paintTrack();

  /* ---------- spin the globe: stop card ---------- */
  var stopI = 0, card = $('stopCard');
  $('stopDots').innerHTML = S.collabs.map(function(c, i){ return '<button type="button" data-i="' + i + '" aria-label="Stop ' + (i+1) + ': ' + esc(c.title) + '" aria-pressed="false">' + String(i+1).padStart(2,'0') + '</button>'; }).join('');
  function showStop(i){
    stopI = i;
    var c = S.collabs[i];
    $('stopNum').textContent = 'Stop ' + String(i+1).padStart(2,'0') + ' / ' + String(S.collabs.length).padStart(2,'0');
    $('stopOrigin').textContent = c.origin ? 'Origin · ' + c.origin : '';
    $('stopTitle').textContent = c.title;
    $('stopWith').textContent = 'with ' + c.with;
    $('stopStat').textContent = c.stat;
    document.querySelectorAll('#stopDots button').forEach(function(b){ b.setAttribute('aria-pressed', +b.dataset.i === i ? 'true' : 'false'); });
    card.classList.remove('flash'); void card.offsetWidth; card.classList.add('flash');
  }
  $('stopDots').addEventListener('click', function(e){ var b = e.target.closest('button'); if (b) showStop(+b.dataset.i); });
  $('stopPlay').addEventListener('click', function(){ play(S.collabs[stopI].track); });
  showStop(0);

  /* ---------- videos ---------- */
  $('vids').innerHTML = S.videos.map(function(v, i){
    return '<div class="vid"><div class="vid-frame" data-yt="' + esc(v.youtube) + '">' +
      (v.poster ? '<img src="' + esc(v.poster) + '" alt="">' : '') +
      '<button class="vid-play" type="button" aria-label="Play ' + esc(v.title) + ' video">' +
        '<span class="mono">Official video</span><span class="disc">' + PLAY_ICON.replace('currentColor','#0A0A0B') + '</span><span></span>' +
      '</button></div>' +
      '<div class="vid-cap"><span class="display">' + esc(v.title) + ' <span style="color:var(--mute);font-size:.7em">' + esc(v.with) + '</span></span><span class="mono">' + esc(v.views) + '</span></div></div>';
  }).join('');
  $('vids').addEventListener('click', function(e){
    var b = e.target.closest('.vid-play'); if (!b) return;
    var fr = b.parentNode, id = fr.dataset.yt;
    if (yt.failed){ window.open('https://www.youtube.com/watch?v=' + id, '_blank', 'noopener'); return; }
    stopAll(); setPlaying(false);
    fr.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0&playsinline=1" title="YouTube video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
  });
  $('rail').innerHTML = S.feed.map(function(f){
    return '<a class="reel" href="' + esc(f.url) + '" target="_blank" rel="noopener"><div class="reel-frame"><span class="mono">TikTok</span><span class="display">' + esc(f.title) + '</span></div><span class="mono">' + esc(f.meta) + '</span></a>';
  }).join('');

  /* ---------- tour ---------- */
  function renderShows(list, upcoming){
    $('shows').innerHTML = list.map(function(s){
      return '<div class="show"><span class="d">' + esc(s.date) + '</span><span class="c"><strong>' + esc(s.city) + '</strong><span>' + esc(s.venue) + '</span></span>' +
        (upcoming && s.url ? '<a class="s mono" href="' + esc(s.url) + '" target="_blank" rel="noopener">Tickets</a>' : '<span class="s mono">Played</span>') + '</div>';
    }).join('');
  }
  renderShows(S.tour.past, false);
  if (S.tour.bandsintownAppId){
    fetch('https://rest.bandsintown.com/artists/' + encodeURIComponent(S.tour.bandsintownArtist) + '/events?app_id=' + encodeURIComponent(S.tour.bandsintownAppId))
      .then(function(r){ return r.json(); })
      .then(function(ev){
        if (!Array.isArray(ev) || !ev.length) return;
        var m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        renderShows(ev.slice(0, 12).map(function(e){
          var d = new Date(e.datetime), v = e.venue || {};
          var off = (e.offers || [])[0];
          return { date: m[d.getMonth()] + ' ' + String(d.getDate()).padStart(2,'0'), city: [v.city, v.region || v.country].filter(Boolean).join(', '), venue: v.name || '', url: (off && off.url) || e.url };
        }), true);
        $('tourHead').innerHTML = 'On the road.<br>Pull up.';
        $('tourLede').textContent = 'Tickets go fast. Get on the list and hear about new dates before anyone else.';
        $('tourListLabel').textContent = 'Upcoming';
      }).catch(function(){});
  }
  $('alertForm').addEventListener('submit', function(e){
    e.preventDefault();
    var v = $('alertInput').value.trim(), msg = $('formMsg');
    var isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), isPhone = /^\+?[\d\s().-]{10,}$/.test(v);
    if (!isEmail && !isPhone){ msg.textContent = 'Enter an email like you@email.com or a phone number with area code.'; return; }
    if (S.alerts.webhook){
      msg.textContent = 'Adding you…';
      fetch(S.alerts.webhook, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(isEmail ? { email:v, source:'connorprice-site' } : { phone:v, source:'connorprice-site' }) })
        .then(function(r){ if (!r.ok) throw 0; msg.textContent = "You're on the list. Watch for the next drop."; $('alertInput').value = ''; })
        .catch(function(){ msg.innerHTML = 'That didn’t go through. <a href="' + esc(S.alerts.layloUrl) + '" target="_blank" rel="noopener">Sign up on Laylo instead →</a>'; });
    } else {
      msg.innerHTML = 'One more tap: <a href="' + esc(S.alerts.layloUrl) + '" target="_blank" rel="noopener">confirm on Laylo →</a>';
    }
  });

  /* ---------- shop ---------- */
  function renderProducts(list, live){
    $('shopGrid').innerHTML = list.map(function(p, i){
      var num = String(i+1).padStart(2,'0');
      var btn = p.soldOut
        ? '<span class="btn btn-line" aria-disabled="true">Sold out</span>'
        : (live && p.variant ? '<button class="btn btn-solid" type="button" data-variant="' + esc(p.variant) + '">Add to bag · checkout</button>'
                             : '<a class="btn btn-solid" href="' + esc(p.url) + '" target="_blank" rel="noopener">Shop it</a>');
      return '<article class="prod"><div class="prod-img' + (p.image ? ' has-img' : '') + '"><span class="prod-num" aria-hidden="true">' + num + '</span>' +
        (p.image ? '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy" onerror="this.parentNode.classList.remove(\'has-img\');this.remove()">' : '') +
        (p.soldOut ? '<span class="sold mono">Sold out</span>' : '') +
        '</div><div class="prod-body"><div class="prod-row"><strong>' + esc(p.name) + '</strong><span>' + esc(p.price) + '</span></div>' + btn + '</div></article>';
    }).join('');
  }
  renderProducts(S.shop.fallback, false);
  var sf = S.shop;
  function gql(q, vars){
    return fetch('https://' + sf.domain + '/api/' + sf.apiVersion + '/graphql.json', {
      method:'POST', headers:{ 'Content-Type':'application/json', 'X-Shopify-Storefront-Access-Token': sf.storefrontToken },
      body: JSON.stringify({ query:q, variables:vars || {} })
    }).then(function(r){ return r.json(); });
  }
  if (sf.storefrontToken){
    gql('{ products(first: 24, sortKey: BEST_SELLING) { nodes { title handle availableForSale featuredImage { url } priceRange { minVariantPrice { amount currencyCode } } variants(first: 1) { nodes { id } } } } }')
      .then(function(d){
        var n = d && d.data && d.data.products.nodes; if (!n || !n.length) return;
        renderProducts(n.map(function(x){
          var pr = x.priceRange.minVariantPrice;
          return { name:x.title, price: new Intl.NumberFormat('en-US', { style:'currency', currency:pr.currencyCode, maximumFractionDigits:0 }).format(+pr.amount),
                   soldOut: !x.availableForSale, image: x.featuredImage && x.featuredImage.url, url:'https://' + sf.domain + '/products/' + x.handle,
                   variant: x.variants.nodes[0] && x.variants.nodes[0].id };
        }), true);
        $('shopNote').textContent = 'Live from the store · secure Shopify checkout';
      }).catch(function(){});
    $('shopGrid').addEventListener('click', function(e){
      var b = e.target.closest('[data-variant]'); if (!b) return;
      b.textContent = 'Opening checkout…';
      gql('mutation($v: ID!){ cartCreate(input:{ lines:[{ merchandiseId:$v, quantity:1 }] }){ cart { checkoutUrl } } }', { v:b.dataset.variant })
        .then(function(d){ var u = d.data.cartCreate.cart.checkoutUrl; window.location.href = u; })
        .catch(function(){ b.textContent = 'Try again'; });
    });
  }

  /* ---------- 3D globe ---------- */
  var stage = $('globeStage');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var spinBtn = $('spinBtn');
  var G = { vel:0, spinning:false };
  spinBtn.addEventListener('click', function(){
    var next; do { next = Math.floor(Math.random() * S.collabs.length); } while (S.collabs.length > 1 && next === stopI);
    if (!window.THREE || reduced){ showStop(next); return; }
    G.vel = 0.32 + Math.random() * 0.12; G.spinning = true; G.next = next;
    spinBtn.disabled = true;
  });

  if (!window.THREE) return;
  try {
    var renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  } catch(err){ return; }
  $('globeFallback').remove();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  stage.insertBefore(renderer.domElement, stage.firstChild);
  renderer.domElement.setAttribute('aria-hidden', 'true');

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 4.7);
  var world = new THREE.Group(); world.rotation.x = 0.42; scene.add(world);
  var globe = new THREE.Group(); world.add(globe);
  var R = 1;
  var ACC = new THREE.Color('#FF5A1F'), PAPER = new THREE.Color('#F2EEE6');

  function v3(lat, lng, r){
    var phi = (90 - lat) * Math.PI / 180, th = (lng + 180) * Math.PI / 180;
    return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
  }

  /* ----- branded map texture: navy ocean, sage land, country + US state / Canadian province lines ----- */
  var MAP = { ocean:'#0D1A2E', grat:'rgba(242,238,230,.07)', land:'#A7B394', lit:'#E9B48E', border:'rgba(13,26,46,.85)', state:'rgba(13,26,46,.38)', hover:'#FF5A1F' };
  var TW = 2048, TH = 1024, Q = GEO.q;
  function decode(flat){ var out = [], x = flat[0], y = flat[1]; out.push(x, y); for (var i = 2; i < flat.length; i += 2){ x += flat[i]; y += flat[i+1]; out.push(x, y); } return out; }
  function prep(list){ return list.map(function(f){ return { name:f[0], rings:f[1].map(decode) }; }); }
  var countries = prep(GEO.c), states = prep(GEO.s);
  var STATE_COUNTRY = {};
  function tracePath(ctx, feat, w, h){
    ctx.beginPath();
    feat.rings.forEach(function(r){
      for (var i = 0; i < r.length; i += 2){
        var px = (r[i] / Q + 180) / 360 * w, py = (90 - r[i+1] / Q) / 180 * h;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
    });
  }
  // hidden ID maps: each country / state painted in its own color so hover can look it up by pixel
  function idMap(list){
    var c = document.createElement('canvas'); c.width = 1440; c.height = 720;
    var x = c.getContext('2d'); x.imageSmoothingEnabled = false;
    list.forEach(function(f, i){ var id = i + 1; x.fillStyle = 'rgb(' + (id & 255) + ',' + (id >> 8) + ',7)'; tracePath(x, f, c.width, c.height); x.fill('evenodd'); });
    return { w:c.width, h:c.height, d:x.getImageData(0, 0, c.width, c.height).data };
  }
  var cId = idMap(countries), sId = idMap(states);
  function lookup(map, list, lat, lng){
    var px = Math.min(map.w - 1, Math.max(0, Math.floor((lng + 180) / 360 * map.w))), py = Math.min(map.h - 1, Math.max(0, Math.floor((90 - lat) / 180 * map.h)));
    var o = (py * map.w + px) * 4;
    if (map.d[o + 2] !== 7 || map.d[o + 3] < 250) return -1;
    var id = map.d[o] + (map.d[o + 1] << 8) - 1;
    return id >= 0 && id < list.length ? id : -1;
  }
  function regionAt(lat, lng){
    var s = lookup(sId, states, lat, lng), c = lookup(cId, countries, lat, lng);
    if (s >= 0) return { kind:'s', i:s, label: states[s].name + (c >= 0 ? ', ' + countries[c].name : '') };
    if (c >= 0) return { kind:'c', i:c, label: countries[c].name };
    return null;
  }
  // light up every country / state he has played
  var litC = {}, litS = {};
  S.places.forEach(function(p){
    var s = lookup(sId, states, p.lat, p.lng), c = lookup(cId, countries, p.lat, p.lng);
    if (s >= 0) litS[s] = 1; else if (c >= 0) litC[c] = 1;
  });
  var base = document.createElement('canvas'); base.width = TW; base.height = TH;
  (function paintBase(){
    var x = base.getContext('2d');
    x.fillStyle = MAP.ocean; x.fillRect(0, 0, TW, TH);
    x.strokeStyle = MAP.grat; x.lineWidth = 1;
    for (var lo = -180; lo <= 180; lo += 15){ var gx = (lo + 180) / 360 * TW; x.beginPath(); x.moveTo(gx, 0); x.lineTo(gx, TH); x.stroke(); }
    for (var la = -75; la <= 75; la += 15){ var gy = (90 - la) / 180 * TH; x.beginPath(); x.moveTo(0, gy); x.lineTo(TW, gy); x.stroke(); }
    countries.forEach(function(f, i){ x.fillStyle = litC[i] ? MAP.lit : MAP.land; tracePath(x, f, TW, TH); x.fill('evenodd'); });
    states.forEach(function(f, i){ if (litS[i]){ x.fillStyle = MAP.lit; tracePath(x, f, TW, TH); x.fill('evenodd'); } });
    x.lineJoin = 'round';
    x.strokeStyle = MAP.state; x.lineWidth = 0.8;
    states.forEach(function(f){ tracePath(x, f, TW, TH); x.stroke(); });
    x.strokeStyle = MAP.border; x.lineWidth = 1.3;
    countries.forEach(function(f){ tracePath(x, f, TW, TH); x.stroke(); });
  })();
  var tex = document.createElement('canvas'); tex.width = TW; tex.height = TH;
  var tctx = tex.getContext('2d'); tctx.drawImage(base, 0, 0);
  var mapTex = new THREE.CanvasTexture(tex);
  mapTex.anisotropy = renderer.capabilities.getMaxAnisotropy ? Math.min(8, renderer.capabilities.getMaxAnisotropy()) : 1;
  var sphere = new THREE.Mesh(new THREE.SphereGeometry(R, 128, 96), new THREE.MeshBasicMaterial({ map:mapTex }));
  globe.add(sphere);
  var hoverKey = null;
  function paintHover(reg){
    var key = reg ? reg.kind + reg.i : null;
    if (key === hoverKey) return; hoverKey = key;
    tctx.drawImage(base, 0, 0);
    if (reg){
      var f = reg.kind === 's' ? states[reg.i] : countries[reg.i];
      tctx.globalAlpha = .55; tctx.fillStyle = MAP.hover; tracePath(tctx, f, TW, TH); tctx.fill('evenodd');
      tctx.globalAlpha = 1; tctx.strokeStyle = MAP.hover; tctx.lineWidth = 2; tctx.stroke();
    }
    mapTex.needsUpdate = true;
  }

  // atmosphere rim
  var atm = new THREE.Mesh(new THREE.SphereGeometry(R * 1.16, 64, 64), new THREE.ShaderMaterial({
    uniforms:{ c:{ value:ACC } },
    vertexShader:'varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader:'uniform vec3 c; varying vec3 vN; void main(){ float i = pow(0.7 - dot(vN, vec3(0.0,0.0,1.0)), 3.2); gl_FragColor = vec4(c, 1.0) * i * 0.9; }',
    side:THREE.BackSide, blending:THREE.AdditiveBlending, transparent:true, depthWrite:false
  }));
  world.add(atm);

  // orbit ring with a satellite
  var orbit = new THREE.Group(); orbit.rotation.set(1.15, 0, 0.5); world.add(orbit);
  var og = new THREE.BufferGeometry().setFromPoints(new THREE.EllipseCurve(0,0,1.42,1.42).getPoints(200).map(function(p){ return new THREE.Vector3(p.x, p.y, 0); }));
  orbit.add(new THREE.LineLoop(og, new THREE.LineDashedMaterial({ color:0xF2EEE6, dashSize:.03, gapSize:.03, transparent:true, opacity:.35 })));
  orbit.children[0].computeLineDistances();
  var sat = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 16), new THREE.MeshBasicMaterial({ color:ACC }));
  orbit.add(sat);

  // places + arcs
  var home = S.places.filter(function(p){ return p.home; })[0] || S.places[0];
  var hv = v3(home.lat, home.lng, R);
  var pinGeo = new THREE.SphereGeometry(0.016, 12, 12), ringGeo = new THREE.RingGeometry(0.02, 0.028, 32);
  var rings = [], arcs = [], pins = [];
  S.places.forEach(function(pl, i){
    var pv = v3(pl.lat, pl.lng, R * 1.004);
    var pin = new THREE.Mesh(pl.home ? new THREE.SphereGeometry(0.026, 16, 16) : pinGeo, new THREE.MeshBasicMaterial({ color: pl.home ? PAPER : ACC }));
    pin.position.copy(pv); pin.userData = pl; globe.add(pin); pins.push(pin);
    var ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color:ACC, transparent:true, side:THREE.DoubleSide, depthWrite:false }));
    ring.position.copy(pv); ring.lookAt(pv.clone().multiplyScalar(2)); ring.userData.o = Math.random(); globe.add(ring); rings.push(ring);
    if (pl.home) return;
    var ev = v3(pl.lat, pl.lng, R);
    var d = hv.distanceTo(ev);
    var mid = hv.clone().add(ev).normalize().multiplyScalar(R + 0.12 + d * 0.34);
    var pts = new THREE.QuadraticBezierCurve3(hv, mid, ev).getPoints(80);
    var ag = new THREE.BufferGeometry().setFromPoints(pts);
    globe.add(new THREE.Line(ag, new THREE.LineBasicMaterial({ color:ACC, transparent:true, opacity:.16 })));
    var cg = new THREE.BufferGeometry().setFromPoints(pts);
    var comet = new THREE.Line(cg, new THREE.LineBasicMaterial({ color:ACC, transparent:true, opacity:.95 }));
    globe.add(comet); arcs.push({ line:comet, o:Math.random(), n:pts.length, sp:0.0035 + Math.random() * 0.003 });
  });

  // size
  function size(){
    var w = stage.clientWidth, h = stage.clientHeight || w;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  size(); window.addEventListener('resize', size);

  // drag
  var drag = null;
  renderer.domElement.addEventListener('pointerdown', function(e){ drag = { x:e.clientX, y:e.clientY, t:performance.now() }; renderer.domElement.setPointerCapture(e.pointerId); });
  renderer.domElement.addEventListener('pointermove', function(e){
    hover(e);
    if (!drag) return;
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    globe.rotation.y += dx * 0.006;
    world.rotation.x = Math.max(-0.2, Math.min(1.0, world.rotation.x + dy * 0.003));
    G.vel = dx * 0.004;
    drag.x = e.clientX; drag.y = e.clientY;
  });
  var endDrag = function(){ drag = null; };
  renderer.domElement.addEventListener('pointerup', endDrag);
  renderer.domElement.addEventListener('pointercancel', endDrag);
  renderer.domElement.addEventListener('pointerleave', function(){ clearHover(); });

  // hover: country / state / province name, highlighted on the map
  var ray = new THREE.Raycaster(), mouse = new THREE.Vector2(), tip = $('globeTip');
  function hover(e){
    if (drag || e.pointerType === 'touch') return;
    var r = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1; mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    ray.setFromCamera(mouse, camera);
    var hit = ray.intersectObject(sphere)[0];
    var reg = hit && hit.uv ? regionAt(hit.uv.y * 180 - 90, hit.uv.x * 360 - 180) : null;
    paintHover(reg);
    if (reg){ tip.textContent = reg.label; tip.style.left = (e.clientX - r.left) + 'px'; tip.style.top = (e.clientY - r.top) + 'px'; tip.style.opacity = 1; }
    else tip.style.opacity = 0;
  }
  function clearHover(){ paintHover(null); tip.style.opacity = 0; }

  // permanent labels on the cities he has played
  var labelLayer = document.createElement('div'); labelLayer.className = 'glabels'; labelLayer.setAttribute('aria-hidden', 'true');
  stage.appendChild(labelLayer);
  var labels = pins.map(function(pin){
    var el = document.createElement('span');
    el.className = 'glabel mono' + (pin.userData.home ? ' is-home' : '');
    el.textContent = pin.userData.home ? pin.userData.name + ' · home' : pin.userData.name;
    labelLayer.appendChild(el);
    return { el:el, pin:pin };
  });
  var tmpV = new THREE.Vector3(), tmpN = new THREE.Vector3(), camDir = new THREE.Vector3();
  function placeLabels(){
    var w = stage.clientWidth, h = stage.clientHeight, placed = [];
    labels.forEach(function(l){
      l.pin.getWorldPosition(tmpV);
      tmpN.copy(tmpV).normalize();
      camDir.copy(camera.position).sub(tmpV).normalize();
      var facing = tmpN.dot(camDir);
      if (facing < 0.25){ l.el.style.opacity = 0; return; }
      tmpV.project(camera);
      var x = (tmpV.x * .5 + .5) * w, y = (-tmpV.y * .5 + .5) * h;
      var lw = l.el.offsetWidth || 80;
      // skip a label that would collide with one already shown (home is placed first)
      var clash = placed.some(function(p){ return x < p.x + p.w + 6 && x + lw + 6 > p.x && Math.abs(y - p.y) < 20; });
      if (clash){ l.el.style.opacity = 0; return; }
      placed.push({ x:x, y:y, w:lw });
      l.el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      l.el.style.opacity = Math.min(1, (facing - 0.25) * 4).toFixed(2);
    });
  }

  // loop (only while on screen)
  var visible = true, raf = 0, t0 = performance.now();
  if ('IntersectionObserver' in window){
    new IntersectionObserver(function(es){ visible = es[0].isIntersecting; if (visible && !raf) raf = requestAnimationFrame(frame); }).observe(stage);
  }
  function frame(now){
    raf = 0;
    var t = (now - t0) / 1000;
    if (!drag){
      if (G.spinning){
        G.vel *= 0.972;
        if (G.vel < 0.006){ G.spinning = false; spinBtn.disabled = false; showStop(G.next); }
      } else {
        G.vel += ((reduced ? 0 : 0.0016) - G.vel) * 0.04;
      }
      globe.rotation.y += G.vel;
    }
    sat.position.set(Math.cos(t * 0.6) * 1.42, Math.sin(t * 0.6) * 1.42, 0);
    rings.forEach(function(r){ var k = (t * 0.6 + r.userData.o) % 1; r.scale.setScalar(1 + k * 2.4); r.material.opacity = (1 - k) * 0.8; });
    arcs.forEach(function(a){
      a.o = (a.o + a.sp) % 1.3;
      var head = Math.floor(Math.min(1, a.o) * a.n), len = 22;
      var start = Math.max(0, head - len);
      a.line.geometry.setDrawRange(start, Math.max(0, head - start));
      a.line.material.opacity = a.o > 1 ? (1.3 - a.o) / 0.3 : 0.95;
    });
    renderer.render(scene, camera);
    placeLabels();
    if (visible) raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  /* ---------- hero globe: same map, bigger, ambient (no labels or hover) ---------- */
  (function heroGlobe(){
    var host = document.createElement('div');
    host.className = 'hero-globe'; host.setAttribute('aria-hidden', 'true');
    var shade = hero.querySelector('.hero-shade');
    shade.parentNode.insertBefore(host, shade.nextSibling);
    var hr;
    try { hr = new THREE.WebGLRenderer({ antialias:true, alpha:true }); } catch(err){ host.remove(); return; }
    var ring = hero.querySelector('.hero-ring'); if (ring) ring.remove();
    hr.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    host.appendChild(hr.domElement);
    var hs = new THREE.Scene(), hc = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    hc.position.set(0, 0, 5.4);
    var hw = new THREE.Group(); hw.rotation.x = 0.38; hw.rotation.z = -0.12; hs.add(hw);
    var hg = new THREE.Group(); hg.rotation.y = 0.6; hw.add(hg);
    var ht = new THREE.CanvasTexture(base);
    hg.add(new THREE.Mesh(new THREE.SphereGeometry(R, 128, 96), new THREE.MeshBasicMaterial({ map:ht })));
    hw.add(new THREE.Mesh(new THREE.SphereGeometry(R * 1.16, 64, 64), atm.material));
    var hRings = [], hArcs = [];
    S.places.forEach(function(pl){
      var pv = v3(pl.lat, pl.lng, R * 1.004);
      var pin = new THREE.Mesh(new THREE.SphereGeometry(pl.home ? 0.022 : 0.013, 12, 12), new THREE.MeshBasicMaterial({ color: pl.home ? PAPER : ACC }));
      pin.position.copy(pv); hg.add(pin);
      var rg = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color:ACC, transparent:true, side:THREE.DoubleSide, depthWrite:false }));
      rg.position.copy(pv); rg.lookAt(pv.clone().multiplyScalar(2)); rg.userData.o = Math.random(); hg.add(rg); hRings.push(rg);
      if (pl.home) return;
      var ev = v3(pl.lat, pl.lng, R), d = hv.distanceTo(ev);
      var mid = hv.clone().add(ev).normalize().multiplyScalar(R + 0.12 + d * 0.34);
      var pts = new THREE.QuadraticBezierCurve3(hv, mid, ev).getPoints(80);
      hg.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color:ACC, transparent:true, opacity:.2 })));
      var cm = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color:ACC, transparent:true, opacity:.95 }));
      hg.add(cm); hArcs.push({ line:cm, o:Math.random(), n:pts.length, sp:0.003 + Math.random() * 0.003 });
    });
    function hsize(){ var w = host.clientWidth, h = host.clientHeight || w; hr.setSize(w, h, false); hc.aspect = w / h; hc.updateProjectionMatrix(); }
    hsize(); window.addEventListener('resize', hsize);

    // gentle tilt toward the pointer
    var tilt = { x:0, y:0 }, tgt = { x:0, y:0 };
    hero.addEventListener('pointermove', function(e){
      var r = hero.getBoundingClientRect();
      tgt.x = ((e.clientY - r.top) / r.height - .5) * 0.18;
      tgt.y = ((e.clientX - r.left) / r.width - .5) * 0.3;
    });
    hero.addEventListener('pointerleave', function(){ tgt.x = tgt.y = 0; });

    var on = true, hraf = 0, h0 = performance.now();
    if ('IntersectionObserver' in window){
      new IntersectionObserver(function(es){ on = es[0].isIntersecting; if (on && !hraf) hraf = requestAnimationFrame(hframe); }).observe(hero);
    }
    function hframe(now){
      hraf = 0;
      var t = (now - h0) / 1000;
      if (!reduced) hg.rotation.y += 0.0011;
      tilt.x += (tgt.x - tilt.x) * 0.05; tilt.y += (tgt.y - tilt.y) * 0.05;
      hw.rotation.x = 0.38 + tilt.x; hw.rotation.y = tilt.y;
      hRings.forEach(function(r){ var k = (t * 0.55 + r.userData.o) % 1; r.scale.setScalar(1 + k * 2.4); r.material.opacity = (1 - k) * 0.8; });
      hArcs.forEach(function(a){
        a.o = (a.o + a.sp) % 1.3;
        var head = Math.floor(Math.min(1, a.o) * a.n), start = Math.max(0, head - 22);
        a.line.geometry.setDrawRange(start, Math.max(0, head - start));
        a.line.material.opacity = a.o > 1 ? (1.3 - a.o) / 0.3 : 0.95;
      });
      hr.render(hs, hc);
      if (on) hraf = requestAnimationFrame(hframe);
    }
    hraf = requestAnimationFrame(hframe);
  })();
})();
