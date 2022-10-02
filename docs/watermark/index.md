---
layout: default
title: 文章暗水印追蹤演示
head: <link rel="stylesheet" href="watermark.css">
---

# 背景

假設A君喺網絡上睇到一啲文章，想share出去但又唔想用自己身份去做，可能會選擇copy and paste又或者cap圖再re-post。

唔想用自己身份行事嘅目的有好多，例如:
* 喺SNS(社交網絡網站)有多個分身account，想將一啲分身先見到嘅友限(friend only) post傳出來，但又唔想曝露分身嘅身份。
* 將SNS A上嘅文章分享去另一個SNS B (例如從一啲監控嚴密的SNS轉出去自由世界)，但因為內容敏感可能會令SNS A account被停用，甚至因為手機、上網方式有實名制制度而招惹麻煩。

當A君以為唔用SNS內建的分享share功能，而通過copy and paste或cap圖就能夠斷開追蹤鏈，呢個諗法就大錯特錯。

呢一個demo就係為咗演示SNS或網站可以點樣喺頁面上添鹽加醋，以隱寫術(steganography)來做源頭追蹤。

# 演示

假設以下就係A君想share出去嘅post。上面除咗肉眼見到嘅字，仲用咗兩個方法收埋咗啲暗碼，各位可以喺下面試下解碼。

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

## 文字Copy and Paste方法

1. 將上面post嘅文字整段copy
2. 貼到下面的文字框解碼<br>
   <textarea type="textarea" rows="4" id="wm-text-in"></textarea>
3. 睇下入面收埋咗乜？<br>
   <textarea type="textarea" rows="4" id="wm-text-out"></textarea>

## 截圖方法

1. 將上面的post截圖或cap screen
2. 喺下面貼上或選擇截圖檔案 (過程中不會上傳任何資料到伺服器)<br>
   <div id="wm-img-in">
     <input id="wm-img-text" value="在這裏Ctrl-V貼上">
       <div id="wm-img-file-box">
       <input type="button" onclick="document.getElementById('wm-img-file').click()" value="或者點這裏選擇圖片檔案">
       <div style="height: 0px;width:0px; overflow:hidden;"><input type="file" accept="image/*" id="wm-img-file"></div>
     </div>
     <div id="wm-img-drop-target"><div>把檔案拖放在這裏</div></div>
   </div>
3. 睇下入面收埋咗乜？(如果睇唔到，請確認圖片格式為PNG) <br>
   <div id="wm-img-out">
     <div>(在上面貼上截圖)</div>
     <div><img></div>
   </div>

## 製作隱寫訊息

1. 你亦可以試下自製帶暗碼嘅Post。喺下面作出修改，上面嘅demo post就會有所改變。
   * 表面文字<br>
     <textarea type="textarea" rows="4" id="wm-sim-s"></textarea>
   * 隱藏文字<br>
     <textarea type="textarea" rows="4" id="wm-sim-h"></textarea>
2. 喺Facebook share新整嘅圖俾其他人睇:<br>
   <iframe id="fb-share" width="77" height="28" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>

# 結語

以上所演示嘅兩款網頁隱寫術，其原理喺我嘅<a href="https://medium.com/@it9gamelog/watermark-f86aad9024eb">Medium Post</a>中有更詳盡說明。但呢兩款並非唯二可以用嘅隱寫方式，亦唔係明示暗示而家嘅SNS有用呢啲招數，而只是旨在演示有呢種可能性。

如上圖所演示，SNS或網站可能會將一啲可以追蹤瀏覽者嘅訊息收埋喺入面，任何人唔為意就可能會share埋出去。

呢啲招數嘅正式名字叫做[隱寫術(Steganography)](https://zh.wikipedia.org/zh-hk/%E9%9A%90%E5%86%99%E6%9C%AF)，喺在IT界比較著名嘅例子有[彩色雷射打印機MIC](https://en.wikipedia.org/wiki/Machine_Identification_Code)，用來追蹤文件打印時間同所用嘅打印機。

如果想將一處訊息安全地甩尾傳出去，唯一保証安全嘅辦法就係如同文字記者一樣－自己再謄寫一次。至於圖片或影片檔案，若有心人要夾帶任何隱寫訊息嘅話，基本上係完全無法偵測得到。

<script type="module">
import * as wm from './watermark.js'

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

const getIpString = async () => {
  try {
    let r = await wm.getIp()
    let ip = (await r.text()).replace(/^[^.:]+(?:[.:][^.:]+)?/, "xxx.xxx")
    return `你的IP是${ip}。`
  } catch {
  }
  return ''
}

(async () => {
  const simSurfaceDom = document.getElementById('wm-sim-s')
  const simHiddenDom = document.getElementById('wm-sim-h')

  const defaultSurfaceText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  const defaultHiddenText = `${await getIpString()}時間是${new Date().toLocaleString()}`
  simSurfaceDom.value = params.s && params.s != '_' ? params.s : defaultSurfaceText
  simHiddenDom.value = params.h && params.h != '_' ? params.h : defaultHiddenText

  const process = () => {
    const surfaceText = simSurfaceDom.value
    const hiddenText = simHiddenDom.value
    const surfaceDom = document.getElementById('wm-demo-s')
    const hiddenDom = document.getElementById('wm-sns-frame')
    let fbButton = document.querySelector('#fb-share')
    const shareSurfaceText = surfaceText == defaultSurfaceText ? '_' : surfaceText
    const shareHiddenText = hiddenText == defaultHiddenText ? '_' : hiddenText
    let url = `https://a.it9.gl/watermarkbot/page/${encodeURIComponent(shareSurfaceText)}/${encodeURIComponent(shareHiddenText)}`
    fbButton.src = `https://www.facebook.com/plugins/share_button.php?href=${encodeURIComponent(url)}&layout=button&size=large&width=77&height=28`
    
    wm.generate(surfaceDom, hiddenDom, surfaceText, hiddenText)
  }
  simSurfaceDom.addEventListener('input', wm.debounce(process))
  simHiddenDom.addEventListener('input', wm.debounce(process))
  process();

  let decryptText = (e) => {
    document.getElementById('wm-text-out').value = wm.decode(e.srcElement.value)
  }
  let decryptImage = (e) => {
    e.preventDefault()
    let files = e.clipboardData?.files || e.dataTransfer?.files || e.srcElement?.files
    wm.decodePaste(files, document.querySelector('#wm-img-out img'))
  }
  document.getElementById('wm-text-in').addEventListener('input', wm.debounce(decryptText))
  document.getElementById('wm-img-in').addEventListener('paste', decryptImage)
  document.getElementById('wm-img-in').addEventListener('drop', decryptImage)
  document.getElementById('wm-img-in').addEventListener('dragover', (e) => {e.preventDefault()})
  document.getElementById('wm-img-file').addEventListener('change', decryptImage)
  let dragend = wm.debounce(() => document.body.classList.remove('dragging'))
  document.addEventListener('dragover', ()=>{
    document.body.classList.add('dragging')
    dragend()
  })
})()


