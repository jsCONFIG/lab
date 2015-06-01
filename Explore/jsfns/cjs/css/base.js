/**
 * 样式获取及设置
 * @param node styleString|{styleObject}
        第二个参数为字符串时，将获取当前节点的样式，
        第二个参数为对象时，将对当前节点做样式设定
 */
CJS.register( 'css.base', function ( $ ) {
    return function ( node, spec ) {
        if( !$.FUNCS.isNode( node ) ) {
            $.FUNCS.error.set('[css.base]', 'need node as first parameter!');
            return false;
        }
        // 格式化样式名字符串为驼峰式
        var formatStr = function ( str ) {
            return str.replace(/([a-zA-Z]+)[\-]([a-zA-Z])([a-zA-Z]*)/g, function(){return (arguments[1] +arguments[2].toUpperCase() + arguments[3])});
        };

        // 格式化样式名字符串为-式
        var antiFormatStr = function ( str ) {
            return str.replace(/([a-z]+)([A-Z])([a-z]*)/g, function(){return (arguments[1] + '-' + arguments[2].toLowerCase() + arguments[3])})
        };
        // 额外列表
        var extraList = {
            'opacity': 'alpha',
            'boxShadow': 'progid:DXImageTransform.Microsoft.Shadow',
            'float': 'float'
        };

        var isFilter = false;

        // 获取计算样式
        var getComputedStyle = function ( styleName ) {
            if ( node.currentStyle ){
                getComputedStyle = function ( styleNameTemp ) {
                    return node.currentStyle[ styleNameTemp ];
                };
            } 
            else if ( window.getComputedStyle ) {
                getComputedStyle = function ( styleNameTemp ) {
                    return window.getComputedStyle( node, null )[ styleNameTemp ];
                }; 
            } 
            else if ( document.defaultView.getComputedStyle ) {
                getComputedStyle = function ( styleNameTemp ) {
                    return node.ownerDocument.defaultView.getComputedStyle( node, null )[ styleNameTemp ];
                };  
            } 
            else {
                getComputedStyle = function ( styleNameTemp ) {
                    return node.style[ styleNameTemp ];
                };
            }
            return getComputedStyle( styleName );
        };
        
        // 获取样式综合
        var getStyle = function ( styleTypeTemp ) {
            // 先获取计算样式，无计算样式时才访问行内样式，防止类似于!important的使用，提高准确性
            return getComputedStyle( styleTypeTemp );
        };

        // format extra
        var format = function ( styleName ) {
            var styleTxt = getStyle( styleType );
            if( styleName in extraList ) {
                if( !styleTxt ) {
                    var tempStyleTxt = getStyle( 'filter' );
                    isFilter = true;
                    switch ( styleName ) {
                        case 'opacity': 
                            tempStyleTxt = tempStyleTxt.replace(/[\'\"]/g, '');
                            var matchArr = tempStyleTxt.match( new RegExp( extraList['opacity'] + '[\(]([^\)]+)[\)]' ) );
                            if ( matchArr ) {
                                styleTxt = matchArr[1].split('=')[1];
                            } else {
                                styleTxt = 'none';
                            }
                            break;
                        case 'boxShadow':
                            // 杀千刀的计算啊！
                            var matchArr = tempStyleTxt.match( new RegExp( extraList['boxShadow'] + '[\(]([^\)]+)[\)]' ) );
                            if( matchArr ) {
                                var dataObj = {}, tempStr = matchArr[1].replace(/\s/g, '').split(',');
                                for ( var i = 0, l = tempStr.length; i < l; i++ ) {
                                    var tempDataKey = tempStr[i].split( '=' );
                                    dataObj[ tempDataKey[ 0 ].toLowerCase() ] = tempDataKey[ 1 ];
                                }
                                // tan(theta) = y / x
                                var theta = 180 * ( ( Math.PI - parseFloat( dataObj['direction'] ) ) / Math.PI );
                                var styleX = parseFloat( dataObj[ 'strength' ] ) * Math.cos( theta );
                                var styleY = parseFloat( dataObj[ 'strength' ] ) * Math.sin( theta );
                                styleTxt = styleX + 'px ' + styleY + 'px ' + dataObj[ 'strength' ] + 'px ' + dataObj[ 'color' ];
                            } else {
                                styleTxt = 'none';
                            }
                            break;
                        case 'float':
                            break;
                        default:
                    }
                }
            }
            return styleTxt;
        };

        // set css
        var setCss = function ( cssObj ) {
            var cssCatche = node.style.cssText.toLowerCase() + ';';
            var cssStr = '', tempName = '';
            !isFilter && format( 'opacity' );// 用来得到isFilter
            for ( var i in cssObj ) {
                tempName = antiFormatStr( i );
                cssStr = cssStr + tempName + ':' + cssObj[i] + ';';
                if ( isFilter ) {
                    switch ( tempName ) {
                        case 'opacity':
                            cssStr = cssStr + 'filter:alpha(opacity=' + parseFloat( cssObj[i] ) * 100 + ')' + ';zoom:1;';
                            break;
                        case 'box-shadow':
                            var shadowTemp = cssObj[i].split(' ');
                            var x = parseInt(shadowTemp[0]),
                                y = parseInt(shadowTemp[1]);
                            cssStr = cssStr + 'filter:progid:DXImageTransform.Microsoft.Shadow(Strength=' + Math.sqrt( x * x + y * y ) + ', Direction=' + Math.atan( y / x ) + ', Color="' + shadowTemp[3] + '");';
                            break;
                        default:

                    }
                }
            }
            node.style.cssText = cssCatche + cssStr;
        };
        if ( typeof spec == 'string' ) {
            var styleType = formatStr( spec );
            return format( styleType );
        } 
        else if ( typeof spec == 'object' ) {
            setCss( spec );
            return node;
        }
            
    };
} );