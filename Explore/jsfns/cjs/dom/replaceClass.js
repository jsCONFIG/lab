/**
 * 用classA替换classB
 * @return node
 */
CJS.Import( 'dom.getClassList' );
CJS.register( 'dom.replaceClass', function ( $ ) {
	var $f = $.FUNCS;
	return function ( node, classA, classB) {
		if ( !$f.isNode( node ) ) {
			throw '[dom.replaceClass]: need node as first parameter!';
		}
		var classList = $.logic.dom.getClassList( node );
		classList.remove( classB );
		classList.add( classA );
		return node;
	};
} );