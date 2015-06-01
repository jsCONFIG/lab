/**
 * 查找节点，查找规则支持空格的层级关系，支持“>”的子节点查找
 * @param 
 * @return 
 */
CJS.Import( 'dom.get' );
CJS.register( 'dom.find', function ( $ ) {
    var $f = $.FUNCS,
        $l = $.logic;
    return function ( indexStr, upNode ) {
        if ( !$f.isWhat( indexStr, 'string' ) ) {
            throw '[dom.find]: need string as first parameter!'
        }
        // 清除首尾空格
        indexStr = $f.trim( indexStr );
        // 将多个空格替换成单个空格
        indexStr = indexStr.replace( /\s{2,}/g, ' ');
        var $get = $l.dom.get;

        // 获取第一个索引字符串
        var getFirstIndex = function ( str ) {
            return str.replace( /^([a-zA-Z\_0-9]+)[\>\s]*.*$/, '$1' );
        };

        // 获取第一个关系字符串
        var getFirstRelation = function ( str ) {
            return str.replace( /^[a-zA-Z\_0-9]+([\>\s]*).*$/, '$1' );
        };

        var currentStr = indexStr;
        var currentIndex = getFirstIndex( currentStr );
        
    };
});