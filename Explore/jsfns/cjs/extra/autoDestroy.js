/**
 * 模块自销毁方法，用于组件的自销毁操作
 */
CJS.Import( 'dom.contains' );
CJS.register( 'extra.autoDestroy', function ( $ ) {
    var autoTimer,
        stepT = 1000;
    var $F = $.FUNCS;

    var $contains = $.logic.dom.contains;

    var main = {
        'data'  : {},
        'state' : 0,
        'len'   : 0,
        'destroy': function ( h ) {
            h && h.destroy && h.destroy();
        },
        'check' : function () {
            if ( main.state ) return;
            main.state = 1;
            autoTimer = setInterval( function () {
                var mData = main.data;
                for ( var i in mData ) {
                    if ( mData.hasOwnProperty( i ) ) {
                        var item = main.data[i];
                        if ( item.isBusy ) {
                            continue;
                        }
                        // 通过检测该节点有无父亲节点来判断是否已经从文档流中删除
                        // 对于document无法检测
                        if ( !$contains( item.node, item.node.ownerDocument.body ) ) {
                            main.destroy( item.handle );
                            delete main.data[i];
                        }
                    }
                }
            }, stepT );
        },
        // @param 组件句柄 依赖节点(不支持document的检测)
        // @return uniKey
        'add': function ( handle, node ) {
            if ( node.nodeType && node.nodeType == 9 ) {
                throw 'Can not support this type!';
            }
            var theKey = 'autoClear_' + $F.getKey();
            var checkNode = node || document.body;
            main.data[theKey] = {
                'isBusy': false,
                'node'  : checkNode,
                'handle': handle
            };
            main.len++;
            main.state || main.check();
            return theKey;
        },
        // 暂停某个模块的自销毁，可复原 @param uniKey
        'pause': function ( theKey ) {
            theKey 
                && main.data[theKey]
                    && ( main.data[theKey].isBusy = true );
        },
        // 恢复某个被暂停的自销毁 @param uniKey
        'start': function ( theKey ) {
            theKey 
                && main.data[theKey]
                    && ( main.data[theKey].isBusy = false );
        },
        // 移除某个自销毁模块，不可复原 @param uniKey
        'remove': function ( theKey ) {
            if( theKey && main.data[theKey] ) {
                delete main.data[theKey];
                main.len--;
                if ( !main.len ) {
                    autoTimer && clearInterval( autoTimer );
                    autoTimer = undefined;
                    main.state = 0;
                }
            }
        }
    };

    return {
        'add'   : main.add,
        'pause' : main.pause,
        'start' : main.start,
        'remove': main.remove
    };
});