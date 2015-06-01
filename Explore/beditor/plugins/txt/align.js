/**
 * 文本对齐插件
 * @return {[type]} [description]
 */
define( function ( require ) {
    var $T = require( '../../src/lib' );
    var $R = require( '../../src/core/range' );
    var beforeCache;

    var getCommonParent = function ( sN, eN, root ) {
        beforeCache = sN;
        if( sN.parentNode == root ) {
            return root;
        }
        if( sN == eN ) {
            return sN;
        }
        if( $T.contains( sN.parentNode, eN ) ) {
            return sN.parentNode;
        }
        return getCommonParent( sN.parentNode, eN, root );
    };

    var align = function ( evt, evtObj, rgObj, $T ) {
        var target, flag = false,
            rg = rgObj.origin,
            rgWrapper = rg ? rg.commonAncestorContainer : undefined,
            editObj = evtObj.info.editor;

        // 公共父节点非编辑器本身，且为块级元素
        if( rgWrapper != editObj.editor && !$T.isInlineNd( rgWrapper ) ) {
            target = rgWrapper;
        }
        else{
            if( rgWrapper == rg.startContainer && rgWrapper.nodeType != 3 ) {
                target = rgWrapper.childNodes[ rg.startOffset ];
                // 为行内元素
                if( $T.isInlineNd( target ) ) {
                    rg = rg.selectNode( target );
                    flag = true;
                    target = document.createElement('div');
                }
            }
            else {
                target = document.createElement('div');
                // 公共父节点非编辑器本身，且为行内元素
                if( rgWrapper != editObj.editor && $T.isInlineNd( rgWrapper ) ) {
                    rg = rg.selectNode( rgWrapper );
                }
                flag = true;
            }
            
            flag && (rg = rgObj.surroundContents( target ).origin);
        }

        var styleStr = evtObj.data.dir;

        switch( styleStr ) {
            // 文本左对齐
            case 'left':
                break;
            // 文本居中
            case 'center':
                break;
            // 文本右对齐
            case 'right':
                break;
            default:
                return false;
        }

        target.style.textAlign = styleStr;
        rgObj.origin = rg;
        console.log(rg, target );

        // 返回新的rg交给beditor处理
        return rgObj;
    };
    var that = {
        'name'       : 'txt/align',
        'keyAct'     : function () {console.log(arguments)},
        'btnAct'     : align,
        'smartKey'   : ['ctrl_a', 'ctrl_b'],
        'destroy'    : function () {}   
    };
    return that;
});