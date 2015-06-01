/**
 * 浏览器相关信息
 * @return object
 */
CJS.register( 'nav.browser', function ( $ ) {
    var $f = $.FUNCS,
        $l = $.logic;
    var uAgent      = navigator.userAgent,
        platform    = navigator.platform,
        lang        = navigator.language || navigator.userLanguage,
        version     = navigator.appVersion,
        plugins     = navigator.plugins,
        online      = navigator.onLine,
        cookie      = navigator.cookieEnabled;

    var regs = {
        'IE6_10'    : /MSIE\s+([0-9\.]+)/i,
        'IE11'      : /rv\s*\:\s*([0-9\.]+)/i,
        'Firefox'   : /Firefox\s*\/\s*([0-9\.]+)/i,
        'Chrome'    : /Chrome\s*\/\s*([0-9\.]+)/i,
        'Safari'    : /Version\/([0-9\.]+).*Safari/i,
        'Opera'     : /Opera|OPR\/?\s*([0-9\.]+)/
    }

    var main = {
        'IE'        : false,
        'Firefox'   : false,
        'Chrome'    : false,
        'Safari'    : false,
        'Opera'     : false
    };

    // 判断浏览器类型及其版本信息
    var which = function () {
        var list = [ 'IE6_10', 'IE11', 'Opera', 'Firefox', 'Safari', 'Chrome' ];
        for ( var i = 0, lL = list.length; i < lL; i++ ) {
            var nameStr = list[i];
            var item    = regs[nameStr];
            var filterArr = uAgent.match( item );
            if ( filterArr ) {
                // 版本
                var v = filterArr[1];
                if ( nameStr == 'IE6_10' ) {
                    main.IE = v;
                }
                else if ( nameStr == 'IE11' ) {
                    if ( uAgent.match( /\.NET/ ) ) {
                        main.IE = v;
                    }
                    else {
                        continue;
                    }
                }
                else {
                    main[nameStr] = v;
                }
                break;
            }
        }
    };
    which();
    main.cookie = cookie;
    main.lang = lang;
    main.plugins = plugins;
    main.platform = platform;
    main.onLine = online;
    return main;
});