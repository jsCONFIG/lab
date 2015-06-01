/**
 * 生成节点构造器需要的数据
 */
$( function () {
    var module = $M.define( 'dom/createBData');

    var $B = $M.tools;

    // 供参考的参数格式列表
    var CF = {
        'LIST' : { 'list' : [ { 'txt' : '条目' } ] },

        'TITLE' : {
            'title' : { 'type' : 'H1', 'txt' : 'xxx' }
        }
    };

    /**
     * @param  {[type]} type  类型
     * @param  {[type]} cData 用于配置的参数，约定num表示数目，type表示类型
     * @return {[type]}       [description]
     */
    var cfCreator = function ( type, cData ) {
        var data = {};
        cData = cData || {};

        switch( type ) {
            case 'LIST':
                // 默认三个
                var num = cData.num || 3;
                var tmpArr = [];
                for( var i = 0; i < num; i++ ) {
                    tmpArr.push( { 'txt' : '条目' + (i + 1) } );
                }
                data[ 'list' ] = tmpArr;

                break;
            case 'TITLE':
                var tType = cData.type || 'H1';
                data[ 'title' ] = {
                    'type' : tType,
                    'txt'  : '这是一个标题'
                };
                break;
            default:
                //
        }

        return data;
    };

    module.build( 'init', function () {
        return cfCreator;
    });

    module.create();
});