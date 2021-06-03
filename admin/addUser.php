<form method="POST" style="background-color: white;">
  <div class="form-group">
    <label for="exampleInputEmail1">Username</label>
    <input type="text" name="user" class="form-control" placeholder="Username" required>
    <small id="emailHelp" class="form-text text-muted"><?php
        if (isset($_SESSION['addError'])){
            echo $_SESSION['addError'];
            unset($_SESSION['addError']);
        }else{
            echo "Be Careful";
        }
?></small>
  </div>
  <div class="form-group">
    <label for="exampleInputPassword1">Password</label>
    <input type="password" name="pass" class="form-control" id="exampleInputPassword1" placeholder="Password" required>
  </div>
  <div class="form-group">
    <label for="exampleInputPassword1">Số Coin</label>
    <!-- <input type="number" name="coin" class="form-control" id="exampleInputPassword1" placeholder="Số coin" required> -->
    <select name="coin" require>
        <option selected value="10000">Người dùng thông thường</option>
        <option value="30000">Người dùng chuẩn</option>
        <option value="50000">Người dùng tài năng</option>
    </select>
  </div>
  <br>
  <button type="submit" name="add" class="btn btn-primary">Thêm Tài Khoản</button>
</form>

<?php
    require "../package/request.php";
    if (isset($_POST['add'])){
        if ((isset($_POST['pass']))&&(isset($_POST['user']))){
            $sql="select * from memInform where username=:userN";
            $stmt=$pdo->prepare($sql);
            $stmt->execute(array(
                ':userN'=>$_POST['user']
            ));
            $rowsDK=$stmt->fetchAll();
            if (isset($rowsDK[0])){
                $_SESSION['addError']= "<p style='color:Tomato;'>Tài Khoản Đã Toàn Tại</p>";
            }
            else{
                $sql="INSERT INTO memInform(username,pass,coin) VALUES (:userW,:passW,:coin)";
                $stmt=$pdo->prepare($sql);
                $stmt->execute(array(
                    ':userW'=>$_POST['user'],
                    ':passW'=>md5($_POST['pass']),
                    ':coin'=>$_POST['coin']
                ));
                $_SESSION['addError']= "Thêm Thành Công";
                
            }
            header( 'Location: ./' ) ;
            exit();
        }
    }
?>