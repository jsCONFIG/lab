CJS.Import( 'ani.algorithm' );
CJS.Import( 'css.base' );
CJS.Import( 'str.ctrlColor' );
CJS.Import( 'evt.event' );
CJS.register( 'ani.action', function ( $ ) {
    var $algo   = $.logic.ani.algorithm,
        $css    = $.logic.css.base,
        $color  = $.logic.str.ctrlColor,
        $evt    = $.logic.evt.event;

    return function ( node, opt ) {
        if( !$.FUNCS.isNode( node ) ){
            $.FUNCS.error.set( 'ani.action', 'need node as first parameter!' );
            throw '[ani.action] need node as first parameter!'
        }
        var option = $.FUNCS.parseObj( {
            'type'          : 'uniform',
            'callback'      : function () {},
            'time'          : 500,
            'stepT'         : 50,                   // 每次改变的时间间隔，可理解为帧率的倒数
            'acceleration'  : 10,
            'threshold'     : 2                     // 达到目标的阈值
        }, opt || {}, true );
        
        var currentStyle = {}, courseStyle = {}, initialObj = {}, formatAcc = option.type == 'uniform' ? 0 : option.acceleration,
            accObj = {}, that = {}, targetStyle, clock;

        var extraColorList      = 'color,background-color',
            extraOpacityList    = 'opacity',
            extraShadowList     = 'box-shadow';

        // 样式做差基础
        var styleMinusBase = function ( firstCss, secondCss ) {
            var fNum = parseFloat( firstCss ),
                sNum = parseFloat( secondCss );
            if( typeof fNum == 'NaN' ) {
                return false;
            } 
            return (sNum - fNum);
        };

        // 样式做差逻辑部分
        var styleMinus = function ( firstCssObj, secondCssObj ) {
            var result = {};
            for ( var i in firstCssObj ) {
                // 针对颜色
                if ( extraColorList.indexOf( i ) != -1 ) {
                    var firstFormat = getFormat( firstCssObj[ i ] );
                    var secondFormat = getFormat( secondCssObj[ i ] );
                    result[ i ] = {
                        'r': secondFormat.r - firstFormat.r,
                        'g': secondFormat.g - firstFormat.g,
                        'b': secondFormat.b - firstFormat.b
                    }
                }
                // 针对常规样式
                else {
                    var tempResult = styleMinusBase( firstCssObj[ i ], secondCssObj[ i ] );
                    if( tempResult ) {
                        result[ i ] = tempResult;
                    }
                }
            }
            return result;
        };

        // 样式做加基础
        var styleAddBase = function ( firstCss, secondCss ) {
            var fNum = parseFloat( firstCss ),
                sNum = parseFloat( secondCss );
            if( isNaN( fNum ) ) {
                return false;
            } 
            return (fNum + sNum) + firstCss.toString().replace( fNum, '' );
        };

        // 格式化颜色为对象
        var getFormat = function ( data ) {
            // 处理未设置颜色时，计算样式值为rgba(0,0,0,0);而引起的黑屏状况
            data = data.replace( /\s/g, '' );
            if( data == 'rgba(0,0,0,0)' ) {
                var data = 'rgb(255,255,255)';
            }
            var formatColor = $color.HTD( data );
            var regArr = formatColor.match( /rgb[a]?\(([^\)]+)\)/i )[1].split( ',' );
            var colorObj = {
                'r': parseInt( regArr[0] ),
                'g': parseInt( regArr[1] ),
                'b': parseInt( regArr[2] ),
                'a': parseInt( regArr[3] != undefined ? regArr[3] : 1 )
            };
            return colorObj;
        };

        // 解码格式化的颜色为字符串
        var decodeFormate = function ( dataObj ) {
            return 'rgb(' + dataObj.r + ',' + dataObj.g + ',' + dataObj.b + ')';
        };

        // 样式做加逻辑部分
        var styleAdd = function ( firstCssObj, secondCssObj ) {
            var result = {};
            for ( var i in firstCssObj ) {
                if ( extraColorList.indexOf( i ) == -1 ) {
                    var tempResult = styleAddBase( firstCssObj[ i ], secondCssObj[ i ] );
                    if( tempResult ) {
                        result[ i ] = tempResult;
                    }
                }
                else {
                    var firstFormat = getFormat( firstCssObj[ i ] );
                    var secondFormat = getFormat( secondCssObj[ i ] );
                    var tempObj = {
                        'r': secondFormat.r + firstFormat.r,
                        'g': secondFormat.g + firstFormat.g,
                        'b': secondFormat.b + firstFormat.b
                    };
                    result[ i ] = 'rgb(' + tempObj.r + ',' + tempObj.g + ',' + tempObj.b + ')'
                }
            }
        };

        // 获取待改变的样式的当前值与"行走的路程"
        var getStyleData = function () {
            for ( var i in targetStyle ) {
                var tempStyle = $css( node, i );
                // 针对颜色做特殊处理
                if ( extraColorList.indexOf( i ) != -1 ) {
                    // 如果颜色设置为“透明”，则向其父节点取颜色，直至找到非“透明”设置或者到达最顶层
                    if ( tempStyle == 'transparent' ) {
                        var tempNode = node,
                            flag;
                        while ( tempNode != node.ownerDocument ) {
                            var loopStyle = $css( tempNode, i );
                            if ( loopStyle != 'transparent' ) {
                                tempStyle = loopStyle;
                                flag = true;
                                break;
                            }
                            tempNode = tempNode.parentNode;
                        }
                        !flag && ( tempStyle = '#ffffff');
                    }
                }
                else if ( extraOpacityList.indexOf( i ) != -1 ) {
                    if ( tempStyle == 'none' ) {
                        tempStyle = 1;
                    }
                }
                currentStyle[ i ] = tempStyle;
            }
            courseStyle = styleMinus( currentStyle, targetStyle );
        };

        // 获取初始改变值，可理解为初速度
        var getInitialV = function () {
            for ( var i in courseStyle ) {
                if ( extraColorList.indexOf( i ) == -1 ) {
                    initialObj[ i ] = $algo[ option.type ]( Math.abs( courseStyle[ i ] ), Math.ceil( option.time / option.stepT ), formatAcc );
                }
                else {
                    var extraObj = {};
                    for ( var j in courseStyle[ i ] ) {
                        extraObj[ j ] = $algo[ option.type ]( Math.abs( courseStyle[ i ][ j ] ), Math.ceil( option.time / option.stepT ), formatAcc );
                    }
                    initialObj[ i ] = extraObj;
                }   
            }
        };

        // 检测现有条件下，加速度的设定是否合法< 加(减)速运动时，初速度是否大于0 >
        var filterA = function ( firstV, S ) {
            if ( firstV >= 0 ) {
                return formatAcc;
            } 
            // 如果不合法，则设定初(末)速度为0的情况下，抛出合法的加速度
            else {
                // 针对半加速半减速的情况，对“路程”做减半处理
                var tempS = ( option.type == 'uniformlyAddMinus' ? S/2 : S ),
                    tempT = option.time / ( option.type == 'uniformlyAddMinus' ? 2 : 1 );
                return Math.abs( $algo[ 'acceleration' ]( tempS, Math.ceil( tempT / option.stepT ) ) );
            }
        };

        var actionBase = function () {
            var counter = 1, tMax = Math.ceil( option.time / option.stepT );
            // 循环基础依赖组件
            var loopBase = function ( func ) {
                func();
                counter++;
                if ( counter > tMax ) {
                    option.callback( targetStyle );
                    // 自定义事件触发，用于队列及其它相关处理
                    $evt.custEvt.fire( that, 'actionEnd', node );
                    return node;
                }
                clock && clearTimeout( clock );
                clock = setTimeout( function () { clock = undefined; loopBase( func ) }, option.stepT );
            };

            // 获取当前<即本次>要改变的值，这里需注意“加速度”的正负
            var getCurrentV = function ( times, v0, realAcc ) {
                return (v0 + realAcc * times);
            };

            // 过滤初速度不合法的设置
            for ( var i in initialObj ) {
                if ( extraColorList.indexOf( i ) == -1 ) {
                    accObj[ i ] = filterA( initialObj[ i ], Math.abs( courseStyle[ i ] ) );
                    if ( accObj[ i ] != formatAcc ) {
                        initialObj[ i ] = 0;
                    }
                }
                else {
                    // 临时的，针对颜色的，加速度的对象< 针对每个颜色通道 >
                    var extraObj = {};
                    for ( var j in initialObj[i] ) {
                        extraObj[ j ] = filterA( initialObj[ i ][ j ], Math.abs( courseStyle[ i ][ j ] ) );
                        if ( extraObj[ j ] != formatAcc ) {
                            initialObj[i][ j ] = 0;
                        }
                    }
                    accObj[ i ] = extraObj;
                }
            }

            // 节点样式改变的核心方法
            var changeFunc = function () {
                // 待处理的样式对象
                var result = {};
                // 遍历初始改变值<初速度>对象
                for ( var i in initialObj ) {
                    /* 针对颜色的动画
                     * 此处使用rgb的格式来进行动画赋值，
                     * 由于rgb中的各通道的数值必须为整数
                     * 所以当改变量不适中时，造成小数的情况下，会自动转化为接近的整数
                     * 所以实际感觉动画的时间可能与参数的时间存在出入
                     */
                    if ( extraColorList.indexOf( i ) != -1 ) {
                        var changeV = {}, tempState = {}, nextState = {}, flagKey,
                            // 编码颜色字符串为可处理的颜色对象
                                tempColorStyle = $css( node, i ),
                                currentColor,
                                formatTarget = getFormat( targetStyle[ i ] );
                            if ( tempColorStyle == 'transparent' ) {
                                var tempNode = node.parentNode,
                                    flag,
                                    tempColor = 'transparent';
                                while ( tempNode != document ) {
                                    var toBeTestCss = $css( tempNode, i );
                                    if ( toBeTestCss != 'transparent' ) {
                                        tempColorStyle = toBeTestCss;
                                        flag = true;
                                        break;
                                    }
                                    tempNode = tempNode.parentNode;
                                }
                                !flag && (tempColorStyle = '#ffffff');
                            }
                            currentColor = getFormat( tempColorStyle );
                        for ( var j in initialObj[ i ] ) {
                            // 判断正负的标记
                            flagKey = ( courseStyle[ i ][j] <= 0  ? -1  : 1 );
                            // 取某样式本次要改变量<非本次的值，而是改变量>
                            changeV[ j ] = flagKey * getCurrentV( counter, initialObj[ i ][j], accObj[ i ][j] );
                            // 将待改变量与当前样式值相加，获取最终的样式值<此处是真正的样式值，而非改变量>
                            tempState[ j ] = currentColor[ j ] + changeV[ j ];
                            // 保证合法性
                            if ( tempState[ j ] > 255 ) {
                                tempState[ j ] = 255;
                            }
                            else if( tempState[ j ] < 0 ) {
                                tempState[ j ] = 0;
                            }
                            // 将目标样式值减去本次待设置值，用于检测样式是否已经达到目标值
                            var isCssOk = ( flagKey * ( formatTarget[ j ] -tempState[ j ] ) ) < 0;
                            // 如果样式还未达到目标，则使这个待设置值生效。
                            if( !isCssOk ) {
                                nextState[ j ] = ( flagKey < 0 ? Math.floor( tempState[j] ) : Math.ceil( tempState[j] ) );
                            }
                            // 如果样式达到目标值，则将结果赋为目标值
                            else {
                                nextState[ j ] = Math.floor( formatTarget[ j ] );
                            }
                        }
                        // 解码已编码的颜色对象为标准字符串形式
                        result[i] = decodeFormate( nextState );
                    }
                    // 针对常规非颜色相关的动画
                    else {
                        // 判断正负的标记
                        var flagKey = ( courseStyle[ i ] <= 0  ? -1  : 1 );
                        // 取某样式本次要改变量<非本次的值，而是改变量>
                        var changeV = flagKey * getCurrentV( counter, initialObj[ i ], accObj[ i ] );
                        // 将待改变量与当前样式值相加，获取最终的样式值<此处是真正的样式值，而非改变量>
                        var styleTxt = $css( node, i );
                        // 针对IE8-浏览器无设置opacity时返回None的情况
                        if ( i == 'opacity' && styleTxt == 'none' ) {
                            styleTxt = 1;
                        }
                        var tempState = styleAddBase( styleTxt, changeV );
                        // 判断样式是否可加
                        if ( ( typeof tempState ).toLowerCase() != 'boolean' ) {
                            // 将目标样式值减去本次待设置值，用于检测样式是否已经达到目标值
                            var isCssOk = ( flagKey * styleMinusBase( tempState, targetStyle[ i ] ) ) < 0;
                            // 如果样式还未达到目标，则使这个待设置值生效。
                            if( !isCssOk ) {
                                result[ i ] = tempState;
                            }
                            // 如果样式达到目标值，则将结果赋为目标值，同时删除本次循环的依赖键值<则下次循环时它将不参与>
                            else {
                                result[ i ] = targetStyle[ i ];
                                delete initialObj[ i ];
                                
                            }
                        }
                    }
                }
                $css( node, result );
            };
            loopBase( changeFunc );
        };
        
        that.play = function ( theTarget ) {
            // 置空相关设置
            currentStyle = courseStyle = initialObj = {};
            targetStyle = theTarget;
            getStyleData();
            getInitialV();
            actionBase();
        };
        that.destroy = function () {
            clock && clearTimeout( clock );
        };
        return that;
    };
} );