/**
 * 检测某个节点是否包含(>=)另一个节点
 * ps: 或许可以额外定义两个独一无二的class，分别赋给inner和outer
 * 然后css根据层级关系写好样式，判断inner的样式是否改变了，改变则说明层级关系成立，包含成立
 */
CJS.register( 'dom.contains', function ( $ ) {
    return function (inner, outer) {
        if (inner == outer) {
            return true;
        }
        if (inner.prototype && inner.prototype.contains && outer.prototype && outer.prototype.contains) {
            return outer.contains(inner);
        }
        var innerParent = inner;
        while (innerParent) {
            innerParent = innerParent.parentNode;
            if (innerParent === outer) {
                return true;
            }
        }
        return false;
    };
});