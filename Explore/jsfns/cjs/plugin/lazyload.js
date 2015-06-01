CJS.Import( 'dom.pos' );
CJS.Import( 'evt.event' );
CJS.register( 'plugin.lazyload', function ( $ ) {
    var $F      = $.FUNCS,
        $L      = $.logic,
        $pos    = $L.dom.pos;
    return function ( node, func, spec ) {
        var conf = $F.parseObj( {
            'buffer': 10,
            'dir'   : 'top',
            'step'  : 200,
            'root'  : document.body
        }, spec || {} );
        // 缓冲距离
        var bL = buffer || 0;
        var dir = conf.dir.toLowerCase();

        var isBusy = false,
            nodePos = 0,
            scrollPos = 0;

        // 获取节点位置
        var getNodePos = function () {
            if ( dir == 'top' ) {
                getNodePos = function () {
                    return $pos( node ).t;
                }
                return getNodePos();
            }
            else {
                getNodePos = function () {
                    return $pos( node ).l;
                };
                return getNodePos();
            }
        };

        // 获取滚动条位置
        var getScrollPos = function () {
            if ( dir == 'top' ) {
                getScrollPos = function () {
                    return conf.root.scrollTop;
                }
                return getScrollPos();
            }
            else {
                getScrollPos = function () {
                    return conf.root.scrollLeft;
                };
                return getScrollPos();
            }
        };

        // 实际绑定scroll事件的方法，用于防止过度动荡
        var scrollBuffer = function () {
            if ( !isBusy ) {
                isBusy = true;
                setTimeout( function () {
                    nodePos     = getNodePos();
                    scrollPos   = getScrollPos();
                    if ( Math.abs( nodePos - scrollPos ) <= conf.buffer ) {
                        func( node, {
                            'nodePos'   : nodePos,
                            'scrollPos' : scrollPos
                        });
                    }
                    isBusy      = false;
                }, conf.step );
            }
        };

        var evtBind = function () {
            $L.evt.event.addEvt( node, 'scroll', scrollBuffer );
        };

        var init = function () {
            evtBind();
        };
        init();

        var that = {};
        that.destroy = function () {
            $L.evt.event.removeEvt( node, 'scroll', scrollBuffer );
        };
        return that;
    };
});