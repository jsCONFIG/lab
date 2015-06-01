/*
 * 动画队列，可支持不同节点的动画行为
 * @param 针对动画队列做特殊处理的参数对象数组，其设置参考action方法的参数设定
 * queue 说明：
 *      除增加node和style键值之外，其它同action的option参数
        var queue = $.logic.ani.queue([
            // 动画一
            {
                'node'          : div,                  // 待执行动画的节点                     <必须>
                'style'         : {'height':200px},     // 动画欲达到的样式                     <必须>
                'time'          : 2000,                 // 本次动画的持续时间                   <可选>
                'type'          : 'uniform',            // 动画类型                             <可选>
                'stepT'         : 50,                   // 每次改变的时间间隔,可理解为帧率的倒数<可选>
                'acceleration'  : 10,                   // 动画加速度                           <可选>
                'threshold'     : 2,                    // 目标阈值                             <可选>
                'callback'      : function () {}        // 单个动画的回调                       <可选>
            },
            // 动画二
            {
                xxxxxxxxxxx
            }
        ], function(){});
 */
CJS.Import( 'evt.event' );
CJS.Import( 'extra.destroy' );
CJS.Import( 'ani.action' );
CJS.register( 'ani.queue', function ( $ ) {
    var $F              = $.FUNCS,
        $L              = $.logic,
        $action         = $L.ani.action,
        $evt            = $L.evt.event,
        $custEvt        = $evt.custEvt,
        $destroy        = $L.extra.destroy;
    return function ( queue, callBack ) {
        if ( !$F.isArray( queue ) ) {
            throw '[ani.queue]: need array as first parameter';
        }
        var queueL      = queue.length,
            actions     = [],
            that        = {},
            currentIndex= 0,
            callBack    = (callBack || function(){}),
            destroyKey  = false;

        // 用于在队列中拉取下一个动画执行
        var callNext = function ( spec ) {
            // 索引+1
            currentIndex++;
            var currentAct = queue[currentIndex];
            if ( currentAct ) {
                actionForQueue( currentAct );
            }
            else {
                callBack( queue );
            }
        };
        /**
         * 封装用于动画队列处理的action方法
         * @param {同action的opt，同时将node封装进其中，key为node} 待实现的样式对象
         */
        var actionForQueue = function ( opt ) {
            if ( opt ) {
                var tempAct = $action( opt.node, opt );
                actions.push( tempAct );
                $custEvt.add( tempAct, 'actionEnd', callNext );
                tempAct.play( opt.style );
            }
        };

        that.start = function () {
            actionForQueue( queue[0] );
        };
        that.destroy = function () {
            $destroy( actions );
            queue.length = 0;
        };
        return that;
    }
} )