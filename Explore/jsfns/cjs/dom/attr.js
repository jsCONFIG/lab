/**
 * 节点属性设置，无val时为获取相关属性，有val时为设置相关属性
 * @param 节点 属性名称 (待设置属性值，可选)
 */
CJS.register( 'dom.attr', function ( $ ) {
	$f = $.FUNCS;
	return function ( node, attr, val ) {
		if ( !$.isNode( node ) ) {
			throw '[dom.attr]: ' + $f.NODESTRING;
		}
		if ( val ) {
			node.setAttribute( attr, val );
		}
		else {
			return node.getAttribute( attr );
		}
	};
} );