/**
 * 隐藏模块
 * @param node|nodeArray 略过节点
        支持节点或者节点数组
 */
CJS.Import( 'css.isShow' );
CJS.register( 'css.hide', function ( $ ) {
    var $f = $.FUNCS,
        $l = $.logic;
    return function ( nodes, skipNode ) {
        var hide = function ( n ) {
            // 做浅度检测，避免重复设置
            if ( $l.css.isShow( n) ) {
                n.style.display = 'none';
            }
        };
        if ( $f.isNode( nodes ) ) {
            hide(nodes);
        }
        else if ( $f.isArray( nodes ) ) {
            for ( var i = 0, nL = nodes.length; i < nL; i++ ) {
                if ( skipNode && skipNode == nodes[i] ) continue;
                hide( nodes[i] );
            }
        }
        return nodes;
    };
});