/**
 * 节点克隆，将进行，将去除所有克隆节点的ID，保证合法性
 * @param 待克隆节点
 * @return 克隆后被处理过的节点
 */
CJS.register( 'dom.cloneNode', function ( $ ) {
	$f = $.FUNCS;
	return function ( node ) {
		if ( !$f.isNode( node ) ) {
			throw '[dom.cloneNode]: ' + $f.NODESTRING;
		}
		var range = document.createRange(),
			fragment,		// 片段
			tempStr,		// 字符串形式
			box,			// 暂存的节点盒子
			reg;			// 正则
		reg = /(\<[a-zA-Z]+)((\s*[a-zA-Z&^(id)]+\=[\"\'][^\s&^\>]+[\"\'])*)\sid\=[\"\'][A-Za-z\_]+[\"\']/gi;
		range.setStartBefore( node );
		range.setEndAfter( node );
		fragment = range.cloneContents();
		box = document.createElement('div');
		box.appendChild( fragment );
		// clear ID
		tempStr = box.innerHTML;
		box.innerHTML = tempStr.replace( reg, '$1$2' );
		return box.childNodes[0];
	};
} );