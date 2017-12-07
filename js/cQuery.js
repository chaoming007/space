function _$(id) { return document.getElementById(id) }; //$只定义为通过ID返回元素的功能

//一些class的操作函数
/*添加class*/
function addClass(el, cls) {
    var arrCls = cls.split(/ +/);
    if (el.className) {
        for (var i = 0; i < arrCls.length; i++) {
            if (hasClass(el, cls)) {
                cls = cls.replace(new RegExp('(^| +)' + arrCls[i] + '( +|$)'), ' ');
            }
        }
        el.className = [el.className].concat(cls).join(' ');
    } else {
        el.className = cls;
    }
}

/*移除对象上的一个class*/
function removeClass(el, cls) {
    if (!cls) {
        el.className = '';
    } else if (hasClass(el, cls)) {
        el.className = el.className.replace(new RegExp('(^| +)' + cls + '( +|$)', 'g'), ' ');
    }
}

/*添加/移除对象上的一个class没有就添加，有了就移除*/
function toggleClass(el, cls) {
    if (!hasClass(el, cls)) {
        addClass(el, cls);
        return true;
    } else {
        removeClass(el, cls);
        return false;
    }
}

/*** 判断一个DOM元素或者字符串是否包含某些class标识串*/
function hasClass(el, cls) {
    var className = typeof(el) == 'string' && el || el.className;
    if (!className || !cls)
        return false;
    var cls = cls.split(/[\. ]+/);
    var re;
    for (var i = cls.length - 1; i >= 0; i--) {
        re = new RegExp('(^| +)' + cls[i] + '( +|$)');
        if (!re.test(className))
            return false;
    }
    return true;
}


/*根据class获得dom元素*/
function getElementsByClass(parentNode, cls) {
    var parentNode = parentNode || document;
    var tmp = [];
    var childs = parentNode.getElementsByTagName('*');
    for (var i = 0; i <= childs.length - 1; i++) {
        if (hasClass(childs[i], cls)) {
            tmp.push(childs[i]);
        }
    }
    return tmp;
}

//-----------------------event---------------------------
var ev = {
    //添加事件监听
    addEvent: function(obj, evt, fun) {
        if (obj.addEventListener) {
            obj.addEventListener(evt, fun, false)
        } else if (obj.attachEvent) {
            obj.attachEvent("on" + evt, fun)

        } else { obj["on" + evt] = fun }
    },

    //删除事件监听
    removeEvent: function(obj, evt, fun) {
        if (obj.removeEventListener) {
            obj.removeEventListener(evt, fun, false)
        } else if (obj.detachEvent) {
            obj.detachEvent("on" + evt, fun)
        } else {
            obj["on" + evt] = null;
        }
    },

    //捕获事件		
    getEvent: function() {
        if (window.event) { return window.event } else { return ev.getEvent.caller.arguments[0]; }
    },

    formatEvent: function(evt) {
        evt.eTarget = evt.target ? evt.target : evt.srcElement; //事件目标对象
        evt.eX = evt.pagex ? evt.pagex : evt.clientX + document.body.scrollLeft; //页面鼠标X坐标
        evt.eY = evt.pagey ? evt.pagex : evt.clientY + document.body.scrollTop; //页面鼠标Y坐标
        evt.eStopDefault = function() { this.preventDefault ? this.preventDefault() : this.returnValue = false; } //取消默认动作                 
        evt.eStopBubble = function() { this.stopPropagation ? this.stopPropagation() : this.cancelBubble = true; } //取消冒泡
    }
}


//-----------------------cQuery 自定义方法类---------------------------

//自定义类方法的实现
cQuery.prototype = {
    //得到元素
    getElem: function() { return this.obj; },

    //得到元素真实坐标,返回一个数组[x,y]
    getPosition: function() {
        var position = [0, 0];
        var obj = this.obj;
        while (obj.offsetParent) {
            position[0] += obj.offsetLeft;
            position[1] += obj.offsetTop;
            obj = obj.offsetParent;
        }
        position[0] + document.body.offsetLeft;
        position[1] + document.body.offsetTop;
        return position;
    },

    getCss: function(cls) {
        if (this.obj.currentStyle) {
            return this.obj.currentStyle[cls];
        } else {

            return window.getComputedStyle(this.obj, null)[cls];
        }
    },

    //得到元素属性
    getStyle: function(obj, sty) {
        if (obj.currentStyle) {

            return obj.currentStyle[sty];

        } else {

            return window.getComputedStyle(obj, false)[sty];

        }

    },

    //得到子节点数组(解决FF等子节点包括空白节点和文本节点的问题)
    getChildren: function() {
        var AchildNodes = [];
        for (var i = 0; i < this.obj.childNodes.length; i++) {
            if (this.obj.childNodes[i].nodeType == 1) {
                AchildNodes.push(this.obj.childNodes[i]);
            }
        }
        return AchildNodes;
    },

    //得到下一个兄弟节点
    getNextSibling: function() {
        var endBrother = this.obj.nextSibling;
        while (endBrother.nodeType != 1) {
            endBrother = endBrother.nextSibling;
        }
        return endBrother;
    },

    //得到上一个兄弟节点
    getPreSibling: function() {
        endBrother = this.obj.previousSibling;
        while (endBrother.nodeType != 1) {
            endBrother = endBrother.previousSibling;
        }
        return endBrother;
    },

    //通过getElementsByTagName方式得到的元素并转换为数组
    getByTagName: function(name) {
        var tagNames = this.obj.getElementsByTagName(name);
        var arr = [];
        for (var i = 0; i < tagNames.length; i++) {
            arr.push(tagNames[i]);
        }
        return arr;
    },

    //在节点后插入新的兄弟节点
    insertAfter: function(newNode) {
        if (this.obj.nextSibling) { this.obj.parentNode.insertBefore(newNode, this.obj.nextSibling); } else { this.obj.parentNode.appendChild(newNode); }
        return this.obj;
    },


    //非IE的innerText用textContent;
    text: function(str) {
        this.obj.innerText ? this.obj.innerText = str : this.obj.textContent = str;
        return this.obj;
    },
    //把用getElementsByTagName等方式得到的元素转换为数组
    toArray: function() {
        var arr = [];
        for (var i = 0; i < this.obj.length; i++) {
            arr.push(this.obj[i]);
        }
        return arr;
    },
    html: function() {
        if (arguments.length > 0) {
            this.obj.innerHTML = arguments[0];

        } else {

            return this.obj.innerHTML;
        }
        return this.obj;

    },
    //获取及设置元素样式，支持多个样式同事获取类似{"width":"500px","height":"500px"}
    css: function(cls, sty) {
        switch (arguments.length) {
            case 1:
                if (typeof arguments[0] == "string") {
                    return getClass(this.obj, cls);
                } else if (typeof arguments[0] == "object") {
                    for (var i in arguments[0]) {
                        this.obj.style[i] = arguments[0][i];
                    }
                }
                break;
            case 2:
                this.obj.style[cls] = sty;
                break;

        }
        return this.obj;

    },
    attr: function(sty, val) {
        switch (arguments.length) {
            case 1:
                return this.obj.getAttribute(sty);
                break;
            case 2:
                this.obj.setAttribute(sty, val);
                break;
        }
        return this.obj;

    },

    /**********事件相关*******************/
    hover: function(fnOver, fnOut) {
        ev.addEvent(this.obj, "mouseover", fnOver);
        ev.addEvent(this.obj, "mouseout", fnOut);
        return this.obj;
    },

    /*********************************************
    2013-11-19:新增加模块
    时间版运动框架-多种形式运动，css3样式修改方法

    ********************************************/
    setCss3: function(json) {
        for (var attr in json) {
            var newattr = attr;
            if (newattr.indexOf("-") > 0) {
                var num = newattr.indexOf("-");
                newattr.replace(newattr.substr(num, 2), newattr.substr(num + 1, 1).toUpperCase());
            }
            this.obj.style[newattr] = json[attr];
            newattr = newattr.replace(newattr.charAt(0), newattr.charAt(0).toUpperCase());
            this.obj.style["webkit" + newattr] = json[attr];
            this.obj.style["moz" + newattr] = json[attr];
            this.obj.style["ms" + newattr] = json[attr];
            this.obj.style["o" + newattr] = json[attr];

        }


    },

    //取得当前时间	  
    now: function() {
        return (new Date()).getTime();
    },
    //时间运动框架
    startMove: function(json, times, fx, fn) { ////obj:运动对象，json：运动属性json格式，times：运动时间（不能大于间隔时间），fx：运动形式，fn:回掉函数
        var This = this;
        var startTime = This.now();
        var iCur = {};
        for (var attr in json) {

            iCur[attr] = 0;
            if (attr == "opacity") {

                iCur[attr] = Math.round(This.getStyle(This.obj, attr) * 100);
            } else {

                iCur[attr] = parseInt(This.getStyle(This.obj, attr));
            }

        }
        clearInterval(This.obj.timer);
        This.obj.timer = setInterval(function() {
            var changeTime = This.now();

            var scale = 1 - Math.max(0, startTime - changeTime + times) / times;
            for (var attr in json) {

                var cvalue = parseInt(json[attr]) - iCur[attr];

                var value = Tween[fx](scale * times, iCur[attr], cvalue, times);

                if (attr == "opacity") {

                    This.obj.style.filter = "alpha(opacity=" + value + ")";
                    This.obj.style.opacity = value / 100;

                } else {

                    This.obj.style[attr] = value + "px";

                }

            }
            if (scale == 1) {
                clearInterval(This.obj.timer);
                if (fn) {
                    fn.call(This.obj);
                }
            }


        }, 13);


    }



    //运动框架
    /* animate:function(json,tim,fn){
        var _thisObj=this.obj;
		var _this=this;
        clearInterval(_thisObj.timer);
            _thisObj.timer=setInterval(function(){
            var bStop=true;           
            for(var attr in json){    
                 var speed=10;
                 var cur=0;
                 if(attr=="opacity"){
                     var cur=Math.round(parseFloat(_this.getCss(attr))*100);    
                 }else{    
                    var cur=parseInt(_this.getCss(attr)); 
                 }
                  speed=(json[attr]-cur)/5;
				
                 speed=speed>0?Math.ceil(speed):Math.floor(speed); 
	
                 if(cur!=json[attr]){
                     bStop=false;
                 }
				
                 if(bStop){
                    clearInterval(_thisObj.timer);
                    if(fn)fn();    
                 }else{
                     if(attr=="opacity"){
                         _thisObj.style.filter='alpha(opacity='+(cur+speed)+')';
                        _thisObj.style.opacity=(cur+speed)/100;
                     }else{
						  console.log(speed);
                         _thisObj.style[attr]=cur+speed+"px";
                         
                     }
                 }
              }
                 
             },tim)},
*/
}


function cQuery(obj) { //实现元素自定义方法的类，obj为元素的ID或元素本身	

    if (typeof(obj) == "string") {
        this.obj = document.getElementById(obj);
    } else if (typeof(obj) == "object") { this.obj = obj; } else this.obj = null;

}

function $(obj) { //实现自定义类的一个实例，obj为元素的ID或元素本身
    return new cQuery(obj);
}
//------------------------------Array 扩展类------------------------------

//copy数组
Array.prototype.copy = function() { return this.slice(); }

//返回数组中指定字符串的索引
Array.prototype.indexof = function(str) {
    for (var q = 0; q < this.length; q++) {
        if (this[q] == str) { return q; }
    }
}
/*
var a=[1,4,5,7,84,45,35]
alert(a.indexof(5)) //opt 5
*/
//数组随机排序	
Array.prototype.aSort = function(method) {
    function Sort(a, b) {
        if (method == 0 || method == 1) {
            if (a > b) { if (method == 0) { return 1 } else { return -1 } }
            if (a < b) { if (method == 0) { return -1 } else { return 1 } } else { return 0 }
        } else if (method == 2) { return Math.random() > .5 ? -1 : 1; } //用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1       	
    }
    this.sort(Sort);
}

/*
var a=[1,4,5,7,84,45,35]
a.aSort(2)
alert(a.toString())
*/

//在数组任意索引处删除一项	
Array.prototype.delIndex = function(index) { this.splice(index, 1) }

//在数组任意索引处删除多项	
Array.prototype.del = function() {
    var opts = this.sort.call(arguments, Function('a,b', 'return a > b?-1:1;'));
    for (var i = 0; i < opts.length; i++) { this.splice(opts[i], 1); }
    return this;
}
/*
var a=['甲','乙','丙','丁'];
alert(a.del(3,1));
*/

//在数组任意索引后增加一项或多项	
Array.prototype.addIndex = function(index, arr) { this.splice(index + 1, 0, arr) }

//返回数组中最大项
Array.prototype.max = function() {
    return Math.max.apply({}, this);
}

//返回数组中最小项
Array.prototype.min = function() {
    return Math.min.apply({}, this);
}

//------------------------------String 扩展类------------------------------

//得到有汉字字符串的长度
String.prototype.chLength = function() {
    var strLen = 0;
    for (i = 0; i < this.length; i++) {
        if (this.charCodeAt(i) > 255) { strLen += 2; } else { strLen++; }
    }

    return strLen;
}

//去除敏感字符
String.prototype.trimBadWords = function(str) {
    var reg = new RegExp(str, "gi");
    return this.replace(reg, function(str_bad) { return str_bad.replace(/./g, "*") });
}

//去除字符串首尾空格
String.prototype.trimSpaces = function() {
    var reg = /^\s*(.*?)\s*$/gim;
    return this.replace(reg, "$1");
}

//转化<>标签为实体字符
String.prototype.trimTab = function() {
    var reg = /<|>/g;
    return this.replace(reg, function(s) { if (s == "<") { return "&lt;"; } else { return "&gt;"; } })
}

//去除任意HTML标签
String.prototype.trimHtml = function(tag) { //不写标签名代表所有标签
    tag ? reg = new RegExp("<\/?" + tag + "(?:(.|\s)*?)>", "gi") : reg = /<(?:.|\s)*?>/gi;
    return this.replace(reg, "");
}


//----------------------------------cookie-----------------------------------
var cookie = {
    //设置cookie
    setCookie: function(sName, sValue, oExpires, sPath, sDomain, bSecure) {
        var sCookie = sName + "=" + encodeURIComponent(sValue);
        if (oExpires) { sCookie += "; expires=" + oExpires.toUTCString(); }
        if (sPath) { sCookie += "; path=" + sPath; }
        if (sDomain) { sCookie += "; domain=" + sDomain; }
        if (bSecure) { sCookie += "; scure"; }
        document.cookie = sCookie;
    },

    //读取cookie
    getCookie: function(sName) {

        var sRE = "(?:; )?" + sName + "=([^;]*);?";
        var oRE = new RegExp(sRE);
        if (oRE.test(document.cookie)) {
            return decodeURIComponent(RegExp["$1"]);
        } else { return null; }
    },

    //删除cookie
    delCookie: function(sName, sPath, sDomain) {
        cookie.setCookie(sName, "", new Date(0), sPath, sDomain);
    }
}


//--------------------ajax类---------------------
var XMLHttp = {
    _objPool: [],
    _getInstance: function() {
        for (var i = 0; i < this._objPool.length; i++) {
            if (this._objPool[i].readyState == 0 || this._objPool[i].readyState == 4) {
                return this._objPool[i];
            }
        }

        this._objPool[this._objPool.length] = this._createObj();
        return this._objPool[this._objPool.length - 1];
    },
    _createObj: function() {
        if (window.XMLHttpRequest) { var objXMLHttp = new XMLHttpRequest(); } else {
            var MSXML = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
            for (var n = 0; n < MSXML.length; n++) {
                try {
                    var objXMLHttp = new ActiveXObject(MSXML[n]);
                    break;
                } catch (e) {}
            }
        }

        if (objXMLHttp.readyState == null) {
            objXMLHttp.readyState = 0;
            objXMLHttp.addEventListener("load", function() {
                objXMLHttp.readyState = 4;
                if (typeof objXMLHttp.onreadystatechange == "function") {
                    objXMLHttp.onreadystatechange();
                }
            }, false);
        }
        return objXMLHttp;
    },
    // 发送请求(方法[post,get], 地址, 数据, 回调函数, 回调函数参数-多个用数组形式)
    sendReq: function(method, url, data, callback, arg) {
        var objXMLHttp = this._getInstance();
        with(objXMLHttp) {
            try {
                // 加随机数防止缓存
                if (url.indexOf("?") > 0) {
                    url += "&randnum=" + Math.random();
                } else { url += "?randnum=" + Math.random(); }
                open(method, url, true);
                // 设定请求编码方式
                setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                send(data);
                onreadystatechange = function() {
                    if (objXMLHttp.readyState == 4 && (objXMLHttp.status == 200 || objXMLHttp.status == 304)) {
                        callback(objXMLHttp, arg);
                    }
                }
            } catch (e) { alert(e); }
        }
    }
};

//运动公式	 
var Tween = {

    //t : 当前时间   b : 初始值  c : 变化值   d : 总时间
    //return : 当前的位置 

    linear: function(t, b, c, d) { //匀速
        return c * t / d + b;
    },
    easeIn: function(t, b, c, d) { //加速曲线
        return c * (t /= d) * t + b;
    },
    easeOut: function(t, b, c, d) { //减速曲线
        return -c * (t /= d) * (t - 2) + b;
    },
    easeBoth: function(t, b, c, d) { //加速减速曲线
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    easeInStrong: function(t, b, c, d) { //加加速曲线
        return c * (t /= d) * t * t * t + b;
    },
    easeOutStrong: function(t, b, c, d) { //减减速曲线
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeBothStrong: function(t, b, c, d) { //加加速减减速曲线
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t + b;
        }
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    elasticIn: function(t, b, c, d, a, p) { //正弦衰减曲线（弹动渐入）
        if (t === 0) {
            return b;
        }
        if ((t /= d) == 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    elasticOut: function(t, b, c, d, a, p) { //正弦增强曲线（弹动渐出）
        if (t === 0) {
            return b;
        }
        if ((t /= d) == 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    elasticBoth: function(t, b, c, d, a, p) {
        if (t === 0) {
            return b;
        }
        if ((t /= d / 2) == 2) {
            return b + c;
        }
        if (!p) {
            p = d * (0.3 * 1.5);
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if (t < 1) {
            return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) *
                Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        }
        return a * Math.pow(2, -10 * (t -= 1)) *
            Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
    },
    backIn: function(t, b, c, d, s) { //回退加速（回退渐入）
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    backOut: function(t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 3.70158; //回缩的距离
        }
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    backBoth: function(t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        if ((t /= d / 2) < 1) {
            return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        }
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
    bounceIn: function(t, b, c, d) { //弹球减振（弹球渐出）
        return c - Tween['bounceOut'](d - t, 0, c, d) + b;
    },
    bounceOut: function(t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
        }
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
    },
    bounceBoth: function(t, b, c, d) {
        if (t < d / 2) {
            return Tween['bounceIn'](t * 2, 0, c, d) * 0.5 + b;
        }
        return Tween['bounceOut'](t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    }
}