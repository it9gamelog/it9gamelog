---
layout: white
head: |
  <link rel="stylesheet" href="watermark.css" />
---
<div id="wm-sns-frame">
  <div id="wm-sns-header">
    <div id="wm-sns-profile-pic"></div>
    <div id="wm-sns-profile-name">IT9暗水印追蹤實驗</div>
    <div id="wm-sns-profile-time">1m · <img src="wm-sns-fof.png"></div>
  </div>
  <div id="wm-sns-content">
    <div id="wm-demo-s"></div>
  </div>
  <div id="wm-sns-footer">
    <div id="wm-sns-footer-buttons">
      <img src="wm-sns-buttons.png">
    </div>
  </div>
</div>

<style>
body { background: url(/assets/images/body-background.png) #eae6d1; }
</style>
<script type="module">
import * as wm from './watermark.js'

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

(async () => {
  let surfaceText = params.s && params.s != '_' ? params.s : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  let hiddenText = params.h && params.h != '_' ? params.h : `想不到還有隱寫文字呢？不要再隨便複製貼上了。` 

  const process = () => {
    const surfaceDom = document.getElementById('wm-demo-s')
    const hiddenDom = document.getElementById('wm-sns-frame')
	  wm.generate(surfaceDom, hiddenDom, surfaceText, hiddenText)
    let r = document.createElement("div")
    r.id='wm-ready'
    document.body.appendChild(r)
	}
	process();
})()
</script>
