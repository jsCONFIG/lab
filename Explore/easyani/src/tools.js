/**
 * 提供常用工具函数
 */
define(function () {
    var _dom = function ( nd ) {
        var l = 0,
            self = this;
        if( _tool.isType( nd, 'NodeList' ) ) {
            nd = Array.prototype.slice.call( nd, 0);
        }

        if( _tool.isType( nd, 'Array' ) ) {
            l = nd.length;
            for( var i = 0; i < l; i++ ) {
                self[i] = nd[i];
            }
        }
        else if( nd.nodeType ) {
            l = 1;
            self[0] = nd;
        }

        self.length = l;
    };

    _dom.prototype.css = function ( cssObj ) {
        var self = this;
        if( !self.length ) {
            return self;
        }

        if( self[0].style.cssText ) {
            for( var j = 0; j < self.length; j++ ) {
                var me = self[j];
                var myCssText = me.style.cssText;

                for( var i in cssObj ) {
                    if( cssObj.hasOwnProperty( i ) ) {
                        var reg = new RegExp( i + '\\s*\\:?[^\\;]+\\;?' );
                        myCssText.replace( reg, '' );
                        myCssText += ( i + ':' + cssObj[i] + ';' );
                    }
                }
                me.style.cssText = myCssText;
            }
        }

        else {
            for( var j = 0; j < self.length; j++ ) {
                var me = self[j];

                for( var i in cssObj ) {
                    if( cssObj.hasOwnProperty( i ) ) {
                        var itmp = i;
                        var itmp = i.replace( _reg.cssF, function () {
                            return arguments[1].toUpperCase();
                        });
                        me.style[ itmp ] = cssObj[i];
                    }
                }
            }
        }
    };

    _dom.prototype.getSize = function () {
        var self = this;
        if( !self.length ) {
            return {};
        }

        var size = {
            'height'    : self[0].offsetHeight,
            'width'     : self[0].offsetWidth
        };

        return size;
    };

    _dom.prototype.position = function () {
        
    };
    
    var $T = {
        indexOf: function (arr, item) {
            if (typeof arr.indexOf != 'undefined') {
                return arr.indexOf(item);
            }
            else {
                var index = -1;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] === item) {
                        index = i;
                        break;
                    }
                }
                return index;
            }
        },
        unikey: function ( len ) {
            var l = (typeof len == 'number') ? len : 16;
            var result = '';
            for( ; result.length < l; result += Math.random().toString(36).substr(2) );
            return result.substr( 0, l );
        },
        strReplace: function (str, data) {
            var reg = /\#\{([a-zA-Z\_\-0-9]+)\}/g;
            var result = str.replace(reg, function (){
                var ar = (typeof data[arguments[1]] == 'undefined' ) ? '' : data[arguments[1]];
                return ar;
            });
            return result;
        },
        isType: function (v, type) {
            var typeV = (typeof v);
            if (typeV === 'undefined') {
                return /^undefined$/i.test(type);
            }
            else {
                var reg = new RegExp(type, 'gi');
                try {
                    var transStr = v.constructor.toString();
                    return reg.test(transStr);
                }
                catch (NULL) {
                    return (/^object$/i.test(typeV) && /^null$/i.test(type));
                }
            }
        },
        parseParam: function (rootObj, newObj, isNumParse) {
            var tempObj = {};
            newObj = $T.isType(newObj, 'object') ? newObj : {};
            for (var i in rootObj) {
                tempObj[i] = rootObj[i];
                if (i in newObj) {
                    var temp = newObj[i];
                    var parseVal = parseFloat(temp);
                    if (isNumParse && !isNaN(parseVal)) {
                        temp = parseVal;
                    }
                    tempObj[i] = temp;
                }
            }
            return tempObj;
        },

        // 获取随机整数
        randomRg: function (min, max) {
            var step = max - min;
            return min + Math.ceil(Math.random() * step);
        },

        get: function(idStr) {
            return document.getElementById(idStr);
        },
        fromateEvt: function (e) {
            var evt = e || window.event;
            var target = evt.target || evt.srcElement,
                type = evt.type,
                left = evt.X || evt.clientX,
                top = evt.Y || evt.clientY,
                // 储存临时的relatedTarget对象
                temp;

            // 用于支持IE浏览器等不支持relatedTarget属性的浏览器
            if (type == 'mouseout' || type == 'mouseover') {
                temp = evt.relatedTarget || (type == 'mouseout' ? evt.toElement : evt.fromElment);
            }
            evt.l = left;
            evt.t = top;
            evt.relatedTarget = temp;
            evt.target = target;
            return evt;
        }
    };

    return $T;
});