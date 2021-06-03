<?php 
session_start();
ob_start(); 
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
    <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="../js/bootstrap.min.js"></script>
    <script src="list.js"></script>
    <link rel="stylesheet" href="pixel.css" type="text/css">
    <script src="../js/jquery.countdown.js"></script>
   
   <!--Finish load CSS,JS-->
    <title>Trang Cá Nhân</title>
</head>
<body>
    
        <?php
            if (isset($_SESSION["userCode"])&&(($_SESSION["office"]=="MOD")||($_SESSION["office"]=="Admin"))){
                echo '<div class="container">';
                require "adminzzz.php";
                echo '</div>';
            }else{
                echo '<div class="container fullScreen">';
                require "./package/login.php";
                echo '</div>';
            }
        ?>
    <footer>
	    <p onclick="window.location.replace('../')";>
		    VỀ TRANG CHỦ
	    </p>
    </footer>
    <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
    <script src="../js/jquery.countdown.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="list.js"></script>
    <script src="pixel.js"></script>
</body>
</html>
<?php ob_flush(); ?>