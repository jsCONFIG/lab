// 一些基础的 dom 操作

const domUtil = {
	/**
	 * 检测a元素是否包含了b元素
	 * @param {Element} 父元素
	 * @param {Element} 子元素
	 * @return {Boolean} 是否包含
	 */
    contains (a, b) {
        // 标准浏览器支持compareDocumentPosition
        if( a.compareDocumentPosition ){
            return !!( a.compareDocumentPosition(b) & 16 );
        }

        return false;
    }
};

export default domUtil;