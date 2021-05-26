<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
   <!--Load CSS, JS-->
   <link rel="stylesheet" href="css/index.css" type="text/css">
    <link rel="stylesheet" href="css/boostrap.css" type="text/css">
    <link rel="stylesheet" href="css/bootstrap.min.css" type="text/css">
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="js/bootstrap.min.js"></script>
   <!--Finish load CSS,JS-->
    <title>Trang Cá Nhân</title>
</head>
<body>
    
        <?php
            if (isset($_SESSION["userCode"])){
                require "package/profile.php";
            }else{
                echo '<div class="container fullScreen">';
                require "package/login.php";
                echo '</div>';
            }
        ?>
    
</body>
</html>