/*
  数据配置
 */
var jsonData = {



    deskNum: 0, //默认显示敌机屏   0为第一屏

    defBackBg: "images/bimg/mlrs_d.jpg", //默认背景

    userName: "ccm", //默认用户

    /* 
    	桌面app数据
     	以二维数组形式存储
    */

    //窗口宽度，高度，窗口标题，窗口网址,属于第几屏

    deskData: [
        [
            { width: 800, height: 500, IcoSrc: "images/icon/kxjy.png", title: "腾讯网", src: "http://www.qq.com", index: 0 },
            { width: 500, height: 500, IcoSrc: "images/icon/kaikai.png", title: "网易网0", src: "http://www.163.com", index: 0 },
            { width: 800, height: 500, IcoSrc: "images/icon/musicbox.png", title: "易车网", src: "http://www.yiche.com", index: 0 },
            { width: 500, height: 500, IcoSrc: "images/icon/qqvedio.png", title: "百度网", src: "http://www.baidu.com", index: 0 },
            { width: 800, height: 500, IcoSrc: "images/icon/qqbaby.png", title: "新浪网", src: "http://www.sina.com.cn", index: 0 },
            { width: 900, height: 300, IcoSrc: "images/icon/musicbox.png", title: "易车网", src: "http://www.yiche.com", index: 0 },
            { width: 800, height: 500, IcoSrc: "images/icon/qqvedio.png", title: "百度网", src: "http://www.baidu.com", index: 0 },
            { width: 800, height: 500, IcoSrc: "images/icon/friendnear.png", title: "网易网2", src: "http://www.163.com", index: 0 },
            { width: 800, height: 500, IcoSrc: "images/icon/3366.png", title: "易车网", src: "http://www.yiche.com", index: 0 },
            { width: 800, height: 500, IcoSrc: "images/icon/5.png", title: "百度网", src: "http://www.baidu.com", index: 0 },
            { width: 800, height: 500, IcoSrc: "images/icon/readGod.png", title: "新浪网", src: "http://www.sina.com.cn", index: 0 },
            { width: 600, height: 500, IcoSrc: "images/icon/qqvedio.png", title: "百度网", src: "http://www.baidu.com", index: 0 },
            { width: 800, height: 500, IcoSrc: "images/icon/qqbaby.png", title: "新浪网", src: "http://www.sina.com.cn", index: 0 },
            { width: 800, height: 500, IcoSrc: "images/icon/musicbox.png", title: "易车网", src: "http://www.yiche.com", index: 0 },
            { width: 800, height: 500, IcoSrc: "images/icon/qqvedio.png", title: "百度网", src: "http://www.baidu.com", index: 0 },
            { width: 600, height: 500, IcoSrc: "", title: "添加应用", src: "javascript:;", index: 0 }
        ],
        [
            { width: 800, height: 500, IcoSrc: "images/icon/qqread.png", title: "网易网1", src: "http://www.163.com", index: 1 },
            { width: 800, height: 500, IcoSrc: "images/icon/sosomap.png", title: "易车网", src: "http://www.yiche.com", index: 1 },
            { width: 800, height: 500, IcoSrc: "images/icon/jinshan.png", title: "百度网", src: "http://www.baidu.com", index: 1 },
            { width: 400, height: 400, IcoSrc: "images/icon/doudizhu.png", title: "新浪网", src: "http://www.sina.com.cn", index: 1 },
            { width: 800, height: 500, IcoSrc: "", title: "添加应用", src: "javascript:;", index: 1 }
        ],
        [
            { width: 700, height: 500, IcoSrc: "images/icon/friendnear.png", title: "网易网2", src: "http://www.163.com", index: 2 },
            { width: 800, height: 500, IcoSrc: "images/icon/3366.png", title: "易车网", src: "http://www.yiche.com", index: 2 },
            { width: 800, height: 700, IcoSrc: "images/icon/5.png", title: "百度网", src: "http://www.baidu.com", index: 2 },
            { width: 800, height: 500, IcoSrc: "images/icon/readGod.png", title: "新浪网", src: "http://www.sina.com.cn", index: 2 },
            { width: 800, height: 400, IcoSrc: "", title: "添加应用", src: "javascript:;", index: 2 }
        ],
        [
            { width: 800, height: 500, IcoSrc: "images/icon/qidianzhongwen.png", title: "网易网3", src: "http://www.163.com", index: 3 },
            { width: 800, height: 500, IcoSrc: "images/icon/leshi.png", title: "易车网", src: "http://www.yiche.com", index: 3 },
            { width: 800, height: 500, IcoSrc: "images/icon/friend.png", title: "百度网", src: "http://www.baidu.com", index: 3 },
            { width: 800, height: 500, IcoSrc: "images/icon/bianqian.png", title: "新浪网", src: "http://www.sina.com.cn", index: 3 },
            { width: 800, height: 500, IcoSrc: "", title: "添加应用", src: "javascript:;", index: 3 }
        ],
        [
            { width: 800, height: 500, IcoSrc: "images/icon/musicbox.png", title: "网易网4", src: "http://www.163.com", index: 4 },
            { width: 800, height: 500, IcoSrc: "images/icon/mangguo.png", title: "易车网", src: "http://www.yiche.com", index: 4 },
            { width: 800, height: 500, IcoSrc: "images/icon/mail.png", title: "百度网", src: "http://www.baidu.com", index: 4 },
            { width: 800, height: 500, IcoSrc: "", title: "添加应用", src: "javascript:;", index: 4 }

        ]
    ],

    //侧边栏app数据
    //
    sideNavData: [

        { width: 800, height: 500, IcoSrc: "images/icon/zone.png", title: "qq空间", src: "http://www.qq.com", id: "s0" },
        { width: 800, height: 500, IcoSrc: "images/icon/weibo.png", title: "腾讯微博", src: "http://t.qq.com", id: "s1" },
        { width: 800, height: 500, IcoSrc: "images/icon/internet.png", title: "qq浏览器", src: "http://www.qq.com", id: "s2" },
        { width: 800, height: 500, IcoSrc: "images/icon/big.png", title: "腾讯QQ", src: "http://www.qq.com", id: "s3" },
        { width: 800, height: 500, IcoSrc: "images/icon/appmarket.png", title: "应用中心", src: "http://www.qq.com", id: "s4" }

    ],

    //更换背景数据
    //分为梦幻光影，美丽风景，漂亮人物三类
    //min为缩略图地址，max为大图地址

    changeBgData: [

        //推荐主题		
        [
            { min: "images/bimg/min/theme_blue.jpg", max: "images/bimg/blue_glow.jpg", title: "梦幻光阴" },
            { min: "images/bimg/min/theme_pinky_night.jpg", max: "images/bimg/fenhong_d.jpg", title: "粉红之夜" },
            { min: "images/bimg/min/theme_universe.jpg", max: "images/bimg/shenmi_d.jpg", title: "神秘星际" },
            { min: "images/bimg/min/theme_cloud.jpg", max: "images/bimg/cloud.jpg", title: "晴空行云" },
            { min: "images/bimg/min/kfqy_x.jpg", max: "images/bimg/kfqy_d.jpg", title: "咖啡情缘" },
            { min: "images/bimg/min/mlrs_x.jpg", max: "images/bimg/mlrs_d.jpg", title: "美丽人生" },
            { min: "images/bimg/min/ywxj_x.jpg", max: "images/bimg/ywxj_d.jpg", title: "仰望星空" },
            { min: "images/bimg/min/lszt_x.jpg", max: "images/bimg/lszt_d.jpg", title: "绿色主题" },
            { min: "images/bimg/min/wmaq_x.jpg", max: "images/bimg/wmaq_d.jpg", title: "完美爱情" }


        ],

        //日然风景
        [

            { min: "images/bimg/min/bxsj_x.jpg", max: "images/bimg/bxsj_d.jpg", title: "冰雪世界" },
            { min: "images/bimg/min/gwfg_x.jpg", max: "images/bimg/gwfg_d.jpg", title: "国外风光" },
            { min: "images/bimg/min/sqhy_x.jpg", max: "images/bimg/sqhy_d.jpg", title: "深秋回忆" },
            { min: "images/bimg/min/szml_x.jpg", max: "images/bimg/szml_d.jpg", title: "美丽河流" },

        ],

        //人物写真
        [

            { min: "images/bimg/min/bxmn_x.jpg", max: "images/bimg/bxmn_d.jpg", title: "冰雪美女" },
            { min: "images/bimg/min/kamn_x.jpg", max: "images/bimg/kamn_d.jpg", title: "可爱美女" },
            { min: "images/bimg/min/kall_x.jpg", max: "images/bimg/kall_d.jpg", title: "可爱萝莉" },


        ]



    ],

    //默认显示的工具

    toolArr: [1, 1, 0, 0], //默认显示图标			//1代表显示  0代表隐藏

    // 工具配置数据
    // 

    toolsData: {

        clock: { id: "clock-id", width: 170, height: 220, ifWidth: 170, ifHeight: 170, ifSrc: "iframe/clock.html", block: true, index: 0 },
        weather: { id: "weather-id", width: 215, height: 228, ifWidth: 215, ifHeight: 198, ifSrc: "iframe/weather.html", block: true, index: 1 },
        warn: { id: "warn-id", width: 161, height: 190, ifWidth: 161, ifHeight: 164, ifSrc: "iframe/warn.html", block: false, index: 2 },
        calendar: { id: "calendar-id", width: 200, height: 250, ifWidth: 200, ifHeight: 230, ifSrc: "iframe/calendar.html", block: false, index: 3 }






    }





}