/**
 * 移除节点
 */
CJS.register( 'dom.removeNode', function ( $ ) {
	var $f = $.FUNCS;
	return function ( node ) {
		if ( !$f.isNode( node ) ) {
			throw '[dom.removeNode]: ' + $f.NODESTRING;
		}
		node.parentNode.removeChild( node );
	};
} );