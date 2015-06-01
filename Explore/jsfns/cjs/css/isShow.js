/**
 * 用于检测某个节点是显示还是隐藏
 * @param node isDeep
        待检测节点 是否深度检测(默认为否，即不考虑样式继承)
 * @return Boolean
 */
CJS.Import( 'css.base' );
CJS.Import( 'dom.nodeBy' );
CJS.register( 'css.isShow', function ( $ ) {
    var $f      = $.FUNCS,
        $l      = $.logic,
        $css    = $l.css.base,
        $nodeBy = $l.dom.nodeBy;

    return function ( node, isDeep ) {
        if ( !$f.isNode( node) ) {
            throw '[css.isShow]: ' + $f.NODESTRING;
        }
        var nodeDis = ( $css( node, 'display' ) == 'none' ),
            nodeVis = ( $css( node, 'visibility' ) == 'hidden' ),
            deep    = isDeep || false;

        // 检测当前节点设置是否显示，不追溯继承
        var isNodeShow = function ( theNode ) {
            return !( $css( theNode, 'display' ) == 'none' || $css( theNode, 'visibility' ) == 'hidden' );
        };
        if ( !deep ) {
            return isNodeShow( node );
        }
        if ( nodeDis || nodeVis ) {
            return false;
        }
        else{
            var hideNode = $nodeBy( node, function ( current ) {
                return !isNodeShow( current );
            });
            return !hideNode;
        }
    };
});