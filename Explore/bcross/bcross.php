<?php 
    /**
     * 此段代码用于在第三方上部署，
     * 实现cross.html跨域文件里的内容
     * 的模板文件，也是第三方接收数据的地址
     * */

    /**
     * 接收数据的相关操作和处理
     **/
    // eg.
    // $data_get    = $_GET['data'];
    // $data_post   = $_POST['data'];
    // $data_files  = $_FILES['filename'];
    // $result      = Dw_Eg::insert($data);
    // iframe的src地址
    if( empty( $_GET ) || !isset( $_GET['cb'] ) || !isset( $_GET['back_url'] ) ) {
        return true;
    }

    // js使用escape对back_url进行编码，
    // 确保back_url中的特殊字符不会影响query参数的正常解析
    function unescape($str) {  
        $str = rawurldecode ( $str );  
        preg_match_all ( "/%u.{4}|&#x.{4};|&#\d+;|.+/U", $str, $r );  
        $ar = $r [0];  
        foreach ( $ar as $k => $v ) {  
            if (substr ( $v, 0, 2 ) == "%u")  
                $ar [$k] = iconv ( "UCS-2", "GBK", pack ( "H4", substr ( $v, - 4 ) ) );  
            elseif (substr ( $v, 0, 3 ) == "&#x")  
                $ar [$k] = iconv ( "UCS-2", "GBK", pack ( "H4", substr ( $v, 3, - 1 ) ) );  
            elseif (substr ( $v, 0, 2 ) == "&#") {  
                $ar [$k] = iconv ( "UCS-2", "GBK", pack ( "n", substr ( $v, 2, - 1 ) ) );  
            }  
        }  
        return join ( "", $ar );  
    }
    $back_url = unescape( $_GET['back_url'] );
    $cb = $_GET['cb'];

    /**
     * 数据处理之后的反馈
     **/
    $result = array(
        'code' => 100000,
        'msg' => 'testmsg',
        'data'=> 'data'
    );

    /**
     * 下面这段必须
     * start
     */
    $script_str = 'var node = document.createElement(/MSIE [7,6].0/.test(navigator.userAgent) ? \'<iframe name=' . json_encode( $result ) . '>\' : "iframe");node.setAttribute( \'name\', \'' . json_encode( $result ) . '\' );';
    $script_str .= 'node.src="' . $back_url . (strpos($back_url, '?') === false ? '?' : '&') . 'cb=' . $cb. '";';
    $script_str .= 'document.body.appendChild(node);';
    // 利用js脚本实现模板设置和属性设置
    echo '<html><head>temp</head><body><script type="text/javascript">' . $script_str . '</script></body>';
    /**
     * end
     */
    return true;
 ?>