/**
 * 用于合并两个url的query值，取第一个的url地址
 * @param urlString urlString|Json(第二个参数可为url地址或object对象)
 */
CJS.Import( 'extra.parseUrl' );
CJS.Import( 'obj.merge' );
CJS.register( 'extra.mergeUrl', function ( $ ) {
    var $f          = $.FUNCS,
        $l          = $.logic,
        $parseUrl   = $l.extra.parseUrl;

    return function ( rootUrl, newUrl ) {
        var rootParse   = $parseUrl( rootUrl ),
            newParse    = $parseUrl( newUrl ),
            newJson,
            rootJson;

        // 用于支持第二个参数为对象的情况
        if ( $f.isWhat( newUrl, 'object' ) ) {
            newJson = newUrl;
            newParse = true;
        }
        if ( rootParse && newParse ) {
            rootJson = $f.strToJson( rootParse.query );
            newJson  = newJson || $f.strToJson( newParse.query );
            var lastestQuery = $f.jsonToStr( $l.obj.merge( rootJson, newJson ) );
            return rootParse.protocol + '://' + rootParse.host + (rootParse.port ? (':' + rootParse.port) : '') + (lastestQuery ? ('?' + lastestQuery):'') + (rootParse.hash ? ( '#' + rootParse.hash ) : '');
        }
    };
});