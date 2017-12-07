window.onload = function() {

    //获得主屏对象，及其个组件对象id

    var appDeskVar = {

        inum: jsonData.deskNum, //默认是第2屏
        buff: true,
        menuBuff: false,
        mainW: _$("mainWin"),
        deskW: _$("deskWin"),
        mainBg: _$("mainBg"),
        sideBox: _$("sideNav"),
        navBar: _$("navBar"),
        deskBox: _$("deskbox"),
        deskContent: _$("deskcontent"),
        bottomCont: _$("bContent"), //底部标签栏
        navList: _$("navWarp"), //获得窗口切换导航标签
        iDeskH: mod.viewWH()["height"] - 145, //app容器高度
        iDeskW: mod.viewWH()["width"] - 100, //aPP容器宽度
        appArrPos: [
            [],
            [],
            [],
            [],
            []
        ], //app容器定位数组
        appArr: [
            [],
            [],
            [],
            [],
            []
        ], //创建app集合数组
        appRank: ["low", "row"], //low 按竖排排列//row 按横排排列
        appRankNum: 0, //默认为竖排


        navA: function() {

            return this.navList.getElementsByTagName("a");
        },
        deskList: function() {
            return this.deskContent.children;
        },
        deslConList: function() {
            return getElementsByClass(this.deskContent, "deskSty");
        },

        deskAppList: function() {
            return getElementsByClass(this.deskContent, "deskStyWarp"); //app窗口容器
        }


    };



    //功能函数方法对象，采用单体方面实现

    var deskStartFun = {

        init: function() {

            //app拖拽范围

            appDeskVar["iDeskH"] = mod.viewWH()["height"] - 130;
            appDeskVar["iDeskW"] = mod.viewWH()["width"] - 100;
            this.setWin(); //设置窗口大小
            this.setMain(); //初始化窗口组件功能
            this.deskStyFun(5); //设置桌面大小
            this.deskTab(); //窗口切换						
            this.appBJFun(appDeskVar.appRank[appDeskVar.appRankNum]); //默认显示按竖排显示
            this.createSideApp(); //侧边栏app
            this.rightToolFun(); //左侧工具条事件
            this.startMenuFun(); //开始菜单设置
            this.mouseEventFun(); //鼠标右键事件
            this.eventWinFun(); //默认执行事件，例如登陆窗口事件等
            this.setDeskBg(jsonData.defBackBg);
            this.shapeAppFun(); //app抖动	
            this.addToolFun(0, true); //默认显示图标		

        },

        appBJFun: function(arrange) { //app布局函数

            appDeskVar.appArrPos = [
                [],
                [],
                [],
                [],
                []
            ]; //app虽窗口的变化而变化

            for (var i = 0, len = appDeskVar.deskAppList().length; i < len; i++) {

                //创建桌面app
                //
                if (!appDeskVar.deskAppList()[i].tuff) {
                    appDeskVar.deskAppList()[i].index = i;
                    this.createApp(appDeskVar.deskAppList()[i]);

                }

            }

            for (var i = 0, len = appDeskVar.deskAppList().length; i < len; i++) {
                //low 按竖排排列
                //row 按横排排列
                //appDeskVar.appRank[appDeskVar.appRankNum]为何种方式排列		

                this.appBtnRize(appDeskVar.iDeskH, appDeskVar.iDeskW, appDeskVar.deskAppList()[i], arrange);
            }


        },

        //创建app集合

        createApp: function(desk) {




            for (var i = 0; i < jsonData.deskData[desk.index].length; i++) {

                var appBox = document.createElement("div");
                var icoBox = document.createElement("div");
                var nameBox = document.createElement("div");
                var txtBox = document.createElement("div");
                var innerRight = document.createElement("div");
                var imgIco = document.createElement("img");
                var delBtn = document.createElement("div");

                if (i == jsonData.deskData[desk.index].length - 1) {
                    addClass(appBox, "appBtn");
                    addClass(icoBox, "app-link-btn");
                    imgIco.style.display = "none";
                    delBtn.style.display = "none";
                } else {
                    addClass(appBox, "appBtn appIco");
                    addClass(icoBox, "appBtn-ico");
                }
                addClass(icoBox, "appBtn-ico");
                addClass(nameBox, "appName");
                addClass(txtBox, "appName-inner");
                addClass(innerRight, "appName-inner-right");
                addClass(delBtn, "del-app-sty");

                delBtn.title = "卸载应用";
                imgIco.src = jsonData.deskData[desk.index][i].IcoSrc;
                txtBox.innerHTML = jsonData.deskData[desk.index][i].title;
                appBox.title = jsonData.deskData[desk.index][i].title;
                appBox.sid = i;
                appBox.did = desk.index;

                //添加卸载应用事件
                //给卸载删除按钮添加事件

                ev.addEvent(delBtn, "click", function() {

                    this.parentNode.style.display = "none";

                    this.parentNode.sid = "no";

                    for (var i = 0, len = appDeskVar.deskAppList().length; i < len; i++) {
                        //low 按竖排排列
                        //row 按横排排列
                        //appDeskVar.appRank[appDeskVar.appRankNum]为何种方式排列		
                        //从app数组里删除app项目
                        //
                        appDeskVar.appArr[appDeskVar.deskAppList()[i].index] = appDeskVar.appArr[appDeskVar.deskAppList()[i].index].splice(this.parentNode.sid, 1);

                        deskStartFun.appBtnRize(appDeskVar.iDeskH, appDeskVar.iDeskW, appDeskVar.deskAppList()[i], appDeskVar.appRank[appDeskVar.appRankNum], true);
                    }



                });

                icoBox.appendChild(imgIco);
                appBox.appendChild(icoBox);
                nameBox.appendChild(txtBox);
                nameBox.appendChild(innerRight);
                appBox.appendChild(nameBox);
                appBox.appendChild(delBtn);
                desk.appendChild(appBox);

                //加入app集合

                appDeskVar.appArr[desk.index].push(appBox);

            }


            desk.tuff = true;

        },

        /*app抖动*/
        shapeAppFun: function() {

            var deskListParent = _$("deskcontent");
            var deskList = getElementsByClass(deskListParent, "deskSty");
            var oldTim = null;
            var sTimer = null;
            var ddTimer = null;

            for (var i = 0; i < deskList.length; i++) {

                deskList[i].onmousedown = function(e) {

                    var sThis = this;
                    var timer = null;
                    var appList = getElementsByClass(sThis, "appIco"); //获得每个屏幕的app个数      		 		 
                    clearTimeout(timer);
                    var evt = e || window.event;

                    if (evt.button == 1 || evt.button == 0) {

                        oldTim = new Date().getTime();

                        sTimer = setInterval(function() {

                            var nowTim = new Date().getTime();

                            if (nowTim - oldTim >= 5000) {

                                clearInterval(sTimer);
                                clearTimeout(ddTimer);

                                for (var k = 0; k < appList.length; k++) {

                                    getElementsByClass(appList[k], "del-app-sty")[0].style.display = "block";
                                }

                                state1();
                            }

                        }, 1000);

                    }



                    function state1() {

                        for (var j = 0; j < appList.length; j++) {

                            removeClass(appList[j], "r2");

                            addClass(appList[j], "r1");

                        }

                        ddTimer = setTimeout(state2, 100);
                    }

                    function state2() {
                        for (var j = 0; j < appList.length; j++) {

                            removeClass(appList[j], "r1");

                            addClass(appList[j], "r2");

                        }
                        ddTimer = setTimeout(state1, 100);
                    }


                }

                deskList[i].onmouseup = function() {

                    clearInterval(sTimer);
                }

                deskList[i].ondblclick = function() {

                    var appList = getElementsByClass(this, "appIco"); //获得每个屏幕的app个数

                    clearTimeout(ddTimer);
                    for (var i = 0; i < appList.length; i++) {

                        removeClass(appList[i], "r2");
                        removeClass(appList[i], "r1");
                        getElementsByClass(appList[i], "del-app-sty")[0].style.display = "none";
                    }


                }



            }



        },



        //创建侧边栏app

        createSideApp: function() {

            var sideBox = _$("sideIcoList");
            var _this = this;

            if (sideBox.buff) {
                return;
            } else {
                for (var i = 0; i < jsonData.sideNavData.length; i++) {


                    var sideApp = document.createElement("div");
                    var sideSpan = document.createElement("span");
                    var sideImg = document.createElement("img");

                    sideImg.src = jsonData.sideNavData[i]["IcoSrc"];
                    sideApp.title = jsonData.sideNavData[i]["title"];

                    addClass(sideApp, "side-app-box");
                    addClass(sideSpan, "side-app-sty");

                    sideSpan.appendChild(sideImg);
                    sideApp.appendChild(sideSpan);
                    sideBox.appendChild(sideApp);

                }

                var appArr = getElementsByClass(sideBox, "side-app-box");

                _this.sideAppClickFun(appArr); //侧边栏点击事件

                sideBox.buff = true;

            }

        },

        //侧边栏app 点击开打窗口

        sideAppClickFun: function(appArr) {

            var sThis = this;
            var parentBox = _$("deskbox");
            for (var i = 0; i < appArr.length; i++) {

                appArr[i].indCon = i;
                appArr[i].ondblclick = function(e) {

                    var _this = this;
                    var newWinWidth = 800;
                    var newWinHeight = 500;
                    var newWinLeft = (mod.viewWH()["width"] - newWinWidth) / 2;
                    var newWinTop = (mod.viewWH()["height"] - newWinHeight) / 2;
                    var evt = e || window.event;
                    var target = evt.target || evt.srcElement;
                    var data = {
                        pent: parentBox, //窗口的父容器对象
                        width: jsonData.sideNavData[_this.indCon]["width"], //窗口的宽高
                        height: jsonData.sideNavData[_this.indCon]["height"],
                        left: newWinLeft,
                        top: newWinTop,
                        drag: true, //窗口是否能被拖动
                        wintit: jsonData.sideNavData[_this.indCon]["title"], //窗口标题
                        iframSrc: jsonData.sideNavData[_this.indCon]["src"], //窗口网址	
                        smallIcoSrc: jsonData.sideNavData[_this.indCon]["IcoSrc"], //窗口小图标地址
                        winId: jsonData.sideNavData[_this.indCon]["id"] //窗口id

                        // buttonId:"k-"+wIndex 					   				    //判断是否点击的是图标ico

                    }

                    mod.createWindow(data, false, "part"); //传入三个参数为了判断是不是点击的图标

                    //第三个参数判断是否点击的图标还是最小化按钮
                    //
                    //mod.changeBuff(parseInt(data.winId.slice(-1)));

                    /*    mod.createBottomBar({
				    			    	  width:newWinWidth,							 //窗口的宽高
									      height:newWinHeight,
									      buff:"is"                                       //判断是不是当前屏

				    			    },sThis.deskTab);									 //采用回调函数的方法控制切换桌面
*/

                }

            }



        },


        //设置窗口的大小,以及各个组件布局

        setWin: function() {


            var winW = mod.viewWH()["width"]; //获得屏幕宽度
            var winH = mod.viewWH()["height"]; //获得屏幕高度
            appDeskVar.mainW.style.width = winW + "px";
            appDeskVar.mainW.style.height = winH + "px";

            appDeskVar.deskW.style.width = winW + "px";
            appDeskVar.deskW.style.height = winH + "px";

            appDeskVar.sideBox.style.top = (winH - appDeskVar.sideBox.offsetHeight) / 2 + "px";

            appDeskVar.navBar.style.top = "20px";
            appDeskVar.navBar.style.left = (winW - appDeskVar.navBar.offsetWidth) / 2 + "px";


        },

        //设置背景图片

        setDeskBg: function(srcImg, buff) {

            var winW = mod.viewWH()["width"]; //获得屏幕宽度
            var winH = mod.viewWH()["height"]; //获得屏幕高度

            var imgBg = appDeskVar.mainBg.getElementsByTagName("img")[0];

            if (buff) {
                cookie.delCookie(jsonData.userName, "/");
            }

            // console.log(cookie.getCookie(jsonData.userName));
            if (cookie.getCookie(jsonData.userName)) { //设置背景图,检查cookie如果存在就读取cookie

                imgBg.src = cookie.getCookie(jsonData.userName);
                imgBg.style.width = winW + "px";
                imgBg.style.height = winH + "px";
                imgBg.style.opacity = 1;
                imgBg.style.filter = "alpha(opacity=100)";

            } else {
                imgBg.src = srcImg;
                imgBg.style.width = winW + "px";
                imgBg.style.height = winH + "px";
                imgBg.style.opacity = 0.3;
                imgBg.style.filter = "alpha(opacity=30)";
                $(imgBg).startMove({ opacity: 100 }, 350, "linear");

                //设置cookie
                if (jsonData.userName) {
                    var expTim = new Date("2020/12/12");
                    cookie.setCookie(jsonData.userName, srcImg, expTim, "/");

                }
            }




        },


        setMain: function() {

            var navCon = _$("navCon");
            //分屏导航拖拽功能

            var barW = mod.viewWH()["width"] - navBar.offsetWidth;
            var barH = mod.viewWH()["height"] - navBar.offsetHeight

            var navBarData = {
                obj: navBar, //拖拽容器的id
                maxW: barW, //拖拽限制的最大宽度
                maxH: barH, //拖拽限制的最大高度
                impbuff: true, //是否限制拖拽范围
                zindexNum: 9999

            }
            mod.dragFun(navBarData, false);


        },

        //主窗口大小计算
        deskStyFun: function(num) {
            var deskW = mod.viewWH()["width"]; //获得浏览器宽度
            var deskH = mod.viewWH()["height"]; //获得浏览器高度
            var winW = mod.viewWH()["width"] - 100; //获得拖拽屏范围宽度
            var winH = mod.viewWH()["height"] - 140; //获得拖拽范围高度
            var mainBoxWidth = winW * num;
            appDeskVar.deskBox.style.width = deskW + "px";
            appDeskVar.deskBox.style.height = deskH + "px";
            appDeskVar.deskContent.style.width = mainBoxWidth + "px";
            appDeskVar.deskContent.style.height = deskH + "px";

            for (var i = 0; i < appDeskVar.deskList().length; i++) {

                appDeskVar.deslConList()[i].style.width = deskW + "px";
                appDeskVar.deslConList()[i].style.height = deskH + "px";
                appDeskVar.deskAppList()[i].style.width = winW + "px";
                appDeskVar.deskAppList()[i].style.height = winH + "px";

            }



        },


        /*//窗口切换函数js方式

					   deskTab:function(playNum){
					   		   var winW=mod.viewWH()["width"];   //获得屏幕宽度
							   var winH=mod.viewWH()["height"];	 //获得屏幕高度

							 
					 		 	appDeskVar.deskContent.style.left=0;
					 		 	appDeskVar.deskList()[appDeskVar.inum].style.display="block";

						   		for(var j=0,len=appDeskVar.navA().length-2;j<len;j++){

						   				appDeskVar.navA()[j].index=j;

						   		

						   				appDeskVar.navA()[j].onclick=function(){
						   					var _this=this;
						   					if(appDeskVar.buff){
						   							 appDeskVar.buff=false;
						   							 if(this.index==appDeskVar.inum){
						   							 		appDeskVar.buff=true;
								   					 		return;
						   							 }
								   					 appDeskVar.deskList()[this.index].style.display="block";
								 					 appDeskVar.navA()[appDeskVar.inum].getElementsByTagName("span")[0].style.display="none";
								 					 var deskWid=this.index>appDeskVar.inum?-winW:0;
					                                 if(this.index<appDeskVar.inum){
					                                 	appDeskVar.deskContent.style.left=-winW+"px";
					                                 }
								 					 appDeskVar.navA()[this.index].getElementsByTagName("span")[0].style.display="block";
								   					 		$(appDeskVar.deskContent).startMove({left:deskWid},700,"linear",function(){
								   					 				appDeskVar.deskList()[appDeskVar.inum].style.display="none";
								   					 				appDeskVar.deskContent.style.left=0;
								   					 				appDeskVar.inum=_this.index;
								   					 				appDeskVar.buff=true;
								   					 });
								   					
								   			}
						   					
						   				}

						   		}


					   },
*/





        //窗口切换函数 ，css3动画方式

        deskTab: function(playNum) {
            var winW = mod.viewWH()["width"]; //获得屏幕宽度
            var winH = mod.viewWH()["height"]; //获得屏幕高度
            var deskArr = appDeskVar.deskList();
            var deskNav = appDeskVar.navA();
            var sThis = this;

            // mod.createBottomBar(null,sThis.deskTab);
            // 
            for (var k = 0; k < deskNav.length; k++) {

                deskNav[appDeskVar.inum].getElementsByTagName("span")[0].style.display = "block";

            }


            for (var i = 0, len = deskArr.length; i < len; i++) {

                if (i == appDeskVar.inum) {
                    addClass(deskArr[i], "deskAnimateShow");
                } else if (i < appDeskVar.inum) {

                    addClass(deskArr[i], "deskPosLeft");
                } else {
                    addClass(deskArr[i], "deskPosRight");
                }
            }


            for (var j = 0, len = deskNav.length - 2; j < len; j++) {


                /* if(playNum!=undefined){

							   					var deskNum=parseInt(playNum.slice(-1));  //第几个桌面
							   		
							  			 }

*/
                function tabFun(snum) {

                    var _this = this;
                    var buffnum = null;
                    if (typeof snum == "number") {

                        buffnum = snum;
                        //alert(snum);
                    } else {

                        buffnum = _this.index;

                    }


                    if (buffnum == appDeskVar.inum) {
                        return;
                    }

                    for (var i = 0, len = deskArr.length; i < len; i++) {

                        if (buffnum < i) {

                            deskArr[i].className = "deskSty deskPosRight";

                        } else {

                            deskArr[i].className = "deskSty deskPosLeft";
                        }
                    }

                    //deskArr[_this.index].className="deskSty deskAnimateShow";	
                    removeClass(deskArr[appDeskVar.inum], "deskAnimateShow");

                    if (buffnum > appDeskVar.inum) {

                        deskArr[appDeskVar.inum].className = "deskSty deskAnimate1";
                        deskArr[buffnum].className = "deskSty deskAnimateShow";

                    }
                    if (buffnum < appDeskVar.inum) {

                        deskArr[appDeskVar.inum].className = "deskSty deskAnimate2";
                        deskArr[buffnum].className = "deskSty deskPosLeft deskAnimateShow";

                    }


                    deskNav[appDeskVar.inum].getElementsByTagName("span")[0].style.display = "none";
                    deskNav[buffnum].getElementsByTagName("span")[0].style.display = "block";

                    appDeskVar.inum = buffnum;
                    mod.changeBuff(buffnum);

                }

                if (playNum != undefined) { //判断是不是点击最小化图标进行的滚屏
                    var deskNum = parseInt(playNum.slice(-1)); //第几个桌面
                    tabFun(deskNum);

                }

                deskNav[j].index = j;
                deskNav[j].onclick = tabFun;

            }


        },


        //桌面app布局

        appBtnRize: function(iH, iW, deskobj, rankApp, suff) {

            var appW = 88 + 50; //app所占宽度
            var appH = 88 + 25; //app所占高度 



            var rowNum = Math.floor(iW / appW); //一行能放的app个数
            var lowNum = Math.floor(iH / appH); //一列能放下的app个数

            /* if(!suff){													//判断是否删除了app应用

                 var appArr=appDeskVar.appArr[deskobj.index];              //获得每屏的app集合

             }else{*/
            var appArr = [];
            var pArr = getElementsByClass(deskobj, "appBtn");


            for (var i = 0; i < pArr.length; i++) {

                if (pArr[i].sid != "no") {
                    appArr.push(pArr[i]);
                }
            }

            // 	  }

            for (var j = 0, len = appArr.length; j < len; j++) {

                if (rankApp == "row") { //low 按竖排排列
                    //row 按横排排列

                    var appL = Math.floor(j % rowNum) * appW;
                    var appT = Math.floor(j / rowNum) * appH;
                }
                if (rankApp == "low") {
                    var appL = Math.floor(j / lowNum) * appW;
                    var appT = Math.floor(j % lowNum) * appH;

                }

                appDeskVar.appArrPos[deskobj.index].push({ left: appL, top: appT });

            }

            //初始化app动画


            for (var k = 0; k < appArr.length; k++) {


                $(appArr[k]).startMove({ left: appDeskVar.appArrPos[deskobj.index][k].left, top: appDeskVar.appArrPos[deskobj.index][k].top }, 700, "easeOut");

            }

            this.appDrag(appDeskVar.appArrPos);

        },

        //桌面app拖拽事件



        appDrag: function(pos) {



            var _this = this;

            for (var i = 0, len = appDeskVar.deskAppList().length; i < len; i++) {

                dragApp(appDeskVar.deskAppList()[i]);
            }

            function dragApp(desk) {

                //var appArr=desk.children;
                //
                var appArr = [];
                var appG = getElementsByClass(desk, "appIco"); //获得拖拽app集合

                for (var z = 0; z < appG.length; z++) {

                    if (appG[z].sid != "no") { //如果已经删除位置不计算在内
                        appArr.push(appG[z]);
                    }

                }


                for (var k = 0, len = appArr.length; k < len; k++) {
                    appArr[k].index = k;
                    appArr[k].indCon = k;

                }

                _this.appClickFun(appArr, desk.index);

                for (var j = 0, len = appArr.length; j < len; j++) {

                    var data = {
                        obj: appArr[j], //拖拽容器的id
                        maxW: appDeskVar["iDeskW"] - 100, //拖拽限制的最大宽度
                        maxH: appDeskVar["iDeskH"] - 100, //拖拽限制的最大高度
                        impbuff: true,
                        dragExp: true, //是否有拖拽位置变换
                        aPos: pos[desk.index], //每个app的位置
                        appArr: appArr

                    }

                    mod.dragFun(data, false);
                    // dragExp(appArr[j],appArr);

                }


            }



        },


        /*
        	桌面app点击事件,创建窗口
         */

        appClickFun: function(appArr, ind) {

            var sThis = this;
            for (var i = 0; i < appArr.length; i++) {

                appArr[i].ondblclick = function(e) {




                    sThis.appOpenFun(this);

                    /*	var _this=this;
				       		 		var pIndex=$(_this.parentNode).attr("index");				       		 		 
									var wIndex=_this.indCon+"-"+pIndex;
									var newWinWidth=800;
									var newWinHeight=500;
									var newWinLeft=(mod.viewWH()["width"]-newWinWidth)/2;
									var newWinTop=(mod.viewWH()["height"]-newWinHeight)/2;
									var evt=e||window.event;
					     	   		var target=evt.target||evt.srcElement;

					     	   		//alert(target.parentNode.nodeName);

									var data={
									       pent:_this.parentNode.parentNode,      						//窗口的父容器对象
									       width:jsonData.deskData[pIndex][_this.sid]["width"],		//窗口的宽高
									       height:jsonData.deskData[pIndex][_this.sid]["height"],
									       left:newWinLeft,
									       top:newWinTop,
									       drag:true,							 							 //窗口是否能被拖动
									       wintit:jsonData.deskData[pIndex][_this.sid]["title"],           //窗口标题
									       iframSrc:jsonData.deskData[pIndex][_this.sid]["src"],		  	//窗口网址	
									       smallIcoSrc:jsonData.deskData[pIndex][_this.sid]["IcoSrc"],    //窗口小图标地址
									       winId:wIndex, 							   						 //窗口id
									       buttonId:"k-"+wIndex 					   						 //判断是否点击的是图标ico

									}
									
					     	   		
									//第三个参数判断是否点击的图标还是最小化按钮
									//
									mod.changeBuff(parseInt(data.winId.slice(-1)));  //判断当前窗口是不是在当前屏
				    			    mod.createWindow(data,wIndex,target.parentNode.nodeName);
				    			    mod.createBottomBar({
				    			    	  width:newWinWidth,							 //窗口的宽高
									      height:newWinHeight,
									      buff:"is"                                       //判断是不是当前屏

				    			    },sThis.deskTab);	*/ //采用回调函数的方法控制切换桌面


                }

            }



        },


        appOpenFun: function(appObj) {



            var sThis = this;
            var _this = appObj;
            var pIndex = $(_this.parentNode).attr("index");
            var wIndex = _this.indCon + "-" + pIndex;
            var newWinWidth = 800;
            var newWinHeight = 500;
            var newWinLeft = (mod.viewWH()["width"] - newWinWidth) / 2;
            var newWinTop = (mod.viewWH()["height"] - newWinHeight) / 2;
            //var evt=e||window.event;
            //var target=evt.target||evt.srcElement;
            var data = {
                pent: _this.parentNode.parentNode, //窗口的父容器对象
                width: jsonData.deskData[pIndex][_this.sid]["width"], //窗口的宽高
                height: jsonData.deskData[pIndex][_this.sid]["height"],
                left: newWinLeft,
                top: newWinTop,
                drag: true, //窗口是否能被拖动
                wintit: jsonData.deskData[pIndex][_this.sid]["title"], //窗口标题
                iframSrc: jsonData.deskData[pIndex][_this.sid]["src"], //窗口网址	
                smallIcoSrc: jsonData.deskData[pIndex][_this.sid]["IcoSrc"], //窗口小图标地址
                winId: wIndex, //窗口id
                buttonId: "k-" + wIndex //判断是否点击的是图标ico

            }


            //第三个参数判断是否点击的图标还是最小化按钮
            //
            mod.changeBuff(parseInt(data.winId.slice(-1))); //判断当前窗口是不是在当前屏
            mod.createWindow(data, wIndex, "DIV");
            mod.createBottomBar({
                width: newWinWidth, //窗口的宽高
                height: newWinHeight,
                buff: "is" //判断是不是当前屏

            }, sThis.deskTab); //采用回调函数的方法控制切换桌面


        },

        /*
					更换主题方法函数				 
				  */

        setBgFun: function(buff) {

            var systemBgId = _$("systemBg");
            var closeBtn = _$("closeWinBg"); //关闭按钮
            var titId = _$("winBgTit");
            var bgListBox = _$("deskBgCon"); //图片容器
            var listBox = getElementsByClass(bgListBox, "deskBg-list"); //各个分类的背景缩略图容器
            var navList = _$("deskBgNav").children;
            var conBgList = bgListBox.children;
            var _this = this;
            var dataImg = jsonData.changeBgData; //数据

            systemBgId.style.display = "block";

            closeBtn.onclick = function() {
                systemBgId.style.display = "none";

            }

            if (buff) {
                if (systemBgId.style.display == "none") {
                    systemBgId.style.display = "block";
                }
            }
            systemBgId.style.zIndex = mod.ind++;


            //创建背景及缩略图函数

            createBgFun();

            function createBgFun() {

                for (var i = 0; i < listBox.length; i++) {
                    listBox[i].index = i;
                    listBox[i].innerHTML = "";
                    for (var j = 0; j < dataImg[i].length; j++) {

                        var aBox = document.createElement("a");
                        var imgBox = document.createElement("div");
                        var titBox = document.createElement("div");
                        var imgobj = document.createElement("img");
                        //var imgtit=document.createElement("div");
                        imgobj.src = dataImg[i][j].min;

                        aBox.href = "#";
                        aBox.index = j;
                        aBox.sIndex = i;
                        addClass(aBox, "list-a");
                        addClass(imgBox, "img-box");
                        addClass(titBox, "tit-box");
                        //addClass(imgtit,"imgTit");
                        titBox.innerHTML = dataImg[i][j].title;
                        //imgtit.innerHTML=dataImg[i][j].title;


                        //imgBox.appendChild(imgtit);
                        imgBox.appendChild(imgobj)
                        aBox.appendChild(imgBox);
                        aBox.appendChild(titBox);
                        listBox[i].appendChild(aBox);
                        //	imgBox.style.background="url("+dataImg[i][j].min+")";

                        aBox.onclick = function() {

                            deskStartFun.setDeskBg(jsonData.changeBgData[this.sIndex][this.index].max, true); //true判断是不是点击设置的背景

                        }


                    }


                }


            }

            //选项卡函数

            tabFun(0);

            function tabFun(num) {
                for (var i = 0; i < navList.length; i++) {
                    removeClass(navList[i], "current");
                    conBgList[i].style.display = "none";
                }
                var s = num;
                addClass(navList[s], "current");
                conBgList[s].style.display = "block";

                for (var i = 0; i < navList.length; i++) {

                    navList[i].index = i;
                    navList[i].onclick = function() {

                        removeClass(navList[s], "current");
                        conBgList[s].style.display = "none";
                        addClass(navList[this.index], "current");
                        conBgList[this.index].style.display = "block";
                        s = this.index;

                    }

                }


            }
            var barW = mod.viewWH()["width"] - systemBgId.offsetWidth;
            var barH = mod.viewWH()["height"] - systemBgId.offsetHeight

            //拖拽开始
            var data = {
                obj: systemBgId, //拖拽容器的id
                maxW: barW, //拖拽限制的最大宽度
                maxH: barH, //拖拽限制的最大高度
                impbuff: true //是否限制拖拽范围				                    
            }

            titId.onmousedown = function() {

                mod.dragFun(data, false);

            }
            titId.onmouseup = function() {


                mod.dragFun(data, true);
            }




        },

        //系统设置方法函数

        systemSetFun: function() {
            var sysbox = _$("sysSet");
            var closeBtn = _$("closeWinSet");
            var titBox = _$("sysTit");
            var _this = deskStartFun;

            sysbox.style.display = "block";

            /*if(appDeskVar.setSysPos!=undefined){

				 			sysbox.style.left=appDeskVar.setSysPos["left"]+"px";
				 			sysbox.style.top=appDeskVar.setSysPos["top"]+"px";

				 		}else{
					 		sysbox.style.left=(mod.viewWH()["width"]-sysbox.offsetWidth)/2-500+"px";
					 		sysbox.style.top=(mod.viewWH()["height"]-sysbox.offsetHeight)/2+100+"px";
					 	}
*/
            closeBtn.onclick = function() {
                /*	appDeskVar.setSysPos["left"]=sysbox.offsetLeft+"px";
				 				appDeskVar.setSysPos["top"]=sysbox.offsetTop+"px";
*/
                sysbox.style.display = "none";
            }
            sysbox.style.zIndex = mod.ind++;
            var applist = _$("setapplist").getElementsByTagName("a");

            applist[0].onclick = function() {

                //setBgFun
                //console.log(_this);
                _this.setBgFun(true);


            }



            //拖拽开始
            //
            var barW = mod.viewWH()["width"] - sysbox.offsetWidth;
            var barH = mod.viewWH()["height"] - sysbox.offsetHeight

            var data = {
                obj: sysbox, //拖拽容器的id
                maxW: barW, //拖拽限制的最大宽度
                maxH: barH, //拖拽限制的最大高度
                impbuff: true //是否限制拖拽范围

            }

            titBox.onmousedown = function() {

                mod.dragFun(data, false);

            }
            titBox.onmouseup = function() {

                mod.dragFun(data, true);
            }


        },

        startMenuFun: function() {

            var startM = _$("startMenu");
            var startDiv = _$("startMenuDiv");
            /*
				 		if(!appDeskVar.menuBuff){						 			
			 				startM.style.display="block";						 											 				
			 				appDeskVar.menuBuff=true;
			 			}else{

			 				startM.style.display="none";
			 				appDeskVar.menuBuff=false;
			 			}*/

            ev.addEvent(document, "click", function(e) {

                var evt = e || window.event;
                var target = evt.target || evt.srcElement;

                startDiv.style.display = "none";
            })


            startM.onclick = function(e) {

                var evt = e || window.event;

                if (!startM.style.display) {

                    startDiv.style.display = "block";
                } else {
                    return;
                }

                evt.stopPropagation ? evt.stopPropagation() : evt.cancelBubble = true;
            }
        },


        //左侧导航，工具事件
        //

        rightToolFun: function() {

            var toolList = _$("toolList");
            var listBtn = toolList.getElementsByTagName("a");
            var _this = this;

            for (var i = 0; i < listBtn.length; i++) {
                listBtn[i].index = i;
                listBtn[i].onclick = function() {
                    switch (this.index) {
                        case 0:
                            return
                            break;
                        case 1:
                            return
                            break;
                        case 2:
                            _this.systemSetFun();
                            break;
                        case 3:
                            _this.setBgFun();
                            break;

                    }
                }


            }


        },

        //鼠标右键事件

        mouseEventFun: function() {

            var _this = this;
            var appARR = [];

            //屏蔽鼠标右键
            document.oncontextmenu = function(e) {
                var evt = e || window.event;
                var target = evt.srcElement || evt.target;
                var pent = target;
                var pnum = 0; //检测在哪点击的鼠标右键
                appARR = [];
                while (pent.parentNode) {

                    if (hasClass(pent, "appIco")) {
                        pnum = 1;
                        appARR.push(pent);
                        break;
                    }
                    if (pent.className == null) {
                        pnum = 0;
                        break;
                    }

                    pent = pent.parentNode;



                }

                _this.contentMenuFun(e, pnum, appARR);

                return false;
            }




        },

        //右键菜单设置
        contentMenuFun: function(e, isNum, appARR) {
            var _this = this;
            var evt = e || window.event;
            var eX = evt.clientX;
            var eY = evt.clientY;

            var subMenuSet = _$("subMenuSet"); //主题设置菜单
            var sysMenuSet = _$("sysMenuSet"); //系统设置菜单

            var mainMenu = _$("contentMenu"); //右键主菜单
            var yyMenu = _$("contentOne"); //添加小应用菜单
            var plMenu = _$("contentTwo"); //图标排列菜单

            var addTool = _$("addToolMenu"); //添加工具
            var addToolList = yyMenu.getElementsByTagName("a");

            var setIco = _$("icoSetMenu"); //图标排列
            var setIcoList = plMenu.getElementsByTagName("a");

            var uploadBtn = _$("uploadId"); //上传按钮

            var cancalBtn = _$("cancelId");

            var localBtn = _$("localBtnId"); //锁定按钮

            var appMainMenu = _$("appcontentMenu"); //app图标右键主菜单
            var moveBtn = _$("moveBtn"); //移动屏幕按钮
            var contentMove = _$("contentMove"); //移动屏幕子菜单
            var moveDesk = contentMove.getElementsByTagName("li");


            var appMenuList = appMainMenu.getElementsByTagName("li");



            if (isNum == 0) {
                mainMenu.style.left = eX + "px";
                mainMenu.style.top = eY + "px";
                mainMenu.style.display = "block";
            } else {
                appMainMenu.style.left = eX + "px";
                appMainMenu.style.top = eY + "px";
                appMainMenu.style.display = "block";

            }

            //子菜单实现函数
            //	
            childMenu(addTool, yyMenu, { left: eX + 143, top: eY + 76 });
            childMenu(setIco, plMenu, { left: eX + 143, top: eY + 160 });

            childMenu(moveBtn, contentMove, { left: eX + 143, top: eY + 20 });

            //图标排列函数
            hideMenuFun(); //隐藏右键产生的菜单
            IcoMenuFun();


            subMenuSet.onclick = _this.setBgFun;
            sysMenuSet.onclick = _this.systemSetFun;
            uploadBtn.onclick = _this.loginBoxFun; //登陆弹框
            cancalBtn.onclick = cancalFun;
            localBtn.onclick = _this.localWinFun;

            //添加工具函数
            //
            for (var i = 0; i < addToolList.length; i++) {

                addToolList[i].index = i;

                addToolList[i].onclick = function() {


                    _this.addToolFun(this.index);

                }

            }


            //app右键菜单函数添加
            //
            //
            //
            //
            if (isNum != 0) {
                for (var g = 0; g < moveDesk.length; g++) {

                    moveDesk[g].getElementsByTagName("span")[0].style.display = "none";

                }

                moveDesk[appARR[0].did].getElementsByTagName("span")[0].style.display = "block";
            }

            for (var t = 0; t < moveDesk.length; t++) {

                moveDesk[t].index = t;
                moveDesk[t].onclick = function() {

                    if (this.index == appARR[0].did) {

                        contentMove.style.display = "none";
                        return;

                    } else {


                        moveDesk[appARR[0].did].getElementsByTagName("span")[0].style.display = "none";

                        moveDesk[this.index].getElementsByTagName("span")[0].style.display = "block";


                        //	appARR[0].style.display="none";
                        //	appARR[0].sid="no";

                        //low 按竖排排列
                        //row 按横排排列
                        //appDeskVar.appRank[appDeskVar.appRankNum]为何种方式排列		
                        //从app数组里删除app项目
                        //
                        //appDeskVar.appArr[appDeskVar.deskAppList()[appARR[0].did].index]=appDeskVar.appArr[appDeskVar.deskAppList()[appARR[0].did].index].splice(appARR[0].sid,1);															

                        appDeskVar.deskAppList()[this.index].appendChild(appARR[0]);

                        deskStartFun.appBtnRize(appDeskVar.iDeskH, appDeskVar.iDeskW, appDeskVar.deskAppList()[appARR[0].did], appDeskVar.appRank[appDeskVar.appRankNum], true);





                        deskStartFun.appBtnRize(appDeskVar.iDeskH, appDeskVar.iDeskW, appDeskVar.deskAppList()[this.index], appDeskVar.appRank[appDeskVar.appRankNum], true);






                        //deskStartFun.appBtnRize(appDeskVar.iDeskH,appDeskVar.iDeskW,appDeskVar.deskAppList()[this.index],appDeskVar.appRank[appDeskVar.appRankNum],true);


                        appARR[0].did = this.index;



                    }



                }




            }


            for (var k = 0; k < appMenuList.length; k++) {

                appMenuList[k].index = k;
                appMenuList[k].onclick = function() {

                    if (this.index == 0) {

                        _this.appOpenFun(appARR[0]);
                    }
                    if (this.index == 3) { //右键卸载

                        appARR[0].style.display = "none";
                        appARR[0].sid = "no";
                        for (var i = 0, len = appDeskVar.deskAppList().length; i < len; i++) {
                            //low 按竖排排列
                            //row 按横排排列
                            //appDeskVar.appRank[appDeskVar.appRankNum]为何种方式排列		
                            //从app数组里删除app项目
                            //
                            appDeskVar.appArr[appDeskVar.deskAppList()[i].index] = appDeskVar.appArr[appDeskVar.deskAppList()[i].index].splice(appARR[0].sid, 1);

                            deskStartFun.appBtnRize(appDeskVar.iDeskH, appDeskVar.iDeskW, appDeskVar.deskAppList()[i], appDeskVar.appRank[appDeskVar.appRankNum], true);
                        }

                    }

                }

            }

            //uploadBtn.onclick=mod.createWindow()();

            function cancalFun() {

                location.reload(location.href);

            }


            function hideMenuFun() {

                document.onclick = function() {

                    mainMenu.style.display = "none";
                    yyMenu.style.display = "none";
                    plMenu.style.display = "none";
                    appMainMenu.style.display = "none";

                }

            }


            //定义鼠标右键菜单

            function childMenu(Fmenu, Zmenu, pos) {

                var timer = null;

                Fmenu.onmouseover = function() {

                    clearTimeout(timer);
                    Zmenu.style.left = pos.left + "px";
                    Zmenu.style.top = pos.top + "px";
                    Zmenu.style.display = "block";


                }
                Fmenu.onmouseout = function() {

                    timer = setTimeout(function() {

                        Zmenu.style.display = "none";

                    }, 50);

                }

                Zmenu.onmouseover = function() {

                    clearTimeout(timer);

                }
                Zmenu.onmouseout = function() {

                    timer = setTimeout(function() {

                        Zmenu.style.display = "none";

                    }, 50);

                }

            }


            //图标排列方法函数

            function IcoMenuFun() {

                setIcoList[appDeskVar.appRankNum].getElementsByTagName("span")[0].style.display = "block";
                for (var i = 0; i < setIcoList.length; i++) {
                    setIcoList[i].index = i;
                    setIcoList[i].onclick = function() {

                        if (this.index == appDeskVar.appRankNum) {

                            return;

                        } else {


                            _this.appBJFun(appDeskVar.appRank[this.index]); //app布局 //low 按竖排排列//row 按横排排列

                            setIcoList[appDeskVar.appRankNum].getElementsByTagName("span")[0].style.display = "none";
                            appDeskVar.appRankNum = this.index;
                            setIcoList[appDeskVar.appRankNum].getElementsByTagName("span")[0].style.display = "block";

                        }

                    }


                }





            }


        },

        //添加工具函数

        addToolFun: function(xnum, buff) {
            var _this = this;
            var yyMenu = _$("contentOne"); //添加小应用菜单  
            var addToolList = yyMenu.getElementsByTagName("a");
            var toolA = jsonData.toolArr;




            if (buff) {

                for (var j = 0; j < toolA.length; j++) {

                    if (toolA[j] == 0) {

                        addToolList[j].getElementsByTagName("span")[0].style.display = "none";
                        //clockId.style.display="block";
                    } else {

                        addToolList[j].getElementsByTagName("span")[0].style.display = "block";
                    }


                }
                return;

            }



            if (!buff) {
                var toolId;
                if (xnum == 0) {
                    toolId = _$("clock-id"); //时间控件
                }
                if (xnum == 1) {
                    toolId = _$("weather-id"); //天气控件
                }
                if (xnum == 2) {
                    toolId = _$("warn-id"); //提醒控件
                }
                if (xnum == 3) {
                    toolId = _$("calendar-id"); //日历控件
                }

                if (toolId && toolId.style.display == "block") {

                    addToolList[xnum].getElementsByTagName("span")[0].style.display = "none";
                    toolId.style.display = "none";
                    toolA[xnum] = 0; //改变状态0为隐藏

                } else {

                    addToolList[xnum].getElementsByTagName("span")[0].style.display = "block";
                    toolId.style.display = "block";
                    toolA[xnum] = 1; //改变状态1为显示

                }


            }



        },

        /*默认时间函数，包括弹出窗口，登陆框。。*/
        eventWinFun: function() {
            var _this = this;
            var navListId = _$("navListId");
            var startLoginId = _$("startLoginId");
            navListId.onclick = _this.loginBoxFun;
            startLoginId.onclick = _this.loginBoxFun;

            /*提醒功能函数*/
            var txBox = _$("txBoxId");
            var closeA = _$("closeA");

            txBox.onmouseover = function() {

                closeA.style.display = "block";
            }
            txBox.onmouseout = function() {

                closeA.style.display = "none";
            }

            closeA.onclick = function() {

                txBox.style.display = "none";
            }


        },

        /*登陆窗口*/
        loginBoxFun: function() {
            var shadeBox = _$("shadeDiv");
            var loginBox = _$("loginId");
            var closeBox = _$("closeBtnId");
            var loginBoxId = _$("loginId");


            loginBox.style.display = "block";
            loginBox.style.left = (mod.viewWH()["width"] - loginBox.offsetWidth) / 2 + "px";
            loginBox.style.top = (mod.viewWH()["height"] - loginBox.offsetHeight) / 2 - 100 + "px";


            shadeBox.style.width = mod.viewWH()["width"] + "px";
            shadeBox.style.height = mod.viewWH()["height"] + "px";

            shadeBox.style.display = "block";


            /* var barW=mod.viewWH()["width"]-loginBox.offsetWidth;
					  	 var barH=mod.viewWH()["height"]-loginBox.offsetHeight;*/

            closeBox.onclick = function() {

                loginBox.style.display = "none";
                shadeBox.style.display = "none";

            }



        },

        /*锁定窗口*/

        localWinFun: function() {
            var zzDiv = _$("shadeDiv"); //背景半透明遮罩层
            var localP = _$("localParent") //父窗口

            var localWin = _$("localWin"); //输入密码的锁定窗口
            var unlocalWin = _$("unlocalwin"); //解锁窗口
            var localClose = _$("localClose"); //关闭按钮


            var passBox = _$("lockPassword"); //输入密码框
            var spassBox = _$("confirmLockPassword"); //重复密码框

            var unlocalBox = _$("unLockPassword"); //解锁密码框

            var tsBox = _$("passMsg"); //密码输入提示
            var unTsBox = _$("unlocalMsg"); //密码错误提示
            tsBox.innerHTML = "";
            unTsBox.innerHTML = "";


            var sureBtn = _$("localSure"); //确认按钮1
            var qxBtn = _$("localCancel"); //取消按钮

            var unSureBtn = _$("unlocalSure"); //确认按钮2

            var wh = mod.viewWH()["height"] + "px";
            var ww = mod.viewWH()["width"] + "px";

            //	zzDiv.style.width=mod.viewWH()["width"]+"px";
            //zzDiv.style.height=mod.viewWH()["height"]+"px";

            zzDiv.style.display = "block";
            localWin.style.display = "block";
            unlocalWin.style.display = "block";

            zzDiv.style.width = 0;
            zzDiv.style.height = 0;

            zzDiv.style.top = 0;
            zzDiv.style.left = 0;

            localP.style.display = "block";
            var topVal = (mod.viewWH()["height"] - localP.offsetHeight) / 2 + "px";

            passFun();

            function passFun() {

                localP.style.left = (mod.viewWH()["width"] - localP.offsetWidth) / 2 + "px";
                localP.style.top = -localP.offsetHeight + "px";

                $(zzDiv).startMove({ width: ww, height: wh }, 500, "easeOut", function() {

                    $(localP).startMove({ top: topVal }, 1000, "bounceOut");

                });



                localClose.onclick = qxBtn.onclick = function() {



                    $(localP).startMove({ left: -localP.offsetWidth }, 1000, "elasticIn", function() {

                        $(zzDiv).startMove({ width: 0, height: 0 }, 500, "easeOut", function() {

                            zzDiv.style.display = "none";
                            localP.style.display = "none";
                        });

                    });


                }

                sureBtn.onclick = function() {

                    var val1 = passBox.value.trimSpaces();
                    var val2 = spassBox.value.trimSpaces();

                    if (val1 == "") {
                        passBox.focus();
                        tsBox.innerHTML = "密码不能为空";
                        return;
                    } else {

                        if (val1 == val2) {

                            unpassFun(val1);

                        } else {


                            tsBox.innerHTML = "两次密码输入不一致";
                            spassBox.focus();
                            return;
                        }

                    }



                }



            }



            function unpassFun(val) {

                if (window.localStorage) {

                    localStorage[val] = val;

                }

                $(zzDiv).startMove({ opacity: 100 }, 300, "linear");

                $(localWin).startMove({ opacity: 0 }, 300, "easeOut", function() {

                    localWin.style.display = "none";

                });
                //$(localWin).startMove({opacity:0},300,"easeOut");


                //addClass(localP,"local-rol");

                unSureBtn.onclick = function() {

                    var val3 = unlocalBox.value.trimSpaces();
                    if (val3 == "") {
                        unTsBox.innerHTML = "请输入解锁密码";
                        unlocalBox.focus();
                        return;
                    } else {

                        if (localStorage[val3]) {


                            $(localP).startMove({ left: -localP.offsetWidth }, 1000, "elasticIn", function() {


                                setTimeout(function() {


                                    $(zzDiv).startMove({ width: 0, height: 0 }, 500, "easeOut", function() {

                                        zzDiv.style.display = "none";
                                        localP.style.display = "none";
                                        passBox.value = "";
                                        spassBox.value = "";
                                        unlocalBox.value = "";
                                        localStorage[val] = "";
                                        $(zzDiv).startMove({ opacity: 50 }, 100, "linear");
                                        $(localWin).startMove({ opacity: 100 }, 100, "linear");
                                    });


                                }, 200);



                            });



                        } else {

                            unTsBox.innerHTML = "密码错误,请从新输入！";
                            unlocalBox.focus();
                            return;

                        }


                    }


                }



            }



        }


















    }


    //加载进度条函数
    //
    //
    var nowImgNum = 0;
    var dnum = 0;
    var maxNum = 0;

    loadFun();

    function loadFun() {

        var WH = document.documentElement.clientHeight;
        var WW = document.documentElement.clientWidth;
        var loadDiv = _$("loadDivId");
        var loadBox = _$("loadBoxId");
        var loadTxt = _$("loadTxtId");
        var mainWindow = _$("mainWin");


        loadTxt.innerHTML = 0 + "%";
        loadDiv.style.width = WW + "px";
        loadDiv.style.height = WH + "px";



        var imgData = jsonData.changeBgData;

        for (var j = 0; j < imgData.length; j++) {

            for (var z = 0; z < imgData[j].length; z++) {

                dnum++;
            }
        }

        dnum = dnum * 2;

        for (var i = 0; i < imgData.length; i++) {

            imgLoad(imgData[i]);

        }

        function imgLoad(imgdata) {

            var len = imgdata.length * 2;

            for (var i = 0; i < len; i++) {

                var newImg = new Image();

                if (i < len / 2) {

                    newImg.src = imgdata[i].max;
                } else {

                    newImg.src = imgdata[i - len / 2].min;
                }

                newImg.onload = function() {

                    nowImgNum++;

                    if (nowImgNum == dnum) {

                        loadTxt.innerHTML = 100 + "%";
                        deskStartFun.init();
                        $(loadDiv).startMove({ opacity: 0 }, 1000, "linear", function() {
                            loadDiv.style.display = "none";

                        });

                        setTimeout(function() {
                            $(mainWindow).startMove({ opacity: 100 }, 1000, "linear");
                        }, 200);


                    } else {

                        loadTxt.innerHTML = parseInt(nowImgNum / dnum * 100) + "%";

                    }

                }


            }

        }


    }



    //窗口自适应
    ev.addEvent(window, "resize", function() {

        mod.init();
        deskStartFun.init();
    });




}