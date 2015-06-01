CJS.Import( 'css.base' );
CJS.Import( 'evt.event' );
CJS.Import( 'evt.getEvt' );
CJS.Import( 'dom.pos' );
CJS.register( 'plugin.jsScrollBar', function ( $ ) {
    var $f      = $.FUNCS,
        $l      = $.logic
        $css    = $l.css.base,
        $evt    = $l.evt.event;
    return function ( conf ) {
        var config = $f.parseObj( {
            'scrollBar'     : undefined,            // scrollBar节点
            'content'       : undefined,            // 待控制的实际内容节点
            'barBox'        : undefined,            // 装载bar的盒子节点
            'contentBox'    : undefined,            // 装载实际内容的盒子节点
            'alwaysShowBar' : false,                // 是否总是展示bar
            'hoverBuffer'   : 1000,                 // 鼠标放上多久后显示bar节点，仅在不总是展示bar的情况下
            'moveStart'     : function(){},    // 开始移动回调方法
            'moveEnd'       : function(){},    // 移动结束回调方法
            'moving'        : function(){},    // 移动中回调方法
            'style'         : 'marginTop'           // 检测的样式
        }, conf || {} );

        // 参数检测
        var checkParam = function () {
            var mainKey = !$f.isNode( config.scrollBar ) || !$f.isNode( config.content ),
                otherKey = !$f.isNode( config.barBox ) || !$f.isNode( config.contentBox );
            if (  mainKey || otherKey ) {
                throw '[plugin.jsScrollBar]: something error in your parameter!';
            }
        };

        var contentBoxL = 0, barBoxL = 0, contentL = 0, barL = 0, clickPos,that={};
        var isWorH = ( new RegExp( '.*(top)|(bottom).*', 'i' ) ).test( config.style ) ? 'height' : 'width';

        var FUNC = {
            'getPos': function ( el ) {
                return parseFloat( $css( el, config.style ) );
            },
            'setPos': function ( el, pos ) {
                var tempCss = {};
                tempCss[config.style] = pos + 'px';
                $css( el, tempCss );
            },
            'freshWH': function () {
                contentBoxL = parseFloat( $css( config.contentBox, isWorH ) );
                barBoxL = parseFloat( $css( config.barBox, isWorH ) );
                contentL = parseFloat( $css( config.content, isWorH ) );
                barL = parseFloat( $css( config.scrollBar, isWorH ) );
            },
            'setBarWH': function () {
                var winWH = $l.extra.winSize();
                FUNC.freshWH();
                var result = ( barBoxL * contentBoxL / contentL );
                var tempCss = {};
                tempCss[ isWorH ] = result + 'px';
                $css( config.scrollBar, tempCss );
                return result;
            },
            // 滚动条位置改变导致内容位置的改变
            'barToBox': function () {
                var barPos = FUNC.getPos( config.scrollBar );
                FUNC.freshWH();
                var barPercent = barPos / barBoxL,
                    contentPos = contentL * barPercent;
                if ( ( contentL - contentPos ) < contentBoxL || contentPos < 0 ) {
                    return;
                }
                // 内容位置的设置始终使用的是小于等于0的值
                FUNC.setPos( config.content, -contentPos );
            }
        };

        var PLUGIN = {
            'drag': function ( evt ) {
                var barBoxPos = $l.dom.pos( config.barBox ),
                    lOrT = ( isWorH == 'width' ? 'l' : 't' ),
                    xOrY = ( isWorH == 'width' ? 'x' : 'y' );
                var endPos = evt[ xOrY ] - barBoxPos[ lOrT ] - clickPos;
                if ( endPos < 0 || endPos > ( barBoxL - barL ) ) {
                    return;
                }
                // 滚动条的位置设置始终使用的是正值
                FUNC.setPos( config.scrollBar, endPos );
            }
        };

        var ACTION = {
            'start': function ( evt ) {
                config.moveStart( config );
                clickPos = Math.abs( ( isWorH == 'width' ? evt.x : evt.y ) - FUNC.getPos( config.scrollBar ) );
                $evt.addEvt( document.body, 'mousemove', ACTION.moving );
                $evt.addEvt( document.body, 'mouseup', ACTION.end );
            },
            'moving': function ( e ) {
                var evt = $l.evt.getEvt( e );
                PLUGIN.drag( evt );
                FUNC.barToBox();
                config.moving( config );
            },
            'end': function () {
                config.moveEnd( config );
                $evt.removeEvt( document.body, 'mousemove', ACTION.moving );
                $evt.removeEvt( document.body, 'mouseup', ACTION.end );
            }
        };

        var evtBind = function () {
            $evt.addEvt( config.scrollBar, 'mousedown', ACTION.start );
        };

        var init = function () {
            checkParam();
            evtBind();
        };
        init();

        that.destroy = function () {
            $evt.removeEvt( config.scrollBar, 'mousedown', ACTION.start );
            $evt.removeEvt( document.body, 'mousemove', ACTION.moving );
            $evt.removeEvt( document.body, 'mouseup', ACTION.end ); 
        };
        return that;
    };
} )