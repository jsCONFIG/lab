/**
 * 菜单模板
 */
~function () {
    var module = $M.define( 'menu/menuList' );

    var TEMP = {
        'menu' : '<div class="maskMenu" style="display:none;"><ul class="menuList">#{list}</ul></div>',
        'item' : '' +
            '<li class="menuItem">' + 
                '<a data-act="menuItem" act-data="#{data}" href="javascript:void(0);">#{name}</a>' +
            '</li>'
    };

    var $T = $M.tools;
    module.build( 'init', function () {
        var Class_list = function ( list, container ) {
            var self = this;

            var _init = function () {
                var listStr = '',
                    str = '';
                
                for( var i in list ) {
                    if( list.hasOwnProperty( i ) ) {
                        listStr += $T.strReplace( TEMP.item, list[i] );
                    }
                }

                str = $T.strReplace( TEMP.menu, {
                    'list' : listStr
                } );

                var nd = $( str );
                nd.appendTo( container );

                return nd;
            };

            self.menu = _init();
        };

        return Class_list;
    });

    module.create();
}();