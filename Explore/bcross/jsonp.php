<?php
    $cbkname = $_GET['cb'];
    if( empty( $cbkname ) ) {
        echo '';
        return true;
    }
    $data = array(
        'code' => '100000',
        'msg' => 'jsonp测试msg',
        'data' => '<span>测试数据</span>'
    );
    echo $cbkname . '&&' . $cbkname . '(' . json_encode($data) . ')';
?>