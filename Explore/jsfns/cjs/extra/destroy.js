/**
 * 销毁方法，支持多参数写法，数组集合写法
 */
CJS.register( 'extra.destroy', function ( $ ) {
	return function () {
		var argu = arguments, obj, arguL = argu.length;
		var destroy = function ( handle ) {
			handle && handle.destroy && handle.destroy();
		};
		for ( var i = 0; i < arguL; i++ ) {
			if ( $f.isWhat( argu[i], 'array' ) ) {
				for ( var j in argu[i] ) {
					destroy( argu[i][j] );
				}
			}
			else {
				destroy( argu[i] );
			}
		}
	};
});