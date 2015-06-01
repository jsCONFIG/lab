/**
 * 右键菜单管理
 */
~function () {
    var module = $M.define( 'menu/init' );

    module.require( 'menu/menuList' );
    module.require( 'dom/ndManage' );

    var menu = [
        {'name' : '插入', 'data' : 'type=insert'},
        {'name' : '插入至前', 'data' : 'type=insertBefore'},
        {'name' : '包裹', 'data' : 'type=wrap'},
        {'name' : '删除', 'data' : 'type=del'},
        {'name' : '左浮', 'data' : 'type=left'},
        {'name' : '右浮', 'data' : 'type=right'},
        {'name' : '取消', 'data' : 'type=cancel'},
    ];

    var ms = $M.modules;
    module.build( 'init', function () {
        return function( nd ) {
            nd = $( nd );
            var menuList,
                ndPos = nd.position(),
                ndManage = ms.dom.ndManage.me;

            var make = function ( type ){
                var current = ndManage.getCurrent();
                switch( type ) {
                    case 'insert' :
                        // 针对插入在全局舞台上的插入
                        if( !current ) {
                            current = nd;
                        }
                        current && ndManage.creatItemTo( current, true );
                        break;
                    case 'insertBefore' :
                        // 针对插入在全局舞台上的插入
                        if( !current ) {
                            current = nd;
                        }
                        current && ndManage.creatItemTo( current, true, 'prepend' );
                        break;
                    case 'wrap':
                        current && ndManage.wrapItem( current );
                        break;
                    case 'del' :
                        ndManage.removeItem();
                        break;
                    case 'left' :
                        current && ndManage.toLeft( current );
                        break;
                    case 'right' :
                        current && ndManage.toRight( current );
                        break;
                    case 'cancel':
                        break;
                    default:
                        // nothing
                }
                menuList.menu.hide();

            };

            var handler = {
                'onMenu' : function ( e ) {
                    e.preventDefault();
                    
                    var el = $( e.target );

                    // if( !state.multChoose ) {
                    //     ms.ndManage.me.setCurrent( el );
                    // }

                    var pos = {
                        'top' : e.offsetY,
                        'left': e.offsetX
                    };

                    menuList.menu.show().css( pos );

                },

                'onItem' : function ( e ) {
                    var el = $( e.currentTarget ),
                        data = el.actData();

                    make( data.type );
                }
            };

            var menuEvtBind = function ( menuNd ) {
                menuNd.delegate( '[data-act=menuItem]', 'click', handler.onItem );
            };

            var pluginInit = function () {
                menuList = new ms.menu.menuList.me( menu, nd );
                menuEvtBind( menuList.menu );
            };


            var evtBind = function () {
                nd.on( 'contextmenu', handler.onMenu );

            };

            var init = function () {
                pluginInit();
                evtBind();
            };

            init();

            return menuList;
        };
    });

    module.create();
}();