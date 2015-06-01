CJS.register( 'extra.queue', function ( $ ) {
    var queueTimer, keyMap = {};
    var MAINQUEUE = [],
        MAINSTATE = 0;   // 执行状态: 0 空闲；1 正在执行；2 暂停;

    // 核心模块
    var QUEUE = {
        // 添加进队列， @return uniKey
        'add'   : function ( func, keyPos ) {
            var key = $f.getKey();
            var QL = MAINQUEUE.length
            var pos = ( keyPos < QL ? keyPos : QL );
            MAINQUEUE.splice( pos, 0, {
                'func'  : func,
                'isBusy': false,    // 繁忙状态，预置，用于之后拓展
                'key'   : key
            } ); 
            keyMap[ key ] = pos;
            return key;
        },
        // 获取当前的位置
        'getPos': function ( unikey ) {
            return keyMap[ unikey ];
        },
        // 从队列中移除
        'remove': function ( key ) {
            if ( keyMap[key] ) {
                var posV = keyMap[key];
                delete keyMap[key];
                return MAINQUEUE.splice( posV, 1 );
            }
        },
        'run'   : function () {
            switch ( MAINSTATE ) {
                case 0:
                    // 将状态至为正在执行
                    MAINSTATE = 1;
                    var theQueue = MAINQUEUE;
                    while( theQueue.length ) {
                        if ( MAINSTATE == 2 ) {
                            break;
                        }
                        if ( theQueue[ theQueue.length - 1 ].busyState ) {
                            // 如果当前模块被设置为繁忙，则暂不执行该内容
                        }
                        else {
                            // 弹出方法的同时，将键值映射表中的相关数据清除
                            var tempObj = theQueue.shift();
                            delete keyMap[ tempObj.key ];
                            tempObj.func();
                        }
                    }
                    MAINSTATE = 0;
                    break;
                // 正在运行状态下不进行其它操作
                case 1:
                    break;
                case 2:
                    MAINSTATE = 0;
                    QUEUE.run();
                    break;
                default:
                    break;
            }
        },
        'pause': function () {
            MAINSTATE = 2;
        }
    };
    return QUEUE;
});