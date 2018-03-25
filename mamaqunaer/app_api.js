(function (window) {
    var app = {};
    app.ia = new Array();
    app.initialize = function (o) {
        if (app.isLogin()) {
            o();
            return
        }
        var io = new Object();
        try {
            io.c = Object.prototype.toString.call(o) === "[object Function]" ? o : app.erph
        } catch (e) {
            io.c = app.erph
        }
        app.ia.push(io);
        app.eio()
    };
    app.ic = function (a) {
        app.userInfo.userId = a.uId;
        if (app.ia.length >= 0) {
            app.ia.shift().c();
            app.eioq()
        }
    };
    app.eio = function () {
        if (app.ia.length != 1) {
            return
        }
        app.eioq()
    };
    app.eioq = function () {
        if (app.ia.length <= 0) {
            return
        }
        try {
            var io = app.ia[0];
            if (app.android) {
                mmClient.initialize();
                setTimeout(function () {
                    if (app.acv(app.ia, io)) {
                        app.ic({uId: null})
                    }
                }, 500)
            }
        } catch (i) {
            app.ia.shift();
            app.eioq()
        }
    };
    app.userInfo = {"userId": null};
    app.setUserId = function (userId) {
        app.ic({uId: userId})
    };
    app.isLogin = function () {
        return app.userInfo.userId !== null && app.userInfo.userId !== ""
    };
    app.getUserId = function () {
        return app.userInfo.userId
    };
    app.isApp = function () {
        try {
            mmClient.isApp();
            return true
        } catch (a) {
            return false
        }
    };
    app.joinPlatform = function () {
        app.a(0)
    };
    app.joinBdt = function () {
        app.a(1)
    };
    app.shop = function (b) {
        app.a(2, b)
    };
    app.goods = function (b) {
        app.a(3, b)
    };
    app.activity = function (b) {
        app.a(4, b)
    };
    app.topic = function (b) {
        app.a(5, b)
    };
    app.post = function (b) {
        app.a(6, b)
    };
    app.closeWindow = function () {
        app.a(7)
    };
    app.shareMe = function () {
        app.a(8)
    };
    app.coupon = function () {
        app.a(9)
    };
    app.baodou = function () {
        app.a(10)
    };
    app.order = function () {
        app.a(11)
    };
    app.voucher = function () {
        app.a(12)
    };
    app.collect = function () {
        app.a(13)
    };
    app.a = function (d, c) {
        try {
            switch (d) {
                case 0:
                    mmClient.joinPlatform();
                    break;
                case 1:
                    mmClient.joinBdt();
                    break;
                case 2:
                    mmClient.shop(c);
                    break;
                case 3:
                    mmClient.goods(c);
                    break;
                case 4:
                    mmClient.activity(c);
                    break;
                case 5:
                    mmClient.topic(c);
                    break;
                case 6:
                    mmClient.post(c);
                    break;
                case 7:
                    mmClient.closeWindow();
                    break;
                case 8:
                    mmClient.shareMe();
                    break;
                case 9:
                    mmClient.coupon();
                    break;
                case 10:
                    mmClient.baodou();
                    break;
                case 11:
                    mmClient.order();
                    break;
                case 12:
                    mmClient.voucher();
                    break;
                case 13:
                    mmClient.collect();
                    break
            }
        } catch (f) {
            app.er()
        }
    };
    app.la = new Array();
    app.login = function (s, e) {
        var lo = new Object();
        lo.s = Object.prototype.toString.call(s) === "[object Function]" ? s : app.cph;
        lo.e = Object.prototype.toString.call(e) === "[object Function]" ? e : app.erph;
        app.la.push(lo);
        app.elo()
    };
    app.lc = function (a) {
        if ("0" == a) {
            app.la.shift().e()
        } else {
            if ("1" == a) {
                app.ic(app.erph);
                app.la.shift().s()
            }
        }
        app.eloq()
    };
    app.elo = function () {
        if (app.la.length != 1) {
            return
        }
        app.eloq()
    };
    app.eloq = function () {
        if (app.la.length <= 0) {
            return
        }
        try {
            var lo = app.la[0];
            mmClient.login()
        } catch (g) {
            app.er();
            app.la.shift();
            app.eloq()
        }
    };
    app.aa = new Array();
    app.selectAddress = function (s, e) {
        var ao = new Object();
        ao.s = Object.prototype.toString.call(s) === "[object Function]" ? s : app.cph;
        ao.e = Object.prototype.toString.call(e) === "[object Function]" ? e : app.erph;
        app.aa.push(ao);
        app.eao()
    };
    app.sac = function (a) {
        if ("error" == a) {
            app.aa.shift().e()
        } else {
            app.aa.shift().s(a)
        }
        app.eaoq()
    };
    app.eao = function () {
        if (app.aa.length != 1) {
            return
        }
        app.eaoq()
    };
    app.eaoq = function () {
        if (app.aa.length <= 0) {
            return
        }
        try {
            var ao = app.aa[0];
            mmClient.selectAddress()
        } catch (g) {
            app.er();
            app.aa.shift();
            app.eaoq()
        }
    };
    app.ra = new Array();
    app.request = function (o) {
        var ro = new Object();
        ro.p = o.path;
        ro.m = o.method || "GET";
        ro.c = Object.prototype.toString.call(o.callback) === "[object Function]" ? o.callback : app.cph;
        ro.j = Object.prototype.toString.call(o.data) === "[object Object]" ? JSON.stringify(o.data) : "{}";
        ro.h = Object.prototype.toString.call(o.headers) === "[object Object]" ? JSON.stringify(o.headers) : "{}";
        app.ra.push(ro);
        app.ero()
    };
    app.rc = function (a) {
        app.ra.shift().c(a);
        app.eroq()
    };
    app.ero = function () {
        if (app.ra.length != 1) {
            return
        }
        app.eroq()
    };
    app.eroq = function () {
        if (app.ra.length <= 0) {
            return
        }
        try {
            var ro = app.ra[0];
            mmClient.request(ro.p, ro.m, ro.h, ro.j)
        } catch (g) {
            app.er();
            app.ra.shift();
            app.eroq()
        }
    };
    app.acv = function (a, io) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] == io) {
                return true
            }
        }
        return false
    };
    app.er = function () {
        if (app.isApp()) {
            alert("版本过旧，请升级App后使用")
        } else {
            alert("请在妈妈去哪儿App中打开该网页")
        }
    };
    app.erph = function () {
    };
    app.cph = function (a) {
    };
    app.ua = window.navigator.userAgent;
    app.ios = app.ua == null ? false : !!app.ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    app.android = app.ua == null ? false : app.ua.indexOf("Android") > -1;
    window.app = app
}(window));