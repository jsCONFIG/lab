define(['../lib'], function ($T) {
    var rgBase = function () {
        this.selection = $T.newSelection();
        this.range = $T.getRangeObject(this.selection);
        this.lock = false;
    };

    rgBase.prototype.isLock = function() {
        return this.lock;
    };

    // 储存当前range
    rgBase.prototype.store = function() {
        if( this.isLock() ) {
            return;
        }

        this.selection = $T.newSelection();
        this.range = $T.getRangeObject(this.selection);
        return this;
    };

    // 将当前range转化为selection
    rgBase.prototype.restore = function() {
        if( this.isLock() ) {
            return false;
        }

        var selection = $T.newSelection();

        // 将selection的起点和终点移到存储的range的起点位置
        selection.collapse(this.range.startContainer, this.range.startOffset);

        // 移动selection的终点，完成restore的功能
        selection.extend(this.range.endContainer, this.range.endOffset);
        return selection;
    };

    // 用某个节点包裹选中区域
    rgBase.prototype.wrap = function () {

    };

    window.rg = rgBase;
    return rgBase;
});