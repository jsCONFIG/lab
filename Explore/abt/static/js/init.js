/**
 * 入口方法
 * @return {[type]} [description]
 */
~function () {
    var module = $M.define( 'init' );
    module.require( 'menu/init' );
    module.require( 'settings/init' );
    module.require( 'dom/ndManage' );
    module.require( 'evt/cust' );

    var ms = $M.modules,
        $T = $M.tools;

    // 全局状态
    window.state = {};

    module.build( 'init', function () {
        var nd = $( document.body );
        var plugins = {}, nodes;

        // 节点管理
        var ndManage = ms.dom.ndManage.me,
            evtCust = $M.modules.evt.cust.me;

        var keyFns = {
            'choose' : function () {
                evtCust.trigger( plugins[ 'settings' ], 'list' );
            },

            'cancel' : function () {
                evtCust.trigger( plugins[ 'settings' ], 'offlist' );
            }
        };

        var handler = {
            'onChoose' : function ( e ) {
                plugins[ 'rightMenu' ].menu.hide();
                var el = $( e.target );

                if( !$.contains( nodes.editor[0], el[0] ) || $.contains( plugins['rightMenu'].menu[0], el[0] ) ) {
                    ndManage.delCurrent();
                    keyFns.cancel();
                    return;
                }

                if( ndManage.hasCurrent( el ) ) {
                    ndManage.delCurrent( el );
                    keyFns.cancel();
                    return;
                }

                // 多选则追加，否则完整替换
                if( state.multChoose ) {
                    ndManage.addToCurrent( el );
                }
                else {
                    ndManage.setCurrent( el );
                }

                keyFns.choose();
            },

            'onKeyDown' : function ( e ) {
                var keyCode = e.keyCode;
                switch( keyCode ) {
                    case 17:
                        state.multChoose = true;
                        break;
                    default:
                        // 
                }
            },

            'onKeyUp' : function ( e ) {
                var keyCode = e.keyCode;
                switch( keyCode ) {
                    case 17:
                        state.multChoose = false;
                        break;
                    default:
                        // 
                }
            },

            // 右侧设置确认时的绑定方法，sData为相关的设置html数据
            'onSet' : function ( sData ) {
                switch( sData.type ) {
                    case 'insert':
                        var str = sData.data;
                        ndManage.insertToItem( $( str ), true );
                        break;
                    case 'editStyle':
                        ndManage.removeClassOfItem( /block\d+/g );
                        ndManage.addClassOfItem( 'block' + sData.data.val );
                        break;
                    default:
                        //
                }
            }
        };

        var domInit = function () {
            nodes = nd.build();
        };

        var pluginInit = function () {
            plugins[ 'rightMenu' ] = ms.menu.init.me( nodes.editor[0] );
            plugins[ 'settings' ] = ms.settings.init.me( nodes.editor[0], nodes.modEdit[0] );
        };

        var evtBind = function () {
            $(nodes.editor[0]).on( 'click', handler.onChoose );
            nd.on( 'keydown', handler.onKeyDown );
            nd.on( 'keyup', handler.onKeyUp );
            evtCust.on( plugins[ 'settings' ], 'set', handler.onSet );
        };

        var init = function () {
            domInit();
            pluginInit();
            evtBind();
        };

        init();
    });

    module.create();
}();