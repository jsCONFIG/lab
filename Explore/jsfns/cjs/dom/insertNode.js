/**
 * 在节点的某个位置插入节点
 * @param 待插入节点 依据的节点 插入位置：beforebegin, afterbegin, beforeend, afterend
 * @return 插入的节点
 */
CJS.register( 'dom.insertNode', function ( $ ) {
	var $f = $.FUNCS;
	return function ( node, toNode, where ) {
		if ( !$.isNode( node ) || !$.isNode( toNode ) ) {
			throw '[dom.insertNode]: ' + $f.NODESTRING;
		}
		var where = where || 'beforeend';
		where = where.toLowerCase();
		if ( toNode.insertAdjacentElement ) {
			switch ( where ) {
				case 'beforebegin':
					toNode.insertAdjacentElement( node, where );
					break;
				case 'afterbegin':
					toNode.insertAdjacentElement( node, where );
					break;
				case 'beforeend':
					toNode.insertAdjacentElement( node, where );
					break;
				case 'afterend':
					toNode.insertAdjacentElement( node, where );
					break;
				default:
					throw 'Illegal position of \'' + where + '\'';
			}
		}
		else {
			var range = toNode.ownerDocument.createRange(),
				key = null;
			switch ( position ) {
				case 'beforebegin':
					toNode.parentNode.insertBefore( node, toNode );
					break;
				case 'afterbegin':
					var toNodeChild = toNode.firstChild;
					if ( !toNodeChild ) {
						toNode.appendChild( node );
					}
					else {
						toNode.insertBefore( node, toNodeChild );
					}
					break;
				case 'beforeend':
					toNode.appendChild( node );
					break;
				case 'afterend':
					toNode.parentNode.insertBefore( node, toNode.nextSibling );
					break;
				default:
					throw 'Illegal position of \'' + pos + '\'';
			}
		}
		return node;
	};
});