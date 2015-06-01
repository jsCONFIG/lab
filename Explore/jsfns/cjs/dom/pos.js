CJS.Import( 'css.base' )
CJS.register( 'dom.pos', function ( $ ) {
    var $CSS = $.logic.css.base;
    // 获取单个节点内容距离父节点的距离
    var getPosAdd = function ( node ) {
        var l = node.offsetLeft,
            t = node.offsetTop;
        return {
            'l': parseInt(l),
            't': parseInt(t)
        };
    };
    return function ( node ) {
        var pos = {
            'l': 0,
            't': 0
        };
        var currentNode = node;
        return getPosAdd(node);
    };
} )