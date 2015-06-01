CJS.register( 'ani.algorithm', function ( $ ) {

    /* 
     * 获取初始的改变大小， 可引申为初速度
     */
    return {
        // 匀变速运动
        'uniformlyChange' : function ( S, T, a ) {
            return ( ( S / T ) - ( a * T ) / 2 );
        },

        // 半段匀加（减）速运动，半段匀减（加）速运动
        'uniformlyAddMinus' : function ( S, T, a ) {
            return ( ( S / (  2 * T ) ) - ( a * T ) / 2 );
        },

        // 匀速运动
        'uniform' : function ( S, T ) {
            return ( S / T );
        },

        // 初速度为0的变速运动的加速度
        'acceleration' : function ( S, T ) {
            return ( ( 2 * S ) / ( T * T ) );
        } 
    }
} );