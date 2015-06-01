/**
 * 显示模块
 * @param node|nodeArray 略过节点
        支持节点或者节点数组
 */
CJS.Import( 'css.isShow' );
CJS.register( 'css.show', function ( $ ) {
    var $f = $.FUNCS,
        $l = $.logic;
    return function ( nodes, skipNode ) {
        var show = function ( n ) {
            // 对当前节点做浅度显示检测，避免重复设置
            if( !$l.css.isShow( n ) ) {
                n.style.display = 'block';
                // n.style.visibility = 'visible';
            }
        };
        if ( $f.isNode( nodes ) ) {
            show(nodes);
        }
        else if ( $f.isArray( nodes ) ) {
            for ( var i = 0, nL = nodes.length; i < nL; i++ ) {
                if ( skipNode && skipNode == nodes[i] ) continue;
                show( nodes[i] );
            }
        }
        return nodes;
    };
});