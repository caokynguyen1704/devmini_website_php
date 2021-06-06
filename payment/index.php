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
   <link rel="stylesheet" href="../css/index.css" type="text/css">
    <link rel="stylesheet" href="../css/bootstrap.css" type="text/css">
    <link rel="stylesheet" href="../css/bootstrap.min.css" type="text/css">
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="../js/bootstrap.min.js"></script>
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
    <style>
    .show {
        background-color: white;
        border: 1px solid;
        padding: 10px;
        box-shadow: 5px 10px #888888;
    }
   </style>
   <!--Finish load CSS,JS-->
    <title>DevMini - MiniWorld Việt Nam</title>
</head>
<body>
<header>
<p>Hãy ủng hộ website lên gói Hosting Pro (0/600.000đ)</p>     
</header>
        <?php
        require "../package/request.php";
           if (isset($_SESSION["userCode"])){
            echo '<div class="container show">';
                require "card.php";
            echo '</div>';
            }else{
                echo '<div class="container fullScreen">';
                require "../package/login.php";
                echo '</div>';
            }
        ?>
    
    
    <footer>
	    <p onclick="window.location.replace('../')";>
		    VỀ TRANG CHỦ
	    </p>
    </footer>
</body>
</html>
<?php ob_flush(); ?>