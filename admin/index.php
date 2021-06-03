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
   <style>
    .show {
        background-color: white;
        border: 1px solid;
        padding: 10px;
        box-shadow: 5px 10px #888888;
    }
   </style>
   <!--Finish load CSS,JS-->
    <title>Trang Cá Nhân</title>
</head>
<body>
    
        <?php
            if (isset($_SESSION["userCode"])&&(($_SESSION["office"]=="MOD")||($_SESSION["office"]=="Admin"))){
                echo '<div class="container show add">';
                echo "<h2>Thêm Tài Khoản</h2>";
                require "addUser.php";
                echo '<br><button type="button" onclick="showEdit()" class="btn btn-outline-primary">Đi Tới Sửa Tài Khoản</button>';
                echo '<button type="button" onclick="showList()" class="btn btn-outline-primary">Đi Tới Danh Sách Tài Khoản</button>';
                echo '<button type="button" onclick="showThongBao()" class="btn btn-outline-primary">Đi Tới Tạo Thông Báo</button>';
                echo '</div>';

                echo '<div class="container show change" style="display:none;">';
                echo "<h2>Sửa Tài Khoản</h2>";
                require "changePass.php";
                echo '<br><button type="button" onclick="showAdd()" class="btn btn-outline-primary">Đi Tới Thêm Tài Khoản</button>';
                echo '<button type="button" onclick="showList()" class="btn btn-outline-primary">Đi Tới Danh Sách Tài Khoản</button>';
                echo '<button type="button" onclick="showThongBao()" class="btn btn-outline-primary">Đi Tới Tạo Thông Báo</button>';
                echo '</div>';

                echo '<div class="container show list" style="display:none;">';
                echo "<h2>Danh Sách Tài Khoản</h2>";
                require "list.php";
                echo '<br><button type="button" onclick="showAdd()" class="btn btn-outline-primary">Đi Tới Thêm Tài Khoản</button>';
                echo '<br><button type="button" onclick="showEdit()" class="btn btn-outline-primary">Đi Tới Sửa Tài Khoản</button>';
                echo '<button type="button" onclick="showThongBao()" class="btn btn-outline-primary">Đi Tới Tạo Thông Báo</button>';
                echo '</div>';

                echo '<div class="container show thongbao" style="display:none;">';
                echo "<h2>Thông Báo Trang Chủ</h2>";
                require "addThongBao.php";
                echo '<br><button type="button" onclick="showAdd()" class="btn btn-outline-primary">Đi Tới Thêm Tài Khoản</button>';
                echo '<br><button type="button" onclick="showEdit()" class="btn btn-outline-primary">Đi Tới Sửa Tài Khoản</button>';
                echo '<button type="button" onclick="showList()" class="btn btn-outline-primary">Đi Tới Danh Sách Tài Khoản</button>';
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
    <script>
        function showAdd(){
            $(".add").show()
            $(".change").hide()
            $(".list").hide()
            $(".thongbao").hide()
        }
        function showEdit() {
            $(".add").hide()
            $(".change").show()
            $(".list").hide()
            $(".thongbao").hide()
        }
        function showList(){
            $(".list").show()
            $(".add").hide()
            $(".change").hide()
            $(".thongbao").hide()
        }
        function showThongBao(){
            $(".list").hide()
            $(".add").hide()
            $(".change").hide()
            $(".thongbao").show()
        }
    </script>

    <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
    <script src="../js/jquery.countdown.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
</body>
</html>
<?php ob_flush(); ?>