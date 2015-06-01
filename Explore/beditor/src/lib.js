define(function () {
    var _tools = function (){};
    // 获取唯一值,[0-9a-z]{len}
    _tools.prototype.unikey = function ( len ) {
        var l = (typeof len == 'number') ? len : 16;
        var result = '';
        for( ; result.length < l; result += Math.random().toString(36).substr(2) );
        return result.substr( 0, l );
    };

    // 清除字符串首尾空格
    _tools.prototype.trim = function (str) {
        if ((typeof str).toLowerCase() != 'string') {
            return str;
        }
        var sL = str.length;
        var reg = /\s/;
        for ( var i = 0; i < sL; i++ ) {
            if( !reg.test( str.charAt( i ) ) ) {
                break;
            }
        }
        if( i >= sL ) {
            return '';
        }
        for ( var j = sL - 1; j >= 0; j-- ) {
            if( !reg.test( str.charAt( j ) ) ) {
                // 针对slice特性，修正一个位置
                j++;
                break;
            }
        }
        return str.slice( i, j );
    };

    _tools.prototype.isArray = function ( arr ) {
        return Object.prototype.toString.call(arr) === '[object Array]';
    };

    // 判断数据类型，支持常见的几种数据类型
    _tools.prototype.isWhat = function ( v, type ) {
        var typeV = ( typeof v );
        if ( typeV == 'undefined' ) {
            return /^undefined$/i.test( type );
        }
        else{
            var reg = new RegExp( type, 'gi' );
            try {
                var transStr = v.constructor.toString();
                return reg.test( transStr );
            }
            catch(NULL){
                return ( /^object$/i.test( typeV ) && /^null$/i.test( type ) );
            }
        }
    };

    // 对象合并，isNumParse表示是否转换为数值类型
    _tools.prototype.parseObj = function (rootObj, newObj, isNumParse) {
        var tempObj = {};
        newObj = this.isWhat( newObj, 'object' ) ? newObj : {};
        for ( var i in rootObj ) {
            tempObj[i] = rootObj[i];
            if ( i in newObj ) {
                var temp = newObj[i];
                var parseVal = parseFloat(temp);
                if ( isNumParse && !isNaN( parseVal ) ) {
                    temp = parseVal;
                }
                tempObj[i] = temp;
            }
        }
        return tempObj;
    };

    // 检测是否是节点  @param node (| nodeType值)
    _tools.prototype.isNode = function ( node, TypeVal ) {
        if ( node && ( ( typeof node.nodeType ).toLowerCase() == 'number' ) ) {
            if ( !TypeVal ) {
                return true;
            } 
            else {
                return node.nodeType == parseInt(TypeVal);
            }
        } 
        else {
            return false;
        }
    };

    // 获取对象的长度
    _tools.prototype.objLength = function ( obj ) {
        var l = 0;
        for( var i in obj ) {
            if( obj.hasOwnProperty( i ) ) {
                l++;
            }
        }
        return l;
    };

    // 类继承方法，保证先继承，然后在定制化
    _tools.prototype.extend = function ( subClass, supClass ) {
        // 这样做的好处是在超类很复杂的情况下，造成的资源浪费
        var F = function () {};
        F.prototype = supClass.prototype;
        subClass.prototype = new F();
        subClass.prototype.constructor = subClass;
        return subClass;
    };

    // 将一个对象转换成一个类
    // ps:采用覆写prototype的方法，保证在继承之后执行
    _tools.prototype.newClass = function ( obj, nclass ) {
        var nClass = nclass || function () {};
        if ( typeof obj == 'object' ) {
            for( var i in obj ) {
                if ( obj.hasOwnProperty( i ) ) {
                    nClass.prototype[ i ] = obj[i];
                }
            }
        }
        return nClass;
    };

    // array索引
    _tools.prototype.indexOf = function (item, arr) {
        if (!this.isArray(arr)) {
            return false;
        }
        if (typeof arr.indexOf != 'undefined') {
            _tools.prototype.indexOf = function (otherItem, otherArr) {
                return otherArr.indexOf(otherItem);
            };
        } else {
            _tools.prototype.indexOf = function (otherItem, otherArr) {
                var index = -1;
                for (var i = 0; i < otherArr.length; i++) {
                    if (otherArr[i] === otherItem) {
                        index = i;
                        break;
                    }
                }
                return index;
            };
        }
        return _tools.prototype.indexOf(item, arr);
    };

    _tools.prototype.emptyFn = function () {};

    _tools.prototype.removeNode = function (theNode) {
        theNode.parentNode.removeChild(theNode);
    };

    // 判断是否存在
    _tools.prototype.isDefined = function ( nameStr, obj ) {
        nameStr = this.trim( nameStr );
        var mod;
        if( nameStr.indexOf('.') == -1 ) {
            mod = obj[nameStr]
        }
        else {
            var nameArr = nameStr.split('.');
            var tempFunc = obj;
            for ( var i = 0; i < nameArr.length; i++ ) {
                tempFunc = tempFunc[nameArr[i]];
                if( typeof tempFunc == 'undefined' ) {
                    break;
                }
            }
            mod = tempFunc;
        }
        return !!mod;
    };

    _tools.prototype.each = function ( arr, fn ) {
        if (!this.isArray(arr) ) {
            return false;
        }
        if ( typeof arr.forEach != 'undefined') {
            arr.forEach( fn );
        }
        else {
            for ( var i = 0, aL = arr.length; i < aL; i++ ) {
                fn( arr[i], i, arr );
            }
        }
    };

    // 绑定事件
    _tools.prototype.addEvt = function ( node, type, fn ) {
        // 如果是滚轮事件，则针对火狐浏览器做兼容处理
        if ( type == 'mousewheel' ) {
            !node.hasOwnProperty( 'onmousewheel' ) && ( type = 'onDOMMouseScroll' );
        }
        if(node.addEventListener){
            node.addEventListener(type, fn, false);
        }
        else if(node.attachEvent){
            node.attachEvent('on' + type, fn);
        }
        else{
            node['on' + type] = fn;
        }
    };

    _tools.prototype.rmEvt = function ( node, type, fn ) {
        // 如果是滚轮事件，则针对火狐浏览器做兼容处理
        if ( type == 'mousewheel' ) {
            !node.hasOwnProperty( 'onmousewheel' ) && ( type = 'onDOMMouseScroll' );
        }
        if(node.removeEventListener){
            node.removeEventListener( type, fn, false );
        }
        else if(node.detachEvent){
            node.detachEvent( 'on' + type, fn );
        }
        else{
            node['on' + type] = null;
        }
    };

    _tools.prototype.delegate = function ( root, attrName ) {
        var self = this;
        var attrN = attrName || 'data-bepg';
        // 实际绑定的方法
        var tmpFn = function ( e ) {
            var evt = e || window.event,
                target = evt.target || evt.srcElement,
                type = evt.type,
                attr = target.getAttribute( attrN );
            var fnarr = fns[type] && fns[type][ attr ];
            if( fnarr ) {
                self.each( fnarr, function ( item, index ) {
                    item && item( evt, {
                        'el' : target,
                        'attr': attr,
                        'root': root
                    });
                });
            }
            (!self.isWhat( attr, 'null' ) )
                && fns[type]
                && fns[type]['*']
                && self.each( fns[type]['*'],
                    function ( item, index ) {
                        item && item( evt, {
                        'el' : target,
                        'attr': attr,
                        'root': root
                    });
            });
        };
        var fns = {};
        var that = {};

        that.add = function ( attr, type, fn ) {
            var flag;
            fns[type] || ( fns[type] = {} );
            fns[type][attr] || ( fns[type][attr] = [], flag = true  );
            fns[type][attr].push( fn );
            flag && self.addEvt( root, type, tmpFn );
        };

        that.remove = function ( attr, type, fn ) {
            var index;
            if( fns[type]
                && fns[type][attr]
                && ( index = self.indexOf( fn, fns[type][attr] ) != -1 ) ) {
                fns[type][attr].splice( index, 1 );
                if( !fns[type][attr].length ) {
                    fns[type][attr] = undefined;
                    self.rmEvt( root, type, tmpFn );
                }
            }
        };
        return that;
    };

    // 检索节点
    _tools.prototype.find = function ( queryStr, root ) {
        var self = this;
        root = root || document.body;
        if( root.querySelectorAll ) {
            return root.querySelectorAll( queryStr );
        }
        else {
            // 清除多余的引号
            queryStr = queryStr.replace( /\'|\"/g, '' );
            var reg = {
                'tag'   : /^([a-zA-Z]+)$/,
                'class' : /^\.(\S+)$/,
                'id'    : /^\#(\S+)$/,
                'attr'  : /^\[([^\=]+)\=([^\]]+)\]$/
            };
            var flag, query;
            for( var i in reg ) {
                if( reg.hasOwnProperty( i ) ) {
                    var tmp = queryStr.match( reg[i] );
                    tmp && ( query = tmp, flag = i );
                }
            }
            var findNode = function ( attr, attrName ) {
                var nL = root.getElementsByTagName( '*' );
                var result = [];
                self.each( nL, function ( item, index ) {
                    if( item && item.nodeType == 1 ) {
                        var tmpAttr = item.getAttribute( attrName );
                        tmpAttr == attr && result.push( item );
                    }
                });
                return result;
            };

            var getByClass = function ( classStr ) {
                if( root.getElementsByClassName ) {
                    return root.getElementsByClassName( classStr );
                }
                else {
                    return findNode( classStr, 'class' );
                }
            };

            var result = [];
            switch( flag ) {
                case 'class':
                    result = getByClass( query[1] );
                    break;
                case 'id':
                    result = document.getElementById( query[1] );
                    break;
                case 'attr':
                    result = findNode( query[2], query[1] );
                    break;
                case 'tag':
                    result = root.getElementsByTagName( query[1] );
                default:
            }
            return result;
        }
    };

    // contains方法封装
    _tools.prototype.contains = function ( sup, sub ) {
        if( sup.contains ) {
            return sup.contains( sub );
        }
        else {
            var innerParent = sub;
            while ( innerParent ) {
                innerParent = innerParent.parentNode;
                if ( innerParent === sup ) {
                    return true;
                }
            }
            return false;
        }
    };

    _tools.prototype.closest = function ( queryStr, root ) {
        // 清除多余的引号
        queryStr = queryStr.replace( /\'|\"/g, '' );
        var reg = {
            'tag'   : /^([a-zA-Z]+)$/,
            'class' : /^\.(\S+)$/,
            'id'    : /^\#(\S+)$/,
            'attr'  : /^\[([^\=]+)\=([^\]]+)\]$/
        };
        var flag, query;
        for( var i in reg ) {
            if( reg.hasOwnProperty( i ) ) {
                var tmp = queryStr.match( reg[i] );
                tmp && ( query = tmp, flag = i );
            }
        }

        var innerParent = root;
        while ( innerParent ) {
            innerParent = innerParent.parentNode;
            var tmpFlag;
            switch( flag ) {
                case 'class':
                    tmpFlag = ( innerParent.className == query[1] );
                    break;
                case 'id':
                    return document.getElementById( query[1] );
                    break;
                case 'attr':
                    tmpFlag = ( innerParent.getAttribute( query[1] ) == query[2] );
                    break;
                case 'tag':
                    tmpFlag = (innerParent.nodeName.toLowerCase() == query[1].toLowerCase());
                    break;
                default:
            }
            if ( tmpFlag ) {
                return innerParent;
            }
        }
        return undefined;
    };

    _tools.prototype.strToJson = function ( str ) {
        if( str == undefined ) {
            return {};
        }
        var reg = /([^\?&\&]+)/g;
        var temp = str.match( reg );
        var resultObj = {};
        for( var i = 0; i < temp.length; i++ ) {
            var str = temp[i];
            var strArr = str.split( '=' );
            if( strArr.length >= 2 ) {
                resultObj[ strArr[0] ] = strArr[1];
            }
        }
        return resultObj;

    };

    _tools.prototype.jsonToStr = function ( obj, isEncode ) {
        var str = '';
        var temp = [];
        for (var i in obj) {
            var tempV = obj[i].toString();
            if ( isEncode ) {
                i = encodeURIComponent( i );
                tempV = encodeURIComponent( tempV );
            }
            temp[ temp.length ] = ( i + '=' + tempV );
            temp[ temp.length ] = ( '&' );
        }
        temp.pop(); // 弹出最后一个&
        str = temp.join('');
        return str;
    };

    _tools.prototype.isInlineNd = function ( nd ) {
        if( !nd || !nd.nodeType ){
            return false;
        }
        if( nd.nodeType == 3 ) {
            return true;
        }
        var inlineList = 'span,strong,em,br,img ,input,label,select,textarea,cite,sup,sub,i,small,strike,tt,u';
        return inlineList.indexOf( nd.nodeName.toLowerCase() ) != -1;
    };

    _tools.prototype.newSelection = function () {
        var userSelection;
        if( window.getSelection ) {
            userSelection = window.getSelection();
        }
        else if( document.selection ) {
            userSelection = document.selection.createRange();
        }
        return userSelection;
    };

    // 根据selection创建range对象
     _tools.prototype.getRangeObject = function( sObj ) {
        if( sObj.getRangeAt ) {
            if( sObj.rangeCount > 0 ) {
                return sObj.getRangeAt(0);
            }
            else {
                return undefined;
            }
        }
        else{ // 较老版本Safari!
            var range = document.createRange();
            range.setStart( sObj.anchorNode, sObj.anchorOffset );
            range.setEnd( sObj.focusNode, sObj.focusOffset );
            return range;
        }
    };

    _tools.prototype.getBlockParent = function ( sN, root ) {
        var p = sN;
        while( this.isInlineNd( sN ) && p != root ) {
            p = p.parentNode;
        }

        if( p == root || this.isInlineNd( p ) ) {
            return false;
        }
        return p;
    };

    return new _tools;
});