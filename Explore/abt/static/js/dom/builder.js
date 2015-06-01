/**
 * dom节点构造器
 */
$( function () {
    var module = $M.define( 'dom/builder');

    var $B = $M.tools;

    var DOMTEMP = {
        'LIST' : {
            'UL' : '<ul class="list-ul nobdItem">#{li}</ul>',
            'LI' : '<li class="list-li">#{txt}</li>'
        },

        'TITLE' : {
            'H1' : '<h1 class="nobdItem">#{txt}</h1>',
            'H2' : '<h2 class="nobdItem">#{txt}</h2>',
            'H3' : '<h3 class="nobdItem">#{txt}</h3>',
            'H4' : '<h4 class="nobdItem">#{txt}</h4>',
        }
    };

    // 节点创建器，返回构造之后的html字符串
    var domBuilder = function ( type, data ) {
        if( !type || !data ) {
            return '';
        }
        var str = '';
        type = type.toUpperCase();
        switch( type ) {
            /**
             * {
             *    'list' : [ { 'txt' : 'xxx' } ]
             * }
             */
            case 'LIST' :
                if( data.list && $B.isWhat( data.list, 'array') ) {
                    var tmpStr = '';
                    $( data.list ).each( function ( index, item ) {
                        tmpStr += $B.strReplace( DOMTEMP.LIST.LI, item );
                    });

                    str = $B.strReplace( DOMTEMP.LIST.UL, { 'li' : tmpStr } );
                }
                break;

            /**
             * {
             *     'title' : { 'type' : 'H1', 'txt' : 'xxx' }
             * }
             */
            case 'TITLE':
                if( data.title ) {
                    var tType  = data.title.type.toUpperCase();

                    if( DOMTEMP.TITLE.hasOwnProperty( tType ) ) {
                        str = $B.strReplace( DOMTEMP.TITLE[ tType ], data.title );
                    }
                }
                break;
            default:
                return '';
        }

        return str;
    };

    module.build( 'init', function () {
        return domBuilder;
    });

    module.create();
});