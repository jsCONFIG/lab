<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>postMsg</title>
</head>
<body>
    <a href="javascript:void(0);" id="send">发送消息到父级</a>
    <script type="text/javascript" src="bcross-1.0.0.js"></script>
    <script type="text/javascript">
    var crossObj = $bcross.postMsg( true );
    document.getElementById('send').onclick = function () {
        crossObj.send( '"msg from postMsg.php"', 'http://a.com/index.html');
    };
    crossObj.receive(function (e){
        alert('postMsg.php say: data is ' + e.data );
    });
    </script>
</body>
</html>