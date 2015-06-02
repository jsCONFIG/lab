/**
 * 处理帧函数
 */
define(function (require, exports, module) {
    var tools = require('./tools');

    // 此处注意它们存在的区别
    var raf = window.requestAnimationFrame
        || window.msRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.webkitRequestAnimationFrame;

    // 取消方式
    var cRaf = window.cancelAnimationFrame
        || window.msCancelAnimationFrame
        || window.mozCancelAnimationFrame
        || window.webkitCancelAnimationFrame;

    var rafFrame = function (fn) {
        var self = this;

        // 这里将方法直接放在对象内部，缩短查找链
        var callBackFn = function (cbk) {
            var returnKey = fn && fn();
            if (self.state === 'stop') {
                self.timer = undefined;
                return;
            }
            self.timer = raf(callBackFn);
        };
        this.fn = fn;
        this.callBackFn = callBackFn;

        // 增加状态记录，辅助帧方法在执行时的暂停操作
        this.state = 'init';
        callBackFn(fn);
    };

    rafFrame.prototype.cancel = function() {
        this.timer && cRaf(this.timer);
        this.timer = undefined;
        this.state = 'stop';
    };

    rafFrame.prototype.reback = function() {
        if (!this.timer) {
            this.state = 'busy';
            this.callBackFn(this.fn);
        }
    };

    // 封装定时器方法，保证60帧
    var interval = function (fn) {
        this.timer = setInterval(fn, 17);
        this.fn = fn;
    };

    interval.prototype.cancel = function() {
        this.timer && clearInterval(this.timer);
        this.timer = undefined;
    };

    interval.prototype.reback = function() {
        if (!this.timer) {
            this.timer = setInterval(this.fn, 17);
        }
    };

    var unifiedFrame = function (fn) {
        if (raf) {
            return new rafFrame(fn);
        }
        else {
            return new interval(fn);
        }
    };

    return unifiedFrame;

});