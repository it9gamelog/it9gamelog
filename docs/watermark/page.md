---
layout: white
head: |
  <meta name="robots" content="noindex">
  <meta property="og:title" content="你以為幅圖只係得「_S_」？其實仲暗藏_H_個字" />
  <meta property="og:description" content="來睇下網站可以點樣喺cap圖入面暗藏跟蹤碼" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://a.it9.gl/watermarkbot/thumbnail/_S_/_H_" />
  <meta property="og:url" content="https://a.it9.gl/watermarkbot/page/_S_/_H_" />
---

<script type="module" id="server-script">
(() => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  const replaceMeta = (property, surfaceText, hiddenText) => {
    let meta = document.querySelector(`meta[property="${property}"]`)
    let url = meta.getAttribute('content')
    url = url.replace("_S_", surfaceText).replace("_H_", hiddenText)
    meta.setAttribute('content', url);
    return url
  }

  let surfaceText = params.s && params.s != '_' ? params.s : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  let hiddenText = params.h && params.h != '_' ? params.h : `想不到還有隱寫文字呢？不要再隨便複製貼上了。` 
  let url = replaceMeta('og:image', encodeURIComponent(surfaceText), encodeURIComponent(hiddenText))
  replaceMeta('og:url', encodeURIComponent(params.s || surfaceText), encodeURIComponent(params.h || hiddenText))
  let shortTitle = surfaceText.length > 10 ? surfaceText.slice(0, 10)+'…' : surfaceText
  replaceMeta('og:title', shortTitle, hiddenText.length)

  let r = document.createElement("div")
  r.id='wm-ready'
  document.body.appendChild(r)
})()
</script>
<x-script>
<!--
(() => {
  let m = window.location.pathname.match(/\/([^/]+)\/([^/]+)\/?$/)
  if (m && m.length >= 3) {
    let url = `https://docs.it9.gl/watermark?s=${m[1]}&h=${m[2]}`
    window.location.replace(url)
  }
})()
-->
</x-script>
