(function() {

    function Tools(datArr, dat) {

        this.dataArr = datArr;
        this.data = dat;
        this.parentDiv = _$("deskbox"); //父容器

    }
    Tools.prototype = {

        clock: function(cdat) {

            this.createDoc(cdat);
        },

        weather: function(cdat) {

            this.createDoc(cdat);
        },
        warn: function(cdat) {

            this.createDoc(cdat);
        },
        calendar: function(cdat) {

            this.createDoc(cdat);
        },


        createDoc: function(posDat) {

            var _this = this;
            var doc = document.createElement("div"); //容器
            var docTit = document.createElement("div"); //标题
            var docCon = document.createElement("div"); //内容
            var a1 = document.createElement("a");
            var a2 = document.createElement("a");
            var a3 = document.createElement("a");
            var ifm = document.createElement("iframe");
            var loadDiv = document.createElement("div");



            ifm.frameBorder = 0;
            ifm.scrolling = "no";
            // ifm.src=this.data.ifSrc; 
            addClass(ifm, "window-iframe");
            addClass(doc, "window-plug-box");
            addClass(docTit, "window-plug-tit");
            addClass(docCon, "window-plug-content");
            addClass(loadDiv, "plug-load");

            doc.id = this.data.id;
            addClass(a1, "window-plug-btnSty window-plug-closeBtn");
            addClass(a2, "window-plug-btnSty window-plug-shareBtn");
            addClass(a3, "window-plug-btnSty window-plug-intvBtn");

            if (this.data.block) {
                doc.style.display = "block";
            } else {
                doc.style.display = "none";
            }

            ev.addEvent(a1, "click", function() {
                var yyMenu = _$("contentOne"); //添加小应用菜单  
                var addToolList = yyMenu.getElementsByTagName("a");
                addToolList[_this.data.index].getElementsByTagName("span")[0].style.display = "none";
                _this.dataArr[_this.data.index] = 0; //记录并改变状态是显示还是隐藏 0为隐藏，1为显示
                doc.style.display = "none";

            });

            doc.style.width = this.data.width + "px";
            doc.style.height = this.data.height + "px";
            docCon.style.width = this.data.ifWidth + "px";
            docCon.style.height = this.data.ifHeight + "px";
            ifm.style.width = this.data.ifWidth + "px";
            ifm.style.height = this.data.ifHeight + "px";

            loadDiv.style.width = this.data.width + "px";
            loadDiv.style.height = this.data.height + "px";

            doc.style.left = posDat.left + "px";
            doc.style.top = posDat.top + "px";
            doc.style.zIndex = 99999;

            docTit.appendChild(a1);
            docTit.appendChild(a2);
            docTit.appendChild(a3);
            docCon.appendChild(ifm);
            doc.appendChild(loadDiv);
            doc.appendChild(docTit);
            doc.appendChild(docCon);
            this.parentDiv.appendChild(doc);

            _this.iframeLoad(ifm, _this.data.ifSrc, ifmFun);

            function ifmFun() {

                $(loadDiv).startMove({ opacity: 0 }, 500, "easeOut", function() {
                    loadDiv.style.display = "none";
                });

                $(docCon).startMove({ opacity: 100 }, 500, "easeOut");

            }
            //容器拖拽
            //
            var barW = mod.viewWH()["width"] - this.data.width;
            var barH = mod.viewWH()["height"] - this.data.height;

            var docData = {
                obj: doc, //拖拽容器的id
                maxW: barW, //拖拽限制的最大宽度
                maxH: barH, //拖拽限制的最大高度
                impbuff: true, //是否限制拖拽范围
                zindexNum: 99999,
                layBuff: true //iframe 遮罩层

            }
            mod.dragFun(docData, false);

            ev.addEvent(doc, "mouseover", function() { //标题显示隐藏事件

                docTit.style.visibility = "visible";
            });
            ev.addEvent(doc, "mouseout", function() {

                docTit.style.visibility = "hidden";
            });

        },


        //iframe 加载函数

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


    function toolsFun(type, cdat) {
        var dat = jsonData.toolsData[type];

        var datArr = jsonData.toolArr;
        var f = f ? f : new Tools(datArr, dat);
        return f[type](cdat);
    }

    var cpos = { left: mod.viewWH()["width"] - 250, top: 50 }; //钟表的默认位置

    toolsFun("clock", cpos);

    var cpos = { left: mod.viewWH()["width"] - 300, top: 270 }; //天气的默认位置

    toolsFun("weather", cpos);

    var cpos = { left: mod.viewWH()["width"] - 250, top: 500 }; //提醒的默认位置

    toolsFun("warn", cpos);

    var cpos = { left: mod.viewWH()["width"] - 600, top: 50 }; //日历的默认位置

    toolsFun("calendar", cpos);

}())