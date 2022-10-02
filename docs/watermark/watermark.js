let runes = "\u2060\u2061\u2062\u2063\u2064\u2069\u200B\u200C\u200D\uFEFF\u206A\u206B\u206C\u206D\u206E\u206F";

function sfc32(a, b, c, d) {
	return function() {
		a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
		var t = (a + b) | 0;
		a = b ^ b >>> 9;
		b = c + (c << 3) | 0;
		c = (c << 21 | c >>> 11);
		d = d + 1 | 0;
		t = t + d | 0;
		c = c + t | 0;
		return (t >>> 0) / 4294967296;
	}
}

const findRunesLength = () => {
  let i = 2
  for (; i <= runes.length && i <= 256; i *= 2) {
  }
  i /= 2
  if (i < 2) {  
    throw "Runes is not long enough"
  }
  return i
}

const encode = (text) => {
  if (text == null) {
    return null
  }
  let bytes = new TextEncoder('UTF-8').encode(text)
  let encodeLength = findRunesLength()
  let state = 1
  let value = 0
  let output = ""
  for (let i = 0; i < bytes.length; ) {
    while (state < encodeLength && i < bytes.length) {
      value = value + state * bytes[i]
      state *= 256
      i++
    }
    while (state >= encodeLength) {
      output += runes[value % encodeLength]
      value = value / encodeLength >> 0
      state = state / encodeLength >> 0
    }
  }  
  if (state > 0) {
    output += runes[value % encodeLength]
  }
  return output
};

const decode = (text) => {
  if (text == null) {
    return null
  }
  let encodeLength = findRunesLength()
  let len = Math.floor(text.length * Math.log2(encodeLength) / Math.log2(256))
  let buf = new ArrayBuffer(len)
  let data = new Int8Array(buf)
  let state = 1
  let value = 0
  let j = 0
  let map = {}
  for (let i = 0; i < runes.length; i++) {
    map[runes[i]] = i
  }
  for (let i = 0; i < text.length; i++) {
    if (!(text[i] in map)) { continue }
    value = state * map[text[i]] + value
    state *= encodeLength
    if (state >= 256) {
      data[j] = value % 256
      state = state / 256 >> 0
      value = value / 256 >> 0
      j++
    }
  }
  return new TextDecoder("UTF-8").decode(data.slice(0, j))
}

const setRunes = (text) => {
  if (!text || text.length < 2) {  
    throw "Runes is not long enough"
  }
  runes = text
}

const drawWrapText = (context, text, x, y, line_width, line_height) => {
  var line = '';
  var paragraphs = text.split('\n');
  for (var i = 0; i < paragraphs.length; i++)
  {
    var words = paragraphs[i];
    for (var n = 0; n < words.length; n++)
    {
      var testLine = line + words[n];
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > line_width && n > 0)
      {
        context.fillText(line, x, y);
        line = words[n];
        y += line_height;
      }
      else
      {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
    y += line_height;
    line = '';
  }
  return y
}

const drawWatermark = (text) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext("2d");

  canvas.width = 256
  canvas.height = 1000
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = '20px "Segoe UI Historic", "Segoe UI", Helvetica, Arial, sans-serif'
  ctx.fillStyle = "#fffffe"
  ctx.textBaseline = "top"
  let height = drawWrapText(ctx, text, 0, 0, canvas.width, 20)

  let resizedCanvas = document.createElement("canvas");
  let resizedContext = resizedCanvas.getContext("2d");
  resizedCanvas.width = canvas.width
  resizedCanvas.height = height
  resizedContext.drawImage(canvas, 0, 0);
  return resizedCanvas.toDataURL()
}

const generate = (surfaceDom, hiddenDom, surfaceText, hiddenText) => {
  let index = surfaceText.indexOf(" ")
  if (index < 0) { index = 1 }
  surfaceDom.innerText = surfaceText.slice(0,index) + encode(hiddenText) + surfaceText.slice(index)
  let bgData = drawWatermark(hiddenText)
  hiddenDom.style.backgroundImage = `url("${bgData}")`
}

const filesToCanvas = (files, callback) => {

  // loop the elements
  for (var i = 0; i < files.length; i++) {
    // Skip content if not image
    if (files[i].type.indexOf("image") == -1) continue;
    // Create an abstract canvas and get context
    var mycanvas = document.createElement("canvas");
    var ctx = mycanvas.getContext('2d');

    // Create an image
    var img = new Image();

    // Once the image loads, render the img on the canvas
    img.onload = function(){
      // Update dimensions of the canvas with the dimensions of the image
      mycanvas.width = this.width;
      mycanvas.height = this.height;

      // Draw the image
      ctx.drawImage(img, 0, 0);

			callback(mycanvas);
    };

    // Crossbrowser support for URL
    var URLObj = window.URL || window.webkitURL;

    // Creates a DOMString containing a URL representing the object given in the parameter
    // namely the original Blob
    img.src = URLObj.createObjectURL(files[i]);
    break;
  }
}

const decodePaste = (files, dom) => {
  filesToCanvas(files, (canvas) => {
    let ctx = canvas.getContext('2d');
	  let data = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
	  let buf = new Uint32Array(data.data.buffer)
    for (let i = 0; i < buf.length; i++) {
      if ((buf[i] & 0xffffff) != 0xffffff) {
        buf[i] &= 0xff7f7f7f
      }
    }
    ctx.putImageData(data, 0, 0)
		dom.src = canvas.toDataURL()
	})
}

const awaitTimeout = (delay, reason) => new Promise((resolve, reject) => setTimeout(() => reject(reason), delay));
const getIp = () => {
  return Promise.race([awaitTimeout(2500, 'Timeout'), fetch('https://ifconfig.me/ip')])
}

const debounce = (callback) => {
  let timeout;

  return (argument) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(argument), 200);
  };
};

export { decode, encode, setRunes, generate, decodePaste, getIp, debounce };
