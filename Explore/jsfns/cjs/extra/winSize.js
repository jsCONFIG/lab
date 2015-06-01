/**
 * 用于获取窗口的当前宽度和高度，通过直接创建节点的方式获取
 * @param 
 * @return { 'w': 1280, 'h': 800 }
 */
CJS.Import( 'css.base' );
CJS.register( 'extra.winSize', function ( $ ) {
    var $f = $.FUNCS,
        $l = $.logic;
    return function ( root ) {
        var rootDoc = (root && root.ownerDocument) || document;
        var node = rootDoc.createElement( 'div' );
        $l.css.base( node, {
            'position'  : 'fixed!important',
            'z-index'   : -10000,
            'top'       : 0,
            'left'      : 0,
            'width'     : '100%!important',
            'height'    : '100%!important'
        });
        rootDoc.body.appendChild( node );
        var width  = $l.css.base( node, 'width' ),
            height = $l.css.base( node, 'height' );
        $f.removeNode( node );
        node = null;
        return {
            'w' : parseInt( width ),
            'h' : parseInt( height )
        };
    };
});