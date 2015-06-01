/**
 * 对节点建模
 * @param node attr
        CJS.logic.dom.modeling( document.body, 'node-type' );
 * @return nodeObject
 */
CJS.Import( 'dom.get' );
CJS.register( 'dom.nodeMap', function ( $ ) {
    var $f = $.FUNCS,
        $l = $.logic;
    return function ( node, attr ) {
        if ( !$f.isNode( node ) ) {
            throw '[dom.nodeMap]: ' + $f.NODESTRING;
        }
        var attrStr = attr || 'node-type';
        // 获取所有具有该属性的节点
        var nodeList = $l.dom.get( '[' + attrStr + '=*]', node );
        var result = {};
        for ( var i = 0, nL = nodeList.length; i < nL; i++ ) {
            var tempAttrName = nodeList[ i ].getAttribute( attrStr );
            if ( result.hasOwnProperty( tempAttrName ) ){
                result[ tempAttrName ].push( nodeList[ i ] );
            }
            else {
                result[ tempAttrName ] = [ nodeList[i] ];
            }
        }
        return result;
    };
});