/**
 * 渐入渐隐操作对象
 */
CJS.Import( 'css.base' );
CJS.Import( 'ani.action' );
CJS.Import( 'extra.destroy' );
CJS.register( 'plugin.fadeInOut', function ( $ ) {
	var $f = $.FUNCS,
		$l = $.logic;
	return function ( node, conf ) {
		if ( !$f.isNode( node ) ) {
			throw '[plugin.fadeInOut]: ' + $f.NODESTRING;
		}
		// 参数设置初始化
		var config = $f.parseObj( {
			'aniType'	: 'uniform',		// 动画类型
			'inCbk'		: function () {},	// 渐入的回调
			'outCbk'	: function () {}	// 渐隐的回调
		}, conf );
		var aniObjIn, aniObjOut;
		return {
			'in': function ( param ) {
				var dis = $l.css.base( node, 'display' );
				node.style.display = 'block';
				if ( typeof param == 'number' ) {
					( dis == 'none' ) && $l.css.base( node, { 'opacity': 0 } );
					aniObjIn = $l.ani.action( node, {
						'callback' 	: config.inCbk,
						'time'		: param,
						'type'		: config.aniType
					} );
					aniObjIn.play( { 'opacity': 1 } );
				}
			},
			'out': function ( param ) {
				if ( typeof param == 'number' ) {
					aniObjOut = $l.ani.action( node, {
						'callback'	: config.outCbk,
						'time'		: param,
						'type'		: config.aniType
					});
					aniObjOut.play( { 'opacity': 0 } );
				}
				else {
					node.style.display = 'none';
				}
			},
			'destroy': function () {
				$l.extra.destroy( aniObjIn, aniObjOut );
			}
		};
	};
});