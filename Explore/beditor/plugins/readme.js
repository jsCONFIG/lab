/**
 * plugins规范说明：
 * 示例：
 *     define( ['txt'], function () {
 *         // xxx
 *         return {
 *             'name'       : 'align',
 *             // 键盘绑定的事件处理方法
 *             // 接收两个参数：event和keymap
 *             'keyAct'     : function () {},
 *             // 点击按钮的事件处理方法
 *             // 将data-bepg属性设定为对应插件的name值即可
 *             // 接收两个参数：event和对应节点的data-bedata的数据
 *             'btnAct'     : function () {},
 *             'smartKey'   : [],
 *             'destroy'    : function () {}         
 *         };
 *     });
 *
 * 或：
 *     define( ['txt'], {
 *             'name'       : 'align',
 *             'keyAct'     : function () {},
 *             'btnAct'     : function () {},
 *             'smartKey'   : [],
 *             'destroy'    : function () {}   
 *     });
 */