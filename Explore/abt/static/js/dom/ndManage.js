/**
 * 管理节点
 */
$( function () {
    var module = $M.define( 'dom/ndManage' );
    module.require( 'dom/builder' );

    var $B = $M.tools;

    var current;

    var cf = {
        'currentClass' : 'current'
    };

    var TEMP = {
        'item' : '<div class="item"></div>'
    };

    

    // 配置class表
    var myClass = {
        'left' : 'left',
        'right': 'right',
        'clear': 'fixClear'
    };

    // 可操作块的选择器
    var itemClass = '.item,.nobdItem';

    module.build( 'init', function () {
        var that = {};

        // 单个设置，完整替换
        that.setCurrent = function ( el ) {
            if( el ) {
                el = $( el ).closest(itemClass);
                if( !el.length ) {
                    return;
                }

                that.delCurrent();
                el.addClass( cf.currentClass );
                current = $( el );
            }
        };

        // 追加到current中
        that.addToCurrent = function ( el ) {
            el = $( el ).closest(itemClass);
            if( !current || !current.length ) {
                that.setCurrent( el );
            }
            else {
                if( current.index( el[0] ) == -1 ) {
                    // 此处，如果使用current.add，
                    // 由于current.add不影响源，所以
                    // 应该更新current为其返回值
                    current.push( el[0] );
                    $( el ).addClass( cf.currentClass );
                }
            }
        };

        that.delCurrent = function ( el ) {
            if( current && current.length ) {
                if( !el ) {
                    current.removeClass( cf.currentClass );
                    current = undefined;
                }
                else {
                    var pos = current.index( $( el )[0] );
                    if( pos != -1 ) {
                        current.eq( pos ).removeClass( cf.currentClass );
                        current.splice( pos, 1 );
                    }
                }

                if( current && !current.length ) {
                    current = undefined;
                }
            }
        };

        // 检测是否在current列表中
        that.hasCurrent = function ( el ) {
            el = $( el ).closest(itemClass);
            return current && current.index( el[0] ) != -1;
        };

        that.tryToDel = function ( el ) {
            if( el && current && current.index( $( el )[0] ) != -1 ) {
                that.delCurrent( el );
            }
        };

        that.getCurrent = function () {
            if( current && current.length ) {
                return current;
            }
            else {
                current = undefined;
                return undefined;
            }
        };

        // 移除current中的dom节点
        that.removeItem = function () {
            if( current && current.length ) {

                // 检测删除当前项之后是否要置空父级节点
                current.each( function ( index, item ) {
                    var $item = $( item );

                    if( $item.siblings( itemClass ).length == 0 ) {
                        $item.parent().addClass( 'empty' );
                    }
                });

                current.remove();
            }
        };

        // 添加class给选中的item
        that.addClassOfItem = function ( classStr ) {
            if( current && current.length ) {
                current.addClass( classStr );
            }
        };

        that.removeClassOfItem = function ( classStr ) {
            if( current && current.length ) {
                current.fuzzyRemoveClass( classStr );
            }
        };

        // 添加节点到, custFn为定制化的插入方法，默认为append
        that.creatItemTo = function ( el, sudo, custFn ) {
            var $el = $( el ).closest(itemClass);
            if( !$el.length && !sudo ) {
                return;
            }

            if( !$el.length ) {
                $el = $( el );
            }

            var item = $( TEMP.item );
            custFn = custFn || 'append';

            $el[ custFn ]( item );

            // 移除被加入节点的empty类
            $el.removeClass( 'empty' );

            // 添加新加入节点的empty类
            item.addClass( 'empty' );

            // that.setCurrent( item );
            return item;
        };

        // 将el节点添加到current中
        that.insertToItem = function ( el ) {
            if( current ) {
                current.append( el );
                current.removeClass( 'empty' );
            }
        };

        // 包裹节点
        that.wrapItem = function ( el ) {
            var $el = $( el );

            if( !$el.length ) {
                return;
            }

            // 尝试添加浮动

            var item = $( TEMP.item );

            var tmpItems = $([]);


            // item.insertAfter( $el );

            // $el.appendTo( item );
            $el.wrapAll( item );

            // 查找公共父节点
            $el.each( function ( index, item ) {
                var tmpBox = $( item ).parent().closest( itemClass );
                if( tmpItems.index( tmpBox[0] ) == -1 ) {
                    tmpItems.push( tmpBox[0] );
                }
            });

            // 尝试在公共父节点上添加清除浮动class
            that.tryToAddClear( tmpItems );
        };

        // 尝试添加清浮动class
        that.tryToAddClear = function ( el ) {
            var cL = $( el ).children( '.' + myClass.left + ',.' + myClass.right ).length;
            if( cL ) {
                $( el ).addClass( myClass.clear );
            }
        };

        // 尝试删除“清除浮动”的class
        that.tryToDelClear = function ( el ) {
            var nd = $( el ).closest( itemClass );
            var flag = nd.siblings( '.' + myClass.left + ',.' + myClass.right ).length;
            if( !flag ) {
                that.delClear( nd );
            }
        };

        that.delClear = function ( el ) {
            // closest会从节点本身开始查找
            var box = $( el ).parent().closest(itemClass);

            if( box.length ) {
                box.removeClass( myClass.clear );
            }
        };

        // 添加清除浮动class，再对应父节点上
        that.addClear = function ( el ) {
            // closest会从节点本身开始查找
            var box = $( el ).parent().closest(itemClass);

            if( box.length ) {
                box.addClass( myClass.clear );
            }
        };

        that.toLeft = function ( el ) {
            var $el = $( el ).closest( itemClass );

            if( !$el.length ) {
                return;
            }

            if( $el.hasClass( myClass.left ) ) {
                $el.removeClass( myClass.left );
                that.tryToDelClear( $el );
            }

            else {
                $el.removeClass( myClass.right ).addClass( myClass.left );
                that.addClear( $el );
            }
        };

        that.toRight = function ( el ) {
            var $el = $( el ).closest( itemClass );

            if( !$el.length ) {
                return;
            }

            if( $el.hasClass( myClass.right ) ) {
                $el.removeClass( myClass.right );
                that.tryToDelClear( $el );
            }

            else {
                $el.removeClass( myClass.left ).addClass( myClass.right );
                that.addClear( $el );
            }
        };

        return that;

    });

    module.create();
});