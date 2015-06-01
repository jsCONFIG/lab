/**
 * 解析url地址，返回包含url相关数据的对象
 * @param url字符串，可选，无此参数时，将取当前页面所在地址进行解析
 */
CJS.Import( 'extra.reglib' );
CJS.register( 'extra.parseUrl', function ( $ ) {
	var $f = $.FUNCS;
	return function ( urlStr ) {
		if ( !urlStr ) {
			urlStr = window.location.href;
		}
		if ( $f.isWhat( urlStr, 'string' ) ) {
			var matchStr = urlStr.match( new RegExp( $.logic.extra.reglib.url, 'i' ) );
			if ( matchStr ) {
				return {
					'url'		: matchStr[0],
					'protocol'	: matchStr[2],
					'slash'		: matchStr[3],
					'host'		: matchStr[4],
					'port'		: matchStr[6],
					'path'		: matchStr[7],
					'param'		: matchStr[8],
					'query'		: matchStr[9],
					'hash'		: matchStr[11]
				}
			}	
		}
	};
});