/**
 * 替换某个节点
 * @param 用来替换的新节点(|新节点的html内容) 当前节点
 * @return 替换的新的节点 
 */
CJS.Import( 'dom.insertHTML' );
CJS.Import( 'dom.insertNode' );
CJS.Import( 'dom.removeNode' );
CJS.register( 'dom.replaceNode', function ( $ ) {
    var $f          = $.FUNCS,
        $l          = $.logic,
        $insertHTML = $l.dom.insertHTML,
        $insertNode = $l.dom.insertNode;
    return function ( newNode, oldNode ) {
        if ( !$f.isNode( oldNode ) ) {
            throw '[dom.replaceNode]: need node as second parameter!'
        }
        if ( $.isWhat( newNode, 'string' ) ) {
            $insertHTML( oldNode, newNode, 'afterend' );
        }
        else {
            $insertNode( oldNode, newNode, 'afterend' );
        }
        var theNewNode = oldNode.nextSibling;
        $l.dom.removeNode( oldNode );
        return theNewNode;
    };
});