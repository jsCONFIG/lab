/**
 * UI组件
 * @type {Object}
 */
var $ = require('fe:widget/js/base/jquery.js');
module.exports = {
    mask: require('./mask.js'),
    base: require('./base.js'),
    layer: require('./layer.js'),
    autolayer: require('./autolayer.js'),
    screenTip: require('./screenTip.js'),
    alert: require('./alert.js'),
    confirm: require('./confirm.js')
};