<?php 
ob_start(); 
session_start();

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
   <!--Load CSS, JS-->
    
    <meta property="og:type"               content="article" />
    <meta property="og:title"              content="Luascript" />  
    <meta property="og:description"        content="DevMini - Cộng Đồng Lập Trình Và Công Nghệ MiniWorld" />
    <meta property="og:image"              content="https://cdn-mnweb.miniworldgame.com/wp-content/uploads/2019/07/Multiplayer.jpg" />
    
    <script type="text/javascript">
        window.oncontextmenu = function () {
            return false;
        }
        $(document).keydown(function (event) {
            if (event.keyCode == 123) {
                return false;
            }
            else if ((event.ctrlKey)||(event.ctrlKey && event.shiftKey && event.keyCode == 73) || (event.ctrlKey && event.shiftKey && event.keyCode == 74)) {
                return false;
            }
        });
    </script>
   <!--Finish load CSS,JS-->
    <title>DevMini</title>
</head>
<body>

<?php
        header("Location: https://dev-mw.000webhostapp.com/");
        exit();
?>
</body>
</html>
<?php ob_flush(); ?>