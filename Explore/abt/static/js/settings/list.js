/**
 * 生成设置列表的模块
 */
$( function () {
    var module = $M.define( 'settings/list' );
    module.require( 'settings/listconf' );

    var $T = $M.tools;

    var TEMP = {
        'ITEM' : {
            // 单个编辑组{'li' : 'xx'}
            'BOX' : '<ul class="list-ul">#{li}</ul>',
            // 某个组内的编辑块{'select' : 'xxx'}
            'LI'  : '<li class="list-li" data-type="#{type}">#{select}</li>',

            // 具体编辑项{'title' : '修改', 'name' : '样式', 'options' : 'xxx', 'act' : 'sureStyle' }
            'SELECT' : ['',
                    '<h3 class="title">#{title}</h3>',
                    '<label>',
                        '#{name} ',
                        '#{selectitem}',
                    '</label>',
                    '<div class="group-extra">#{extra}</div>',
                    '<div class="btn-group tar">',
                        '<button data-act="#{act}">确认</button>',
                    '</div>'].join(''),

            'SELECTITEM' : ['<select name="item" data-act="select">',
                            '#{options}',
                        '</select>'].join(''),

            // 编辑中的选项
            'OPTION' : '<option value="#{val}">#{txt}</option>'
        }
    };

    // [
    // {
    //   'gname' : 'groupName',
    //   'gdata' : [{
    //      'title' : 'xx',
    //      'name'  : 'xxx',
    //      'options' : { 'key1' : 'val1', 'key2' : 'val2' },
    //      'act'   : 'sureStyle'
    //    }]
    // }
    // ]
    var createList = function ( dataArr ) {
        var str = '';
        for( var i = 0, dL = dataArr.length; i < dL; i++ ) {
            str += createGroup( dataArr[ i ]['gdata'] );
        }

        str = $T.strReplace( TEMP.ITEM.BOX, { 'li' : str } );
        return str;
    };

    // 创建组
    var createGroup = function ( gData ) {
        var str = '';
        for( var i = 0, gdL = gData.length; i < gdL; i++ ) {
            str += $T.strReplace( TEMP.ITEM.LI, {
                'type'      : gData[i]['type'],
                'select'    : createBlock( gData[ i ] )
            });
        }

        return str;
    };

    // 创建块
    //   {
    //      'title' : 'xx',
    //      'name'  : 'xxx',
    //      'options' : { 'key1' : 'val1', 'key2' : 'val2' },
    //      'act'   : 'sureStyle'
    //    }
    var createBlock = function ( bData ) {
        var str = '', optionStr = '';
        // 存在options的情况下构建
        var bDOpts = bData.options;
        if( bDOpts ) {
            for( var i in bDOpts ) {
                if( bDOpts.hasOwnProperty( i ) ) {
                    optionStr += $T.strReplace( TEMP.ITEM.OPTION, bDOpts[ i ] );
                }
            }
            optionStr = $T.strReplace( TEMP.ITEM.SELECTITEM, { 'options' : optionStr } );
        }

        bData.selectitem = optionStr;

        // 初始构造时，默认使用第一个extra
        bData.extra = ( bData.options && bData.options[0] ) ? (bData.options[0].extra || '') : '';
        
        str = $T.strReplace( TEMP.ITEM.SELECT, bData );

        return str;
    };

    module.build( 'init', function () {
        var listcf = $M.modules.settings.listconf.me,
            that = {};

        that.menu = function () {
            var str = '',
                data = [
                    {
                        'gname' : 'normal',
                        'gdata' : [
                            listcf.insert,
                            listcf.editStyle
                        ]
                    }
                ];
            str = createList( data );
            return str;
        };

        // 获取额外数据, type-大类型， sVal-select的值
        that.getExtra = function ( type, sVal ) {
            var str = '';
            var ops;
            if( listcf.hasOwnProperty( type ) && ( ops = listcf[ type ].options ) ) {
                $( ops ).each( function ( index, item ) {
                    if( item.val == sVal ) {
                        str = item.extra || '';
                        return false;
                    }
                });
            }

            return str;
        };

        return that;
    });

    module.create();
});