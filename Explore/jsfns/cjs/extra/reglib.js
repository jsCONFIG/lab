/**
 * 常用正则表达式库
 * @return 字符串，便于添加g, i参数
 */
CJS.register( 'extra.reglib', function ( $ ) {
	return {
		// 数字
		'number' 	: "^[0-9]+$",
		// 单词
		'word'		: "^[a-zA-Z]+$",
		// 由单词或数字组成的
		'numOrWord'	: "^[0-9a-zA-Z]$",
		// 中文
		'chinese'	: "[\\u4e00-\\u9fa5]",
		// 双字节
		'dbByte'	: "[^x00-xff]",
		// 首尾空格
		'hfspace'	: "^\\s*|\\s*$",
		// url，键值位置对应： 'href':[0], 'protocol':[2], 'host':[4], 'port':[6], 'path':[7], 'param':[8], 'query':[9], 'hash':[11]
		'url'		: "^(([a-zA-Z]+):)?(\\\/{2,})?([^\\\/&^\\:]+)(:([0-9]*))?(\\\/[^\\?]*)?(\\?([^\\#]*)(\\#(.*))?)?$",
		'email'		: "^[\\_a-zA-Z]+[\\_a-zA-Z]*@[^\\s&^\\.]+(\\.[^\\s&^\\.]+)+$"
	};
});