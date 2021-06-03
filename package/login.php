
<link rel="stylesheet" href="css/login.css" type="text/css">
<div class="wrapper fadeInDown loginDiv">
  <div id="formContent">
  <br>
    <div class="fadeIn first">
      <img src="img/iconLogin.png" height="40px" id="icon" alt="User Icon" />
      <b>Đăng Nhập</b>
    </div>
    <form method="POST">
      <input type="text" id="login" class="fadeIn second" name="username" placeholder="Username" required>
      <input type="password" id="password" class="fadeIn third" name="password" placeholder="Password" required>
      <input type="submit" class="fadeIn fourth" value="Đăng Nhập">
    </form>
    <?php
        if (isset($_SESSION['errorLogin'])){
            echo $_SESSION['errorLogin'];
            unset($_SESSION['errorLogin']);
        }
        
    ?>
    <div id="formFooter">
      <div class="underlineHover" href="#" onclick="showHelp()" >Cần hỗ trợ?</div>
      <script>
          function showHelp(){
              $(".loginDiv").hide();
              $(".helpDiv").show();
          }
      </script>
    </div>
  </div>
</div>



<!--Help-->
<div class="wrapper fadeInDown helpDiv">
  <div id="formContent">
    <div class="fadeIn first">
      <b>Hỗ Trợ</b>
    </div>
    <br>
        <ul>
            <li><b>Không có tài khoản?</b><br> Liên lạc với Quản Trị Viên bằng liên kết bên dưới.</li>
            <li><b>Quên thông tin tài khoản?</b><br> Liên hệ người cung cấp tài khoản cho bạn để tiến hành lấy lại tài khoản.</li>
            <li><b>Tài khoản bị xoá</b><br> Tất cả người dùng không hoạt động từ 15 ngày sẽ bị hệ thống tự động xoá tài khoản.</li>
        </ul>
    <div id="formFooter">
      <div class="underlineHover" href="#" onclick="showLogin()" >Quay Lại</div>
      <script>
          function showLogin(){
              $(".helpDiv").hide();
              $(".loginDiv").show();
          }
      </script>
    </div>
  </div>
</div>



<?php
        
            if ((isset($_POST))&&(isset($_POST['username']))&&(isset($_POST['password']))){
              $sql_login="SELECT * from memInform where username= :user1 and pass= :pass";
              $stmt_login=$pdo->prepare($sql_login);
              $stmt_login->execute(array(
                ':user1'=>$_POST['username'],
                ':pass'=>md5($_POST['password'])
              ));
              $rows_login=$stmt_login->fetchAll(PDO::FETCH_ASSOC);
              sleep(1);
              if(count($rows_login)==1){
                unset($_SESSION['userCode']);
                $_SESSION['userCode']=$rows_login[0]['ID'];
                unset($_SESSION['office']);
                $_SESSION['office']=$rows_login[0]['office'];
                $sql_login1='UPDATE memInform SET lastLogin=CURRENT_DATE() WHERE ID=:id';
                $stmt_login1=$pdo->prepare($sql_login1);
                $stmt_login1->execute(array(
                  ':id'=>$_SESSION['userCode']
                ));
                //$stmt_login1->fetchAll(PDO::FETCH_ASSOC);
                
                //header("Location: ./index.php") ;
                //exit(); 
              }else{
                $_SESSION["errorLogin"] = "Sai Thông Tin Đăng Nhập.";
              }
              header("Location: ./index.php") ;
              exit();  
            }
            
?>