/**
 * 将某个占位符替换为对应的数据，占位符的格式为#{name}
 * @param 待处理字符串 数据对象
 * @return 处理之后的字符串
 */
CJS.register( 'str.replace', function ( $ ) {
	var $f = $.FUNCS;
	return function ( str, data ) {
		if ( !$f.isWhat( str, 'string' ) ) {
			throw '[str.replace]: need string as first parameter!';
		}
		var reg = /\#\{([a-zA-Z\_\-0-9]+)\}/g;
		return str.replace( reg, function (){return data[arguments[1]] || arguments[0]} );
	};
});
