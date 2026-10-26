/* ==========================================================================
   SITE CONTENT — SOURCE OF TRUTH
   Built and maintained by Calvera HQ (calverahq.com).
   Every piece of copy, every track, show, product and link on this site
   comes from this one object. To update the site, edit here, then re-paste
   the file into the HighLevel Custom HTML block (or redeploy the host).
   Keys left blank ("") switch that feature to its fallback automatically.
   ========================================================================== */
window.CP_SITE = {
  updated: "2026-10-26",
  title: "Connor Price | Official Site",
  maintainer: { name: "Calvera HQ", url: "https://calverahq.com" },

  hero: {
    // Swap in the team's own loop when supplied: set mp4 to a hosted file and it wins over YouTube.
    mp4: "",
    youtube: "UekfKh59KOw",        // "Spinnin" official video
    startAt: 18,
    release: { label: "Out now", title: "Live My Life", feat: "feat. Anderson .Paak & Nic D",
               link: "https://music.apple.com/us/artist/connor-price/494189511" }
  },

  stats: [
    { value: "7.7M", label: "Monthly listeners · Spotify" },
    { value: "2.1B+", label: "Spotify streams" },
    { value: "5M", label: "YouTube subscribers" },
    { value: "5.9M", label: "TikTok followers" }
  ],

  // Player: "audio" (a hosted mp3/m4a the team approves) is preferred.
  // With no audio file, the track plays through the official YouTube video in the mini window.
  tracks: [
    { title: "Spinnin", feat: "with Bens", tag: "250M+ streams", audio: "", youtube: "UekfKh59KOw", link: "https://fanlink.to/SPINNIN" },
    { title: "UP!", feat: "with Forrest Frank", tag: "39.8M views", audio: "", youtube: "wCw-W-2Rs0k", link: "https://open.spotify.com/artist/5zixe6AbgXPqt4c1uSl94L" },
    { title: "Violet", feat: "feat. Killa", tag: "24.1M views", audio: "", youtube: "GcvSJudQbVs", link: "https://open.spotify.com/artist/5zixe6AbgXPqt4c1uSl94L" },
    { title: "Trendsetter", feat: "with Haviah Mighty", tag: "16.5M views", audio: "", youtube: "PyrX8c1HGZw", link: "https://open.spotify.com/artist/5zixe6AbgXPqt4c1uSl94L" },
    { title: "Customs", feat: "with Harsh Likhari", tag: "15.4M views", audio: "", youtube: "us9CSqyvLVQ", link: "https://open.spotify.com/artist/5zixe6AbgXPqt4c1uSl94L" },
    { title: "Drop", feat: "with Zensery", tag: "13M views", audio: "", youtube: "pUROT2f6azM", link: "https://open.spotify.com/artist/5zixe6AbgXPqt4c1uSl94L" },
    { title: "Still Spinnin", feat: "with Bens", tag: "2025", audio: "", youtube: "CO_NYYKwnbM", link: "https://ffm.to/still_spinnin" },
    { title: "Ride", feat: "with Nic D", tag: "Paperboys", audio: "", youtube: "f-3tlFaAFwM", link: "https://ffm.to/ride_" }
  ],

  // Spin the Globe collabs. "track" points at an entry in tracks above. origin is optional.
  collabs: [
    { title: "Violet", with: "Killa", stat: "24.1M views on YouTube", origin: "", track: 2 },
    { title: "Trendsetter", with: "Haviah Mighty", stat: "16.5M views on YouTube", origin: "Toronto, Canada", track: 3 },
    { title: "Customs", with: "Harsh Likhari", stat: "15.4M views on YouTube", origin: "", track: 4 },
    { title: "Drop", with: "Zensery", stat: "13M views on YouTube", origin: "", track: 5 },
    { title: "Spinnin", with: "Bens", stat: "250M+ Spotify streams", origin: "", track: 0 }
  ],

  // Cities lit on the globe. home:true is where the arcs start.
  places: [
    { name: "Toronto", lat: 43.65, lng: -79.38, home: true },
    { name: "Las Vegas", lat: 36.17, lng: -115.14 },
    { name: "Royal Oak", lat: 42.49, lng: -83.14 },
    { name: "Milwaukee", lat: 43.04, lng: -87.91 },
    { name: "Chicago", lat: 41.88, lng: -87.63 },
    { name: "Denver", lat: 39.74, lng: -104.99 },
    { name: "Salt Lake City", lat: 40.76, lng: -111.89 },
    { name: "Los Angeles", lat: 34.05, lng: -118.24 },
    { name: "Tempe", lat: 33.43, lng: -111.94 },
    { name: "Ottawa", lat: 45.42, lng: -75.70 },
    { name: "Edmonton", lat: 53.55, lng: -113.49 },
    { name: "Berlin", lat: 52.52, lng: 13.40 },
    { name: "Shanghai", lat: 31.23, lng: 121.47 },
    { name: "Taizhou", lat: 28.66, lng: 121.42 }
  ],

  videos: [
    { title: "UP!", with: "with Forrest Frank", views: "39.8M views", youtube: "wCw-W-2Rs0k", poster: "" },
    { title: "Spinnin", with: "with Bens", views: "Official video", youtube: "UekfKh59KOw", poster: "" },
    { title: "Still Spinnin", with: "with Bens", views: "Shot on tour in Europe", youtube: "CO_NYYKwnbM", poster: "" },
    { title: "Inside / Outside", with: "Official video", views: "Shot by Kevin Euerle", youtube: "AvI3eIDJ5C0", poster: "" },
    { title: "Trendsetter", with: "with Haviah Mighty", views: "16.5M views", youtube: "PyrX8c1HGZw", poster: "" }
  ],

  feed: [
    { title: "Spin the Globe series", meta: "Playlist · 17 posts", url: "https://www.tiktok.com/@connorprice__" },
    { title: "Demo vs. Final", meta: "Playlist", url: "https://www.tiktok.com/@connorprice__" },
    { title: "Weird brother series", meta: "Playlist", url: "https://www.tiktok.com/@connorprice__" },
    { title: "Violet in Shanghai", meta: "Tour clip", url: "https://www.tiktok.com/@connorprice__" },
    { title: "Trendsetter", meta: "Post", url: "https://www.tiktok.com/@connorprice__/video/7317762582205484331" }
  ],

  tour: {
    bandsintownArtist: "Connor Price",
    bandsintownAppId: "",          // add the team's Bandsintown app_id to show live dates
    past: [
      { date: "Jun 18", city: "Royal Oak, MI", venue: "Royal Oak Music Theatre · Iconic Tour" },
      { date: "Jun 20", city: "Milwaukee, WI", venue: "Summerfest" },
      { date: "Jul 01", city: "Tempe, AZ", venue: "Marquee Theatre · Iconic Tour" },
      { date: "Jul 19", city: "Ottawa, ON", venue: "Ottawa Bluesfest" },
      { date: "Jul 21", city: "Edmonton, AB", venue: "K-Days" },
      { date: "Oct 2–3", city: "Taizhou, CN", venue: "AHA Music Carnival" }
    ]
  },

  alerts: {
    webhook: "",                    // Calvera HighLevel inbound webhook; signups land in his CRM
    layloUrl: "https://laylo.com/connorprice"
  },

  shop: {
    domain: "connorprice.shop",
    storefrontToken: "",            // Shopify Storefront API public token turns on live products + cart
    apiVersion: "2025-01",
    fallback: [
      { name: "About Time Vinyl (Signed)", price: "$50", soldOut: false, image: "", url: "https://connorprice.shop/collections/all" },
      { name: "Iconic / Till Next Time Vinyl", price: "$30", soldOut: false, image: "https://connorprice.shop/cdn/shop/files/CP-Vinyl-Signed-Front.png", url: "https://connorprice.shop/collections/all" },
      { name: "Iconic Tour Jersey", price: "$60", soldOut: true, image: "https://connorprice.shop/cdn/shop/files/CP-2026IconicTourJersey-Black-Stacked.png", url: "https://connorprice.shop/collections/all" },
      { name: "Iconic Tour Hoodie", price: "$70", soldOut: false, image: "", url: "https://connorprice.shop/collections/all" },
      { name: "Iconic Tour Tee", price: "$40", soldOut: false, image: "", url: "https://connorprice.shop/collections/all" },
      { name: "Iconic Tour Hat", price: "$40", soldOut: true, image: "", url: "https://connorprice.shop/collections/all" },
      { name: "Iconic Tour Tote", price: "$25", soldOut: false, image: "", url: "https://connorprice.shop/collections/all" }
    ]
  },

  socials: [
    { name: "Spotify", url: "https://open.spotify.com/artist/5zixe6AbgXPqt4c1uSl94L" },
    { name: "Apple Music", url: "https://music.apple.com/us/artist/connor-price/494189511" },
    { name: "YouTube", url: "https://www.youtube.com/@ConnorPrice_" },
    { name: "TikTok", url: "https://www.tiktok.com/@connorprice__" },
    { name: "Instagram", url: "https://www.instagram.com/connorprice/" }
  ]
};
