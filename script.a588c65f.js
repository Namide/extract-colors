parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"jfcL":[function(require,module,exports) {
"use strict";function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function e(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function i(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var n=function(){function e(i,n,r){var a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:i<<16|n<<8|r;t(this,e),this.isColor=!0,this.red=i,this.green=n,this.blue=r,this.hex=a,this.count=1}return i(e,[{key:"distance",value:function(t){return(Math.abs(t.red-this.red)+Math.abs(t.green-this.green)+Math.abs(t.blue-this.blue))/765}},{key:"getWeight",value:function(t,e){return this.count/e*(1-t)+this.getSaturation()*t}},{key:"getSaturation",value:function(){return void 0===this.saturation&&(this.saturation=Math.max(Math.abs(this.red-this.green)/255,Math.abs(this.red-this.blue)/255,Math.abs(this.green-this.blue)/255)),this.saturation}}]),e}();exports.default=n;
},{}],"jbDq":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t=e(require("./Color"));function e(t){return t&&t.__esModule?t:{default:t}}function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function r(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function i(t,e,n){return e&&r(t.prototype,e),n&&r(t,n),t}var o=function(){function e(){n(this,e),this.count=1,this.children={}}return i(e,[{key:"addGroup",value:function(t){return this.children[t]?this.children[t].count++:this.children[t]=new e,this.children[t]}},{key:"addColor",value:function(e,n,r,i){return this.children[e]?this.children[e].count++:this.children[e]=new t.default(n,r,i,e),this.children[e]}},{key:"getList",value:function(){var t=this;return Object.keys(this.children).map(function(e){return t.children[e]})}},{key:"getMaxWeight",value:function(t,e){if(void 0===this.maxWeight){var n=this.getList().map(function(n){return n.isColor?n.getWeight(t,e):n.getMaxWeight(t,e)});n.sort(function(t,e){return e-t}),this.maxWeight=n[0]||0}return this.maxWeight}},{key:"getMaxWeightColor",value:function(t,e){var n=this.getList();return n.sort(function(n,r){return n.isColor?r.getWeight(t,e)-n.getWeight(t,e):r.getMaxWeight(t,e)-n.getMaxWeight(t,e)}),n[0].isColor?n[0]:n[0].getMaxWeightColor(t,e)}},{key:"getMaxCountColor",value:function(){var t=this.getList();return t.sort(function(t,e){return t.isColor?e.count-t.count:e.getMaxCountColor()-t.getMaxCountColor()}),t[0].isColor?t[0]:t[0].getMaxCountColor()}},{key:"getColors",value:function(t,e,n){var r=this.getList().map(function(t){var e=t.count,n=t.getMaxCountColor();return n.count=e,n});r.sort(function(t,r){return r.getWeight(e,n)-t.getWeight(e,n)});var i=[];return r.forEach(function(e){var n=i.find(function(n){return n.distance(e)<t});n?n.count+=e.count:i.push(e)}),i}}]),e}();exports.default=o;
},{"./Color":"jfcL"}],"U9G3":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t=e(require("./ColorsGroup"));function e(t){return t&&t.__esModule?t:{default:t}}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function o(t,e){for(var r=0;r<e.length;r++){var o=e[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function n(t,e,r){return e&&o(t.prototype,e),r&&o(t,r),t}var a=function(t,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:Number.MAX_SAFE_INTEGER;if(!Number.isInteger(e)||e<r||e>o)throw new Error("".concat(t," is invalid"));return parseInt(e)},i=function(t,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:Number.MAX_VALUE;if(Number(e)!==e||e<r||e>o)throw new Error("".concat(t," is invalid"));return Number(e)},u=function(t,e){if(!e||"[object Function]"!=={}.toString.call(e))throw new Error("".concat(t," is invalid"));return e},l=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},o=t.pixels,n=void 0===o?e.pixelsDefault:o,l=t.distance,s=void 0===l?e.distanceDefault:l,c=t.saturationImportance,d=void 0===c?e.saturationImportanceDefault:c,f=t.splitPower,p=void 0===f?e.splitPowerDefault:f,h=t.colorValidator,v=void 0===h?e.colorValidatorDefault:h;r(this,e),this.pixels=a("pixels",n,1),this.splitPower=i("splitPower",p,2,16),this.distance=i("distance",s,0,1),this.saturationImportance=i("saturationImportance",d,0,1),this.colorValidator=u("colorValidator",v)}return n(e,[{key:"process",value:function(e){for(var r=new t.default,o=this.splitPower,n=0;n<e.length;n+=4){var a=e[n],i=e[n+1],u=e[n+2],l=e[n+3];if(this.colorValidator(a,i,u,l)){var s=a<<16|i<<8|u,c=(a>>4&15)<<2|(i>>4&15)<<1|u>>4&15,d=Math.round(a*(o-1)/255)*(o*o)+Math.round(i*(o-1)/255)*o+Math.round(u*(o-1)/255);r.addGroup(d).addGroup(c).addColor(s,a,i,u)}}return r.getColors(this.distance,this.saturationImportance,this.pixels)}},{key:"extract",value:function(t){var e=this;return this.process(t).map(function(t){return{hex:"#".concat("0".repeat(6-t.hex.toString(16).length)).concat(t.hex.toString(16)),red:t.red,green:t.green,blue:t.blue,area:t.count/e.pixels,saturation:t.saturation/255}})}}]),e}();exports.default=l,l.pixelsDefault=1e4,l.distanceDefault=.2,l.saturationImportanceDefault=.2,l.splitPowerDefault=10,l.colorValidatorDefault=function(t,e,r){return(arguments.length>3&&void 0!==arguments[3]?arguments[3]:255)>250};
},{"./ColorsGroup":"jbDq"}],"dDu2":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=exports.extractColorsFromSrc=exports.extractColorsFromImage=exports.extractColorsFromImageData=void 0;var t=e(require("./color/ColorsExtractor"));function e(t){return t&&t.__esModule?t:{default:t}}var r=function(t,e){var r=t.width*t.height,o=r<e?t.width:Math.round(t.width*Math.sqrt(e/r)),a=r<e?t.height:Math.round(t.height*Math.sqrt(e/r)),n=document.createElement("canvas");n.width=o,n.height=a;var i=n.getContext("2d");return i.drawImage(t,0,0,t.width,t.height,0,0,o,a),i.getImageData(0,0,o,a)},o=function(e,r){return new t.default(r).extract(e.data)};exports.extractColorsFromImageData=o;var a=function(e,o){return e.crossOrigin=o&&o.crossOrigin||null,new Promise(function(a){var n=function(e,o){var n=new t.default(o),i=r(e,n.pixels);a(n.extract(i.data))};if(e.complete)n(e,o);else{e.addEventListener("load",function t(){e.removeEventListener("load",t),n(e,o)})}})};exports.extractColorsFromImage=a;var n=function(t,e){var r=new Image;return r.src=t,a(r,e)};exports.extractColorsFromSrc=n;var i=function(t,e){return t instanceof ImageData?new Promise(function(r){r(o(t,e))}):t instanceof Image?a(t,e):n(t,e)},s=i;exports.default=s;
},{"./color/ColorsExtractor":"U9G3"}],"rCAq":[function(require,module,exports) {
module.exports={};
},{}],"pBGv":[function(require,module,exports) {

var t,e,n=module.exports={};function r(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function i(e){if(t===setTimeout)return setTimeout(e,0);if((t===r||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(n){try{return t.call(null,e,0)}catch(n){return t.call(this,e,0)}}}function u(t){if(e===clearTimeout)return clearTimeout(t);if((e===o||!e)&&clearTimeout)return e=clearTimeout,clearTimeout(t);try{return e(t)}catch(n){try{return e.call(null,t)}catch(n){return e.call(this,t)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:r}catch(n){t=r}try{e="function"==typeof clearTimeout?clearTimeout:o}catch(n){e=o}}();var c,s=[],l=!1,a=-1;function f(){l&&c&&(l=!1,c.length?s=c.concat(s):a=-1,s.length&&h())}function h(){if(!l){var t=i(f);l=!0;for(var e=s.length;e;){for(c=s,s=[];++a<e;)c&&c[a].run();a=-1,e=s.length}c=null,l=!1,u(t)}}function m(t,e){this.fun=t,this.array=e}function p(){}n.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];s.push(new m(t,e)),1!==s.length||l||i(h)},m.prototype.run=function(){this.fun.apply(null,this.array)},n.title="browser",n.env={},n.argv=[],n.version="",n.versions={},n.on=p,n.addListener=p,n.once=p,n.off=p,n.removeListener=p,n.removeAllListeners=p,n.emit=p,n.prependListener=p,n.prependOnceListener=p,n.listeners=function(t){return[]},n.binding=function(t){throw new Error("process.binding is not supported")},n.cwd=function(){return"/"},n.chdir=function(t){throw new Error("process.chdir is not supported")},n.umask=function(){return 0};
},{}],"nq4D":[function(require,module,exports) {

"use strict";var e=t(require("../../src/extractColorsBrowser"));function t(e){return e&&e.__esModule?e:{default:e}}function n(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function r(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?n(Object(r),!0).forEach(function(t){o(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e){return l(e)||c(e)||i()}function i(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function c(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}function l(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}var s=0,u=[],d={pixels:1e4,distance:.2,saturationImportance:.2,splitPower:10,uploadFile:function(){u=[];var e=document.getElementById("inputFile");e.onchange=function(e){a(e.target.files).forEach(function(e){u.push(URL.createObjectURL(e))}),v()},e.click()},randomFile:function(){u=[],g(),v()}},f=function(){var e=document.body.querySelector(".list");e.innerHTML="",u.forEach(function(t){var n=document.createElement("div");n.classList.add("block");var r=new Image;r.src=t,r.height=200,r.style.width="auto",n.appendChild(r);var o=document.createElement("canvas");o.width=20,o.height=r.height,n.appendChild(o),e.appendChild(n)})},h=function(e){var t=document.createElement("pre");t.classList.add("log","hljs");for(var n=arguments.length,r=new Array(n>1?n-1:0),o=1;o<n;o++)r[o-1]=arguments[o];r.forEach(function(e){var n=document.createElement("div");n.innerHTML=e,t.append(n)}),document.body.querySelectorAll(".list .block")[e].append(t)},p=function(e){var t=e.colors,n=e.index,r=e.state,o=e.initTime,a=e.pixels;if(r!==s)return!1;var i=document.body.querySelectorAll(".list .block")[n],c=i.querySelector("canvas"),l=i.querySelector("img");h(n,"".concat(t.length," colors: ")+t.map(function(e){return'<span class="square" style="color:'.concat(e.hex,'">▮</span>')}).join(" "),"pixels: "+Math.min(a,l.naturalWidth*l.naturalHeight),"time: "+(Date.now()-o)+"ms");var u=c.getContext("2d"),d=u.createImageData(c.width,c.height),f=d.data;e:for(var p=0;p<d.height;p++)for(var m=0;m<d.width;m++){var g=t[Math.floor(p/c.width)];if(!g)break e;var v=p*(4*d.width)+4*m;f[v+0]=g.red,f[v+1]=g.green,f[v+2]=g.blue,f[v+3]=255}return u.putImageData(d,0,0),!0},m=function(e){console.log(e,d),v()},g=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.random,n=void 0===t||t,r=e.directory,o=void 0!==r&&r;n?["moon","water","sea","colors","sky"].forEach(function(e){var t=Math.round(20*Math.random())+5;u.push("https://loremflickr.com/320/240/".concat(e,"/?lock=").concat(t))}):o&&Object.values(require("./img/*.jpg")).forEach(function(e){u.push(e)})},v=function(){var t,n=++s;f(),u.forEach(function(o,a){if(t)t.then(function(){var t=Date.now();return(0,e.default)(o,r(r({},d),{},{crossOrigin:"anonymous"})).then(function(e){return p(r({colors:e,src:o,index:a,state:n,initTime:t},d))})});else{var i=Date.now();t=(0,e.default)(o,r(r({},d),{},{crossOrigin:"anonymous"})).then(function(e){return p(r({colors:e,src:o,index:a,state:n,initTime:i},d))})}}),t&&t.catch(console.log)},y=new dat.GUI;y.add(d,"pixels",1).step(1).name("pixels").onFinishChange(m),y.add(d,"distance",0,1).name("distance").onFinishChange(m),y.add(d,"saturationImportance",0,1).name("saturationImportance").onFinishChange(m),y.add(d,"splitPower",2,16).name("splitPower").onFinishChange(m),y.add(d,"uploadFile").name("Upload images"),y.add(d,"randomFile").name("5 random images"),d.randomFile();
},{"../../src/extractColorsBrowser":"dDu2","./img/*.jpg":"rCAq","process":"pBGv"}]},{},["nq4D"], null)
//# sourceMappingURL=/extract-colors/script.a588c65f.js.map