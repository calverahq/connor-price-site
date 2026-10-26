"""Build dist/cp-site.js (the HighLevel embed bundle) and dist/index.html (standalone page) from src/.

Run:  python3 build.py
Edit content in src/config.js. Edit look in src/styles.css. Edit behavior in src/app.js.
"""
import json, pathlib

ROOT = pathlib.Path(__file__).parent
S = ROOT / "src"
D = ROOT / "dist"
D.mkdir(exist_ok=True)

config = (S / "config.js").read_text()
styles = (S / "styles.css").read_text()
markup = (S / "markup.html").read_text()
app = (S / "app.js").read_text()
geo = (S / "geo.json").read_text().strip()

FONTS = "https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;500;700&family=IBM+Plex+Mono:wght@400;600&display=swap"
THREE = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"

# HighLevel wraps custom code inside its own section/row/column. The bundle mounts the
# site directly on <body> and hides HighLevel's wrapper so sticky header, docked player
# and full-bleed hero behave exactly like the standalone page.
bundle = f"""/* Connor Price site bundle - built from github.com/calverahq/connor-price-site. Do not edit; edit src/ and run build.py. */
(function(){{
  if (window.__CP_MOUNTED) return; window.__CP_MOUNTED = true;
  var me = document.currentScript;
  var head = document.head;
  function add(tag, attrs){{ var e = document.createElement(tag); for (var k in attrs) e.setAttribute(k, attrs[k]); head.appendChild(e); return e; }}
  add('link', {{ rel:'preconnect', href:'https://fonts.googleapis.com' }});
  add('link', {{ rel:'preconnect', href:'https://fonts.gstatic.com', crossorigin:'' }});
  add('link', {{ rel:'stylesheet', href:{json.dumps(FONTS)} }});
  var st = document.createElement('style'); st.id = 'cp-site-css';
  st.textContent = {json.dumps(styles)} + 'html,body{{margin:0!important;padding-top:0!important}}#cp-site{{display:block}}';
  head.appendChild(st);
  // hide HighLevel's own page wrapper (the element that holds this script)
  var n = me; while (n && n.parentElement && n.parentElement !== document.body) n = n.parentElement;
  if (n && n !== me) n.style.display = 'none';
  var root = document.createElement('div'); root.id = 'cp-site';
  root.innerHTML = {json.dumps(markup)};
  document.body.appendChild(root);
  {config}
  window.GEO = {geo};
  function run(){{ {app} }}
  if (window.THREE) run();
  else {{ var s = document.createElement('script'); s.src = {json.dumps(THREE)}; s.onload = run; s.onerror = run; head.appendChild(s); }}
}})();
"""
(D / "cp-site.js").write_text(bundle)

page = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Connor Price</title>
<meta name="description" content="Connor Price, independent artist from Toronto. Music, videos, Spin the Globe, tour alerts and official merch.">
<meta name="author" content="Calvera HQ">
</head>
<body>
<script src="./cp-site.js"></script>
</body>
</html>
"""
(D / "index.html").write_text(page)
print("built", len(bundle), "bytes")
