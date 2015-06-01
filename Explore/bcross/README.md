bcross1.0.0
======

处理跨域组件包(Cross-domain package),开发中...


__1、$bcross.postMessage__

    H5提供的postMessage方法，所以兼容性你懂的
    @param inIframe-是否在iframe页面中 ifN-不在iframe内时的iframe节点
    @return Object
    var crossObj = $bcross.postMessage(false, iframeN);
    crossObj.send('test', urlStr);
    crossObj.receive(function (e) {console.log(e);});

__2、$bcross.jsonp__

    jsonp方式
    @param src-跨域地址 data-跨域数据 cbk-回调方法
    var cbk = function (json) {console.log(json)};
    $bcross.jsonp('http://b.com/jsonp.php', {'data' :'test'}, cbk);

__3、$bcross.form__

    表单配合name的aba方式
    @param conf-配置参数
    var fObj = $bcross.form();
    fObj.send( data, {'url' : 'http://b.com/bcross.php', cbk : function (json){}});

__Eg.__

    示例使用方法：
    搭建服务器环境，将DocumentRoot指向当前目录
    设置host: 127.0.0.1 a.com b.com 通过 http://a.com/index.html 访问本页面