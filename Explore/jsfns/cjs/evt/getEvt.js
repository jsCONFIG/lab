/**
 * 获取event对象
 * @param e
 * @return event
 */
CJS.register( 'evt.getEvt', function ( $ ) {
    return function ( e ) {
        var evt = e || window.event;
        var target  = evt.target || evt.srcElement,
            type    = evt.type,
            left    = evt.X || evt.clientX,
            top     = evt.Y || evt.clientY,
            temp;// 储存临时的relatedTarget对象
        // 用于支持IE浏览器等不支持relatedTarget属性的浏览器
        if( type == 'mouseout' || type == 'mouseover' ){
            temp = evt.relatedTarget || (type == 'mouseout' ? evt.toElement : evt.fromElment);
        }
        evt.l = left;
        evt.t = top;
        evt.relatedTarget = temp;
        evt.target = target;
        return evt;
    };
});