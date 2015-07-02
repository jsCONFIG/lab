var autolayer = require('./autolayer.js');

module.exports = function ( msg, conf ) {
    var cf = conf || {};
    cf.screenCenter = true;
    return autolayer( msg, cf );
};