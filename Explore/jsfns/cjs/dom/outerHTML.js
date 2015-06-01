/**
 * 同innerHTML，获取带当前节点的html字符串
 * @param 带获取的节点
 * @return html字符串
 */
CJS.register( 'dom.outerHTML', function ( $ ) {
	var $f = $.FUNCS;
	return function ( node ) {
		if ( !$f.isNode( node ) ) {
			throw '[dom.outerHTML]: ' + $f.NODESTRING;
		}
		var range,
			box = document.createElement( 'div' );
		if ( typeof node.outerHTML != 'undefined' ) {
			return node.outerHTML;
		}
		else if( node.cloneNode ){
			box.appendChild( node.cloneNode() );
			return box.innerHTML;
		}
		else if ( document.createRange ) {
			range = document.createRange();
			range.setStartBefore( node );
			range.setEndAfter( node );
			box.appendChild( range.cloneContents() );
			return box.innerHTML;
		}
	};
});