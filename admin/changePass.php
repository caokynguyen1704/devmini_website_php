<form method="POST" style="background-color: white;">
  <div class="form-group">
    <label for="exampleInputEmail1">Username cần đổi:</label>
    <input type="text" name="userChange" class="form-control" placeholder="Username" required>
    <small id="emailHelp" class="form-text text-muted">
        <?php
        if (isset($_SESSION['changeError'])){
            echo $_SESSION['changeError'];
            unset($_SESSION['changeError']);
        }else{
            echo "Be Careful";
        }
        ?>
    </small>
  </div>
  
  <div class="form-group">
    <label for="exampleInputPassword1">Username mới:</label>
    <input type="text" name="newUserChange" class="form-control" id="exampleInputPassword1" placeholder="New Username" required>
  </div>
  <div class="form-group">
    <label for="exampleInputPassword1">Password mới:</label>
    <input type="text" name="passChange" class="form-control" id="exampleInputPassword1" placeholder="New Password" required>
  </div>
  
  <br>
  <button type="submit" name="change" class="btn btn-primary">Đổi Mật Khẩu</button>
</form>

<?php
    require "../package/request.php";
    if (isset($_POST['change'])){
        if ((isset($_POST['newUserChange']))&&(isset($_POST['passChange']))&&(isset($_POST['userChange']))){
            $sql="select * from memInform where username=:userChange";
            $stmt=$pdo->prepare($sql);
            $stmt->execute(array(
                ':userChange'=>$_POST['userChange']
            ));
            $rowsChange=$stmt->fetchAll();
            if (!(isset($rowsChange[0]))){
                $_SESSION['changeError']= "<p style='color:Tomato;'>Không Tìm Thấy Tài Khoản</p>";
            }
            else{
                // $sql="INSERT INTO memInform(username,pass,coin) VALUES (:userW,:passW,:coin)";
                $sql="UPDATE memInform SET username=:newUser ,pass=:newPass  WHERE ID=:id";
                $stmt=$pdo->prepare($sql);
                $stmt->execute(array(
                    ':newUser'=>$_POST['newUserChange'],
                    ':newPass'=>md5($_POST['passChange']),
                    ':id'=>$rowsChange[0]['ID']
                ));
                $_SESSION['changeError']= "Sửa Thành Công<br><b>User mới: </b>".$_POST['newUserChange']."<br><b>Pass mới: </b>".$_POST['passChange'];
                
            }
            header( 'Location: ./' ) ;
            exit();
        }
    }
?>