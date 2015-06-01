/**
 * 插入html
 * @param node htmlString , position
 		position: beforebegin afterbegin beforeend afterend
 * @return node片段
 */
CJS.register( 'dom.insertHTML', function ( $ ) {
	var $f = $.FUNCS;
	return function ( node, htmlStr, pos ) {
		if ( !$f.isNode( node ) ) {
			throw '[dom.insertHTML]: ' + $f.NODESTRING;
		}
		// 如果无有效字符则直接返回
		if ( !htmlStr ) {
			return;
		}
		var position = pos || 'beforeend';
		position = position.toLowerCase();
		if ( node.insertAdjacentHTML ) {
			switch ( position ) {
				case 'beforebegin':
					node.insertAdjacentHTML( pos, htmlStr );
					return node.previousSibling;
				case 'afterbegin':
					node.insertAdjacentHTML( pos, htmlStr );
					return node.firstChild;
				case 'beforeend':
					node.insertAdjacentHTML( pos, htmlStr );
					return node.lastChild;
				case 'afterend':
					node.insertAdjacentHTML( pos, htmlStr );
					return node.nextSibling;
				default:
					throw 'Illegal position of \'' + pos + '\'';
			}
		}
		else {
			var range = node.ownerDocument.createRange(),
				key = null;
			switch ( position ) {
				case 'beforebegin':
					// 设置范围起点
					range.setStartBefore( node );
					// 将html字符串转换为fragment片段，用于节点操作
					var fragment = range.createContextualFragment( htmlStr );
					node.parentNode.insertBefore( fragment, node );
					return node.previousSibling;
				case 'afterbegin':
					var nodeChild = node.firstChild;
					if ( !nodeChild ) {
						node.innerHTML = htmlStr;
					}
					else {
						range.setStartBefore( nodeChild );
						var fragment = range.createContextualFragment( htmlStr );
						node.insertBefore( fragment, nodeChild );
					}
					return node.firstChild;
				case 'beforeend':
					range.setStart( node );
					var fragment = range.createContextualFragment( htmlStr );
					node.appendChild( fragment );
					return node.lastChild;
				case 'afterend':
					range.setStartAfter( node );
					var fragment = range.createContextualFragment( htmlStr );
					node.parentNode.insertBefore( fragment, node.nextSibling );
					return node.nextSibling;
				default:
					throw 'Illegal position of \'' + pos + '\'';
			}
		}
		// var box = document.createElement( 'div' );
		// box.innerHTML = htmlStr;
	};
} );