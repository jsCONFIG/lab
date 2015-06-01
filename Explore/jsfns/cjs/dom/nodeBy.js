/**
 * 用于向上级节点查找，从当前节点开始查找，直到找到符合条件的节点或者查找到边界
 * @param Node, func[, boundary ]
        当前节点，判断方法，边界节点（默认为body）
 * @return Node
 */
CJS.register( 'dom.nodeBy', function ( $ ) {
    var $f = $.FUNCS,
        $l = $.logic;
    return function ( node, func, boundary ) {
        if ( !$f.isNode( node ) ) {
            throw '[dom.nodeBy]: ' + $f.NODESTRING;
        }
        var currentNode = node,
            toNode      = boundary || node.ownerDocument.body;

        // 包含关系检测
        if ( !$f.isContains( node, toNode ) ) {
            throw '[dom.nodeBy]: ' + 'illegal boundary!';
        }
        
        // 遍历查找
        while ( currentNode != toNode ) {
            if ( func(currentNode) ) {
                return currentNode;
            }
            else {
                currentNode = currentNode.parentNode;
            }
        }
        return null;     
    };
});