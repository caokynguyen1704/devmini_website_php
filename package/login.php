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
        require "package/request.php";
            if ((isset($_POST))&&(isset($_POST['username']))&&(isset($_POST['password']))){
                $sql="select * from memInform where username= :user and pass= :pass";
                $stmt=$pdo->prepare($sql);
                $stmt->execute(array(
                    ':user'=>$_POST['username'],
                    ':pass'=>md5($_POST['password'])
                ));
                $rows=$stmt->fetchAll();
                if(count($rows)==1){
                    unset($_SESSION['userCode']);
                    $_SESSION['userCode']=$rows[0]['ID'];

                    $sql='UPDATE memInform SET lastLogin=CURRENT_DATE() WHERE ID=:id';
                    $stmt=$pdo->prepare($sql);
                    $stmt->execute(array(
                      ':id'=>$_SESSION['userCode']
                    ));
                    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

                }else{
                    $_SESSION["errorLogin"] = "Sai Thông Tin Đăng Nhập.";
                }
                
                header( 'Location: ./' ) ;
                exit;
            }
?>