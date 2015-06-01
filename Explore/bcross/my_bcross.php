<?php 
    /**
     * 本文件为本域的跨域文件
     * 对应于跨域中的back_url
     */
    var_dump($_GET);
    if( empty( $_GET ) || !isset( $_GET['cb'] ) ) {
        return true;
    }
    $cb_fn = $_GET['cb'];
    $script_str = 'parent.parent.window.' . $cb_fn . '&&parent.parent.window.' . $cb_fn . '(window.name)';
    echo '<script type="text/javascript">try{' . $script_str . '}catch(e){}</script>';
    return true;
 ?>