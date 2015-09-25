const spec = {
    DEFAULT_PARAMS: {
        left: 0,
        top: 0,
        width: 200,
        height: 100
    },
    STATUS: {
        INIT: 'INIT',
        IDLE: 'IDLE',
        DRAGING: 'DRAGING',
        RESIZING: 'RESIZING',
        // 稳定态之前的状态，短暂的
        BEFORE_IDLE: 'BEFORE_IDLE'
    }
};
export default spec;