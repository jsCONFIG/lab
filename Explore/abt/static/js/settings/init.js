/**
 * 右侧针对某个条目的设置
 */
$( function () {
    var module = $M.define( 'settings/init' );
    module.require( 'dom/builder' );
    module.require( 'dom/createBData' );
    module.require( 'settings/list' );
    module.require( 'evt/cust' );

    module.build( 'init', function () {
        var list = $M.modules.settings.list.me,
            dBuild = $M.modules.dom.builder.me,
            createBData = $M.modules.dom.createBData.me,
            evtCust = $M.modules.evt.cust.me;

        return function ( container, sContainner, conf ) {
            var that = {};

            that.menu = function () {
                var str = list.menu();
                $(sContainner).html( str );
            };

            var handler = {
                // 点击设置的确认按钮
                'sure' : function ( e ) {
                    var el = $( e.currentTarget ),
                        myMod = el.closest( '[data-type]' ),
                        extraNd = myMod.find( '.group-extra' );

                    switch( myMod.attr( 'data-type' ) ) {
                        case 'insert':
                            var data = myMod.parseHtml();
                            var type = data.item.replace( /^[^\-]+\-(.+)$/, "$1" ).toUpperCase();

                            // 获取构造数据
                            var bData = createBData( type, extraNd.parseHtml() );

                            evtCust.trigger( that, 'set', {
                                'type' : 'insert',
                                'data' : dBuild( type, bData )
                            } );
                            break;

                        case 'editStyle':
                            var data = myMod.parseHtml();
                            var type = data.item.replace( /^[^\-]+\-(.+)$/, "$1" ).toUpperCase();

                            evtCust.trigger( that, 'set', {
                                'type' : 'editStyle',
                                'data' : extraNd.parseHtml()
                            });
                            break;

                        default:
                            //
                    }
                },

                'onSelect' : function ( e ) {
                    var el = $( e.currentTarget ),
                        myMod = el.closest( '[data-type]' ),
                        modType = myMod.attr( 'data-type' ),
                        val = el.val();

                    switch( myMod.attr( 'data-type' ) ) {
                        case 'insert':
                            var data = myMod.parseHtml();
                            var type = data.item.replace( /^[^\-]+\-(.+)$/, "$1" ).toLowerCase();
                            var str = list.getExtra( modType, val );
                            myMod.find( '.group-extra' ).html( str );
                            break;

                        case 'editStyle':
                            break;

                        default:
                            //
                    }
                }
            };

            // 绑定确认事件
            $( sContainner ).delegate( '[data-act=sureSet]', 'click', handler.sure );
            // 绑定select事件，此处用click实现onchange的功能
            $( sContainner ).delegate( '[data-act=select]', 'click', handler.onSelect );

            // 绑定eidt的list事件，展现配置菜单
            evtCust.on( that, 'list', function () {
                that.menu();
            } );

            evtCust.on( that, 'offlist', function () {
                $(sContainner).html( '' );
            } );

            return that;
        };
    });

    module.create();
});