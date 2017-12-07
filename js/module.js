/**
 * 2013-12-20  chaoming007@163.com
 * 组件库，定义一些公用组件
 */
(function() {
    function Modulefun(objFun) {

        //this.mH=null;
        //this.mW=null;
        this.objFun = objFun;
        this.evtData = {};
        this.indexnum = 2;
        this.ind = 1;
        this.winPosArr = {}; //窗口位置数据
        this.btnArr = {}; //最小化图标数据
        this.deskNumBuff = null; //判断是不是当前窗口
        this.sPosWin = {}; //侧边栏最小化窗口位置



    }

    Modulefun.prototype = {


        init: function() { //初始化组件

            this.viewWH();
            /*this.mH=this.viewWH()["height"];
            this.mW=this.viewWH()["width"];*/

        },

        changeBuff: function(num) {
            this.deskNumBuff = num;
            //alert(this.deskNumBuff);
        },
        viewWH: function() { //获得浏览器可视区域的宽高，返回一个数组
            var arr = {};
            arr["width"] = document.documentElement.clientWidth;
            arr["height"] = document.documentElement.clientHeight;

            return arr;
        },

        scrollTop: function() { //获得滚动条的高度

            return document.body.scrollTop || document.documentElement.scrollTop;

        },
        scrollHeight: function() { //获得页面的总高度

            return document.documentElement.scrollHeight || document.body.scrollHeight;

        },

        getWH: function(obj) { //获得元素的实际宽高

            var arr = {};

            arr["width"] = obj.offsetWidth;
            arr["height"] = obj.offsetHeight

            return arr;
        },

        /**
         * 拖拽方法，data为json格式数据
         *  {	
         *  	obj:"div",		//拖拽容器的id
         *  	maxW:500,		//拖拽限制的最大宽度
         *  	maxH:500,		//拖拽限制的最大高度
         *  	impbuff:false,  //是否限制拖拽范围
         *  	dragExp：false  					//是否有拖拽位置变换
         *  
         *  
         *   }
         */

        dragFun: function(data, buff) {


            var _this = this;
            if (data.obj) {
                var obj = data.obj;
            } else {
                return;
            }
            var oNear = null;

            var maxW = data.maxW || null;
            var maxH = data.maxH || null;
            var disX = 0,
                disY = 0,
                objX = 0,
                objY = 0,
                objLeft = 0;
            objTop = 0;
            var des = _$("deskcontent");
            obj.onmousedown = function(ev) {

                if (buff) {
                    return;
                }
                if (data.zindexNum) {
                    this.style.zIndex = data.zindexNum; //设置拖拽app的z-index的值使其一直为最顶端	
                } else {

                    this.style.zIndex = _this.ind++;
                }

                var evt = ev || window.event;

                disX = evt.clientX;
                disY = evt.clientY;
                objX = obj.offsetLeft;
                objY = obj.offsetTop;

                if (data.layBuff) { // 创建遮罩层

                    var lay = document.createElement("div");
                    addClass(lay, "layDiv");
                    lay.style.width = obj.offsetWidth + "px";
                    lay.style.height = obj.offsetHeight + "px";
                    obj.appendChild(lay);
                }
                /*
                						  if(data.toolBay){		//创建工具的iframe遮罩层


                						  			 var lay=document.createElement("div");				 	  	  		  
                					 	  	  		  addClass(lay,"toollayDiv");	
                					 	  	  		  lay.style.width=obj.offsetWidth+"px";
                							 		  lay.style.height=obj.offsetHeight+"px";
                							 		  obj.appendChild(lay);		


                						  }	 */




                if (obj.setCapture) {
                    obj.setCapture();
                } else {
                    window.captureEvents(Event.MOUSEMOVE);
                }
                evt.cancelBubble = true;

                document.onmousemove = function(ev) {
                    if (data.layBuff) {
                        lay.style.display = "block";
                    }
                    var evt = ev || window.event;
                    var mX = evt.clientX - disX;
                    var mY = evt.clientY - disY;

                    objLeft = objX + mX;
                    objTop = objY + mY;

                    if (data.impbuff) {

                        if (objLeft < 0) {
                            objLeft = 0;
                        }
                        if (objLeft >= maxW) {
                            objLeft = maxW;
                        }
                        if (objTop < 0) {
                            objTop = 0;
                        }
                        if (objTop >= maxH) {
                            objTop = maxH;
                        }

                    }

                    obj.style.left = objLeft + "px";
                    obj.style.top = objTop + "px";

                    if (data.dragExp) {

                        for (var i = 0, len = data.appArr.length; i < len; i++) {
                            removeClass(data.appArr[i], "higSty");
                        }

                        oNear = _this.findobj(obj, data.appArr);

                        if (oNear) {
                            addClass(oNear, "higSty");
                        }


                    }


                }
                document.onmouseup = function() {

                    if (data.objId) {
                        var oId = _$(data.objId);
                        _this.winPosArr[data.objId] = { left: oId.offsetLeft, top: oId.offsetTop };
                        //console.log(_this.winPosArr);

                    }

                    if (data.layBuff) {
                        obj.removeChild(lay); //删除创建的遮罩层
                    }
                    if (obj.releaseCapture) {
                        obj.releaseCapture();

                    } else {

                        window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                    }

                    document.onmousemove = null;
                    document.onmouseup = null;

                    if (data.dragExp) {

                        for (var i = 0, len = data.appArr.length; i < len; i++) {
                            removeClass(data.appArr[i], "higSty");
                        }

                        if (oNear) {

                            //oNear.style.zIndex=_this.indexnum++;
                            //交换两个app的位置
                            $(obj).startMove(data.aPos[oNear.index], 500, "easeOut");
                            $(oNear).startMove(data.aPos[obj.index], 500, "easeOut");
                            var temp = oNear.index;
                            oNear.index = obj.index;
                            obj.index = temp;

                        } else {
                            //console.log(data.aPos);
                            $(obj).startMove(data.aPos[obj.index], 500, "easeOut");

                        }
                        oNear = null;
                    }



                }


                return false;
            }

        },


        /**
         * 碰撞检测
         * 
         */

        pzTest: function(aObj, bObj) {

            var a1 = aObj.offsetLeft;
            var b1 = aObj.offsetTop;
            var c1 = aObj.offsetLeft + aObj.offsetWidth;
            var d1 = aObj.offsetTop + aObj.offsetHeight;
            var a2 = bObj.offsetLeft;
            var b2 = bObj.offsetTop;
            var c2 = bObj.offsetLeft + bObj.offsetWidth;
            var d2 = bObj.offsetTop + bObj.offsetHeight;
            if (a2 > c1 || b2 > d1 || a1 > c2 || b1 > d2) {
                return false;

            } else {

                return true;
            }


        },

        //求两点间距离
        disteen: function(obj1, obj2) {

            var a = (obj1.offsetLeft + obj1.offsetWidth / 2) - (obj2.offsetLeft + obj2.offsetWidth / 2);
            var b = (obj1.offsetTop + obj1.offsetHeight / 2) - (obj2.offsetTop + obj2.offsetHeight / 2);
            var c = Math.sqrt(a * a + b * b);
            return c;
        },

        //取得数组中的最大值
        maxVal: function(arr) {

            var maxnum = 0;
            var index = "";
            for (var i = 0; i < arr.length; i++) {

                if (arr[i] > maxnum) {
                    maxnum = arr[i];
                    index = i;

                }

            }

            return { max: maxnum, index: index };
        },

        //取得数组中的最小值
        minVal: function() {

            var minnum = 999999;
            var index = "";
            for (var i = 0; i < arr.length; i++) {

                if (arr[i] < minnum) {
                    minnum = arr[i];
                    index = i;

                }

            }

            return { min: minnum, index: index };

        },

        //找出相遇点中最近的元素
        //
        findobj: function(obj, arr) {

            var arr1 = [];
            var arr2 = [];
            var res = null;
            var minnum = 9999999;
            var minLi = null;

            for (var i = 0; i < arr.length; i++) {
                res = this.pzTest(obj, arr[i]);



                if (arr[i] != obj && res) {

                    arr1.push(this.disteen(obj, arr[i]));
                    arr2.push(arr[i]);
                }

            }

            for (var i = 0; i < arr1.length; i++) {

                if (arr1[i] < minnum) {
                    minnum = arr1[i];
                    minLi = arr2[i];
                }

            }
            return minLi;


        },



        //创建窗口
        //{
        //   pent:"fDiv",//父层对象,默认为document
        //   width:500,   //窗口的宽高，默认为500，500
        //   heigth:500,
        //   drag:true		//窗口是否可拖动，默认为可以拖动
        //}

        createWindow: function(jsonData, evtObj, nodeDivName) { //evtObj为窗口id，类似0-0

            var _this = this;

            if (_this.evtData[jsonData.winId]) { //如果窗口已经存在
                var winObj = _$(jsonData.winId); //获得创建的窗口对象				     	    	  
                if (winObj && arguments.length > 2) { //如果点击的是图标并且窗口已经存在就将窗口设置为最高层

                    winObj.style.zIndex = _this.ind++;
                    if (winObj.style.opacity == 0) {
                        $(winObj).startMove({ left: _this.winPosArr[jsonData.winId].left, top: _this.winPosArr[jsonData.winId].top, width: jsonData.width, height: jsonData.height, opacity: 100 }, 500, "linear");
                    }
                    return;
                }

                if (winObj && winObj.style.opacity == 0) { //检测如果窗口已经创建，并且已经最小化，点击时候还原窗口 		                             
                    winObj.style.zIndex = _this.ind++;
                    winObj.style.display = "block";
                    //还原窗口位置	     	    			
                    $(winObj).startMove({ left: _this.winPosArr[jsonData.winId].left, top: _this.winPosArr[jsonData.winId].top, width: jsonData.width, height: jsonData.height, opacity: 100 }, 500, "linear");
                    return;
                }
                if (winObj) { //如果窗口已经存在，并却窗口是展开的，点击的时候最小话窗口

                    var msObj = _$("m-" + jsonData.winId);
                    var wPos = { left: $(msObj).getPosition()[0], top: $(msObj).getPosition()[1] };
                    $(winObj).startMove({ left: wPos["left"], top: wPos["top"], width: 0, height: 0, opacity: 0 }, 500, "linear", function() {
                        winObj.style.display = "none";
                    });
                    return;
                }

                return;

            } else {

                _this.evtData[jsonData.winId] = jsonData.winId; //如果窗口未被创建或者已经关闭，那么创建窗口
            }

            var parentObj = jsonData["pent"];
            var obj_w = jsonData["width"] || 500;
            var obj_h = jsonData["height"] || 500;
            var drag = jsonData["drag"];
            var data = {};
            var newDiv = document.createElement("div");
            var dragBuff = true; //拖拽控制，最大化时候禁止拖拽


            newDiv.id = jsonData.winId;
            newDiv.style.zIndex = _this.ind++;
            newDiv.style.opacity = 1;

            //窗口初始位置 
            //

            var objPos = {

                left: jsonData.left,
                top: jsonData.top

            };

            //拖拽窗口的范围限制
            /*
            			     		 _this.mW=_this.viewWH()["width"]-obj_w;
            				        _this.mH=_this.viewWH()["height"]-obj_h;
            */


            newDiv.style.width = obj_w + "px";
            newDiv.style.height = obj_h + "px";
            addClass(newDiv, "setWindow");


            newDiv.style.left = objPos["left"] + "px";
            newDiv.style.top = objPos["top"] + "px";

            var divTit = document.createElement("div"); //创建窗口标题
            var divCon = document.createElement("div"); //创建窗口内容容器
            var titSpan = document.createElement("span"); //创建窗口标题
            titSpan.innerHTML = jsonData.wintit; //设置窗口标题文字
            var ifram = document.createElement("iframe");
            var loadDiv = document.createElement("div"); //创建iframe载入动画层
            var loadImg = document.createElement("img");
            loadDiv.style.width = obj_w + "px";
            loadDiv.style.height = obj_h - 26 + "px"
            loadImg.src = "images/images/app_starting.gif"; //载入iframe动画样式
            loadDiv.className = "layerDiv";
            loadDiv.appendChild(loadImg);
            divCon.appendChild(loadDiv);


            var a1 = document.createElement("a"); //创建最大化，最小化按钮
            var a2 = document.createElement("a");
            var a3 = document.createElement("a");
            var a4 = document.createElement("a");
            a1.href = "javascript:;";
            a2.href = "javascript:;";
            a3.href = "javascript:;";
            a4.href = "javascript:;";

            a1.title = "最小化";
            a2.title = "最大化";
            a3.title = "关闭";
            a4.title = "缩小窗口";

            addClass(a1, "s");
            addClass(a2, "d");
            addClass(a3, "c");
            addClass(a4, "x");


            addClass(divTit, "windowTit");
            addClass(divCon, "windowCon");
            addClass(ifram, "iframSty");

            ifram.frameBorder = 0;
            ifram.src = jsonData.iframSrc; //iframe的链接地址

            function setIfram(ifarmH, ifarmW, ifarmObj) { //iframe的高多虽窗口的变化而变化    
                divCon.style.height = ifarmH + "px";
                ifram.height = ifarmH + "px";

            }
            //_this.resizeWinFun({divCon:divCon,ifarmObj:ifram});

            divTit.appendChild(a3);
            divTit.appendChild(a4);
            divTit.appendChild(a2);
            divTit.appendChild(a1);
            divTit.appendChild(titSpan);

            newDiv.appendChild(divTit);
            newDiv.appendChild(divCon);
            parentObj.appendChild(newDiv);



            _this.iframeLoad(ifram, jsonData.iframSrc, addIframe); //回掉函数方法加载iframe动画	     	

            //divCon.appendChild(ifram);

            function addIframe() {
                $(loadDiv).startMove({ opacity: 0 }, 500, "easeOut", function() {
                    loadDiv.style.display = "none";
                });
            }

            divCon.appendChild(ifram);

            setIfram(obj_h - 40, 0, ifram);

            ev.addEvent(newDiv, "click", function() {

                newDiv.style.zIndex = _this.ind++;
            });

            _this.winPosArr[jsonData.winId] = { left: newDiv.offsetLeft, top: newDiv.offsetTop }; //将窗口位置添加到位置集合里

            //jsonData.sideWin=newDiv;

            _this.createBottomBar(jsonData);

            //给标题按钮添加事件

            //a1最小化按钮

            ev.addEvent(a1, "click", function() {

                var winObj = _$(jsonData.winId);
                var mObj = _$("m-" + jsonData.winId);
                newDiv.parentNode.style.zIndex = 3;
                a2.style.display = "block";
                a4.style.display = "none";
                dragBuff = true;

                //如果窗口已经创建，那么最小化时候就不在创建新的最小化标签
                //	直接获取到最小化标签的位置即可

                if (mObj) {

                    var dPos = { left: $(mObj).getPosition()[0], top: $(mObj).getPosition()[1] };


                } else {

                    var dPos = _this.createBottomBar(jsonData)[0];
                }

                //执行最小化动画

                $(newDiv).startMove({ left: dPos["left"], top: dPos["top"], width: 0, height: 0, opacity: 0 }, 500, "linear");

                winObj.indNum = jsonData.winId;
                return;

            });


            //a2最大化按钮


            ev.addEvent(a2, "click", function() {

                a4.style.display = "block";
                a2.style.display = "none";
                newDiv.parentNode.style.zIndex = 999999;

                //最大化窗口全屏显示

                dragBuff = false;
                newDiv.style.top = 0;
                newDiv.style.left = 0;
                newDiv.style.width = _this.viewWH()["width"] - 2 + "px";
                newDiv.style.height = _this.viewWH()["height"] - 2 + "px";
                setIfram(_this.viewWH()["height"] - 15, 0, ifram);
                return;

            });


            //a4缩小窗口


            ev.addEvent(a4, "click", function() {


                dragBuff = true;
                a4.style.display = "none";
                a2.style.display = "block";
                newDiv.parentNode.style.zIndex = 3;
                newDiv.style.top = objPos["top"] + "px";
                newDiv.style.left = objPos["left"] + "px";
                newDiv.style.width = obj_w + "px";
                newDiv.style.height = obj_h + "px";
                setIfram(obj_h - 40, ifram);
                return;
            });


            //a3关闭按钮

            ev.addEvent(a3, "click", function() {

                _this.closeWinEvent(jsonData);

            });



            /**
             * 拖拽方法，data为json格式数据
             *  {	
             *  	obj:"div",		//拖拽容器的id
             *  	maxW:500,		//拖拽限制的最大宽度
             *  	maxH:500,		//拖拽限制的最大高度
             *  	impbuff:false,  //是否限制拖拽范围
             *  	buff:false		
             *  
             *   }
             */


            if (drag) {


                //生成窗口拖拽参数配置


                var data = {
                    obj: newDiv,
                    maxW: _this.viewWH()["width"],
                    maxH: _this.viewWH()["height"],
                    impbuff: false,
                    layBuff: true, //是否有iframe覆盖层
                    objId: newDiv.id
                };

                divTit.onmousedown = function() {

                    if (dragBuff) { //判断拖拽位置如果是标题栏才允许拖拽

                        _this.dragFun(data, false);
                    }

                }
                divTit.onmouseup = function() {

                    _this.dragFun(data, true);
                }

            }


            //return closeWin;

        },


        /*关闭窗口事件*/

        closeWinEvent: function(jsonData) {

            var _this = this;
            var mObj = _$("m-" + jsonData.winId);
            var bottomCont = _$("bContent");
            _this.sPosWin = {};
            var winObj = _$(jsonData.winId);
            winObj.indNum = null;
            winObj.parentNode.style.zIndex = 3;
            delete _this.btnArr["m-" + jsonData.winId];
            delete _this.evtData[jsonData.winId];
            bottomCont.removeChild(mObj);
            winObj.parentNode.removeChild(winObj);
            return;

        },

        //创建底部导航			     
        createBottomBar: function(data, tabFun) {
            var _this = this;

            if (data.buff != "is") {


                var bottomCont = _$("bContent"); //底部标签栏容器
                var botBox = document.createElement("div");
                var botBoxA = document.createElement("a");
                var botImgBox = document.createElement("div");
                var botImg = document.createElement("img");
                var botTitBox = document.createElement("div");
                var closeBtn = document.createElement("div");
                var posdArr = [];


                addClass(botBox, "b-group b-groupWidth");
                addClass(botBoxA, "b-item-bg b-item");
                addClass(botImgBox, "b-itemico");
                addClass(botTitBox, "b-itemtxt");
                addClass(closeBtn, "closeBtn");

                botBox.id = "m-" + data.winId;
                botBoxA.href = "javascript:;";
                botBoxA.title = data.wintit;
                botImg.src = data.smallIcoSrc;
                botTitBox.innerHTML = data.wintit;


                botImgBox.appendChild(botImg);
                botBoxA.appendChild(botImgBox);
                botBoxA.appendChild(botTitBox);
                botBoxA.appendChild(closeBtn);
                botBox.appendChild(botBoxA);
                bottomCont.appendChild(botBox);


                //关闭窗口事件

                botBox.onmouseover = function() {

                    closeBtn.style.display = "block";

                }
                botBox.onmouseout = function() {

                    closeBtn.style.display = "none";

                }

                closeBtn.onclick = function(e) {

                    var evt = e || window.event;

                    _this.closeWinEvent(data);

                    evt.stopPropagation ? evt.stopPropagation() : evt.cancelBubble = true;

                }
                _this.btnArr[botBox.id] = botBox.id;

                var posLeft = $(botBox).getPosition()[0];
                var posTop = $(botBox).getPosition()[1];

                posdArr.push({ left: posLeft, top: posTop });
                ev.addEvent(botBox, "click", function() {

                    //第三个参数判断是否点击的图标还是最小化按钮

                    if (data.winId.slice(-2, 1) == "s") { //执行此步为侧边栏打开的窗口					     	   	 		
                        _this.createWindow(data, data.winId);
                        return;
                        // $(data.winId).startMove({left:data.left,top:data.top,width:data.width,height:data.height,opacity:100},300,"linear");
                    } else {

                        var buffNum = parseInt(data.winId.slice(-1));
                        //如果是当前屏就执行缩小放大操作
                        //否则不执行

                        if (buffNum == _this.deskNumBuff) {
                            _this.createWindow(data, data.winId);
                        }

                    }


                });

                return posdArr;

            } else { //检测窗口是不是在当前屏，如果不是给最小化图标进行添加滚屏事件


                for (attr in _this.btnArr) {

                    var obj = _$(_this.btnArr[attr]);

                    if (!obj) return;

                    obj.onclick = function() {

                        if (this.id.substr(this.id.indexOf("s"), 1) == "s") { //如果是侧边栏，不滚屏
                            return;
                        }
                        var buffNum = parseInt(this.id.slice(-1));
                        if (buffNum == _this.deskNumBuff) {
                            return;
                        }

                        var jattr = this.id.slice(2);
                        var winObj = _$(jattr); //获得对应的窗口对象

                        if (winObj.style.opacity == 0) { //如果不是当前窗口并且已经最小化那么就滚动屏幕，并且展开窗口

                            winObj.style.display = "block";
                            winObj.style.zIndex = _this.ind++;
                            $(winObj).startMove({ left: _this.winPosArr[jattr].left, top: _this.winPosArr[jattr].top, width: data.width, height: data.height, opacity: 100 }, 300, "linear");

                        }

                        tabFun(this.id);

                    }


                }



            }


        },

        //iframe 加载函数

        iframeLoad: function(iframeObj, iframeSrc, callback) {

            iframeObj.src = iframeSrc;
            if (iframeObj.attachEvent) {

                iframeObj.attachEvent("onload", function() {
                    callback();
                });

            } else {

                iframeObj.onload = function() {

                    callback();
                }

            }

        }








    }

    mod = new Modulefun();

}());