/**
 * 节点选择器，支持id，class，属性，简单混合逻辑为关键字
 * @param 索引关键字 封顶节点
 */
CJS.register('dom.get', function ($) {
	return function (indexStr, upNode) {
		var regs = {
			'id'		: /^\#([a-zA-Z\_]\S*)$/,
			'class'		: /^\.([a-zA-Z\_]\S*)$/,
			'attr'		: /^\[(\S+)\=[\'\"]?(\S+)[\'\"]?\]$/,
			'tag'		: /^[a-zA-Z]+$/,
			// 此处格式为 div|#lp（div或者id为lp的节点）  div&.lp（div且class为lp的节点）
			'tagAttr'	: /^([a-zA-Z]+)([\&\|])(.+)$/
		};
		// 错误管理器
		var error = $.FUNCS.error;
		var type, node = document.body,
			root = upNode || document,
			indexStr = $.FUNCS.isWhat( indexStr, 'undefined' ) ? 'body' : indexStr;

		// 取属性节点
		var getAttrNodes = function (attr, val) {
			var tempNode = [];
			if ( root.querySelectorAll && val !='*' ) {
				tempNode = NListToArray( root.querySelectorAll( indexStr ) );
			}
			else {
				var nodes = root.getElementsByTagName('*');
				for (var i = 0; i < nodes.length; i++) {
					var attrVal = nodes[i].getAttribute(attr);
					if (attr == 'class') { // 此处为class做特殊处理，用兼容ie7-
						attrVal = nodes[i].className;
					}
					if (val == '*') {
						attrVal && tempNode.push(nodes[i]);
					}
					else if (attrVal == val) {
						tempNode.push(nodes[i]);
					}
				}
			}
			return tempNode;
		}

		// nodeList类型转换为array类型
		var NListToArray = function ( Nl ) {
			return Array.prototype.splice.call(Nl, 0);
		};

		// 取class
		var getClassNode = function (className) {
			var tempNode;
			if ( root.querySelectorAll ) {
				tempNode = NListToArray( root.querySelectorAll( className ) );
			}
			else if (root.getElementsByClassName) {
				tempNode = root.getElementsByClassName(className);
				tempNode = NListToArray(tempNode);
			}
			else {
				tempNode = getAttrNodes('class', className);
			}
			return tempNode;
		};

		var getTagAttrNode = function (tagName, logicType, attr) {
			var nodes = [];
			if (logicType == '|') {
				var tempTags = root.getElementsByTagName(tagName);
				tempTags = NListToArray(tempTags); // nodeList转化为数组
				var tempNodes = getNode(attr) || [];
				nodes = $.FUNCS.concatArrOnly(tempTags, $.FUNCS.isArray(tempNodes) ? tempNodes : [tempNodes]);
			} else if (logicType == '&') {
				var tempAttrs = getNode(attr) || [];
				tempAttrs = $.FUNCS.isArray(tempAttrs) ? tempAttrs : [tempAttrs];
				for(var i = 0, len = tempAttrs.length; i < len; i++){
					var attrNode = tempAttrs[i];
					if(attrNode.nodeName && attrNode.nodeName.toLowerCase() == tagName){
						nodes.push(attrNode);
					}
				}
			}
			return nodes;
		};
		// 取索引类型
		var getType = function (indexStr) {
			for (var i in regs) {
				var matchVal = indexStr.match(regs[i]);
				if ( !! matchVal) {
					type = i;
					return matchVal;
				}
			}
		};
		var getNode = function (indexStr) {
			var matchVal = getType(indexStr);
			var node;
			switch (type) {
			case 'id':
				node = document.getElementById(matchVal[1]);
				break;
			case 'class':
				node = getClassNode(matchVal[1]);
				break;
			case 'attr':
				node = getAttrNodes(matchVal[1], matchVal[2]);
				break;
			case 'tag':
				node = NListToArray( root.getElementsByTagName(indexStr) );
				break;
			case 'tagAttr':
				node = getTagAttrNode(matchVal[1], matchVal[2], matchVal[3]);
				break;
			default:
				node = null;
			}
			return node;
		};
		return getNode(indexStr);
	};
});