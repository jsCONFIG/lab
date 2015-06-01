/**
 * 获取距离当前节点最近的，符合条件的父节点
 * @param 依据的节点 索引字符串 (查询范围，默认为document)
 * @return 符合条件的父亲节点
 */
CJS.register('dom.getClosest', function ($) {
    return function (rootNode, toAttr, wrapperNode) {
        // 变量初始化
        var $func = $.FUNCS,
            type,
            $error = $func.error;

        var checkNode = function () {
            if ( !rootNode || typeof rootNode == 'undefined' ) {
                $error.set('[dom.getClosest]', 'need Node as first parameter!');
                return false;
            }
            else {
                return true;
            }
        };

        if (!checkNode()) {
            return;
        }
        var wrapperNode = wrapperNode || node.ownerDocument;
        // 关键正则定义
        var regs = {
            'id': /^\#([a-zA-Z\_]\S*)$/,
            'class': /^\.([a-zA-Z\_]\S*)$/,
            'attr': /^\[(\S+)\=[\'\"]?(\S+)[\'\"]?\]$/,
            'tag': /^[a-zA-Z]+$/
        };

        // 递归节点属性获取目标节点
        var getAttrNodes = function (attr, val, isClass) {
            var forEachNode = function (node) {
                if ( node != wrapperNode || node.nodeType != 9) { // 节点为文档类型则表示未找到
                    var parentNode = node.parentNode;
                    if (parentNode.nodeType == 1) { // 如果不是元素节点，则访问其父节点
                        var parentAttr = isClass ? parentNode.className : parentNode.getAttribute(attr);
                        if (parentAttr === val) {
                            return parentNode;
                        } else {
                            return forEachNode(parentNode);
                        }
                    } else {
                        return forEachNode(parentNode);
                    }

                } else {
                    return null;
                }
            };
            return forEachNode(rootNode);
        }

        var getTagNameNode = function (tag) {
            var forEachNode = function (node) {
                if (node.nodeType != 9) { // 节点为文档类型则表示未找到
                    var parentNode = node.parentNode;
                    if (parentNode.nodeType == 1) { // 如果不是元素节点，则访问其父节点
                        var parentTagName = parentNode.tagName.toLowerCase();
                        if (parentTagName == tag) {
                            return parentNode;
                        } else {
                            return forEachNode(parentNode);
                        }
                    } else {
                        return forEachNode(parentNode);
                    }

                } else {
                    return null;
                }
            };
            return forEachNode(rootNode);
        };
        // 获取依据字符串的类型
        var getType = function () {
            for (var i in regs) {
                var matchVal = toAttr.match(regs[i]);
                if ( !! matchVal) {
                    type = i;
                    return matchVal;
                }
            }
        };

        // 获取目标节点
        var getNode = function () {
            var matchVal = getType();
            switch (type) {
            case 'id':
                node = document.getElementById(matchVal[1]);
                break;
            case 'class':
                node = getAttrNodes( 'class', matchVal[1], true);
                break;
            case 'attr':
                node = getAttrNodes(matchVal[1], matchVal[2]);
                break;
            case 'tag':
                node = getTagNameNode(toAttr.toLowerCase());
                break;
            default:
                node = rootNode;
            }
            return node;
        };
        return getNode();
    };
});