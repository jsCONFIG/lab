var TEMP = '<div id="ui-mask"></div>';

var mask;
var show = function () {
    if (!mask) {
        mask = $(TEMP);
        $('body').append(mask);
    }
    mask.show();
};

var hide = function () {
    mask && mask.hide();
};

var destroy = function () {
    mask && mask.remove();

    mask = null;
};

module.exports = {
    show: show,
    hide: hide,
    destroy: destroy
};