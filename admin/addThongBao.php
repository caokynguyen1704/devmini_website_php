<form method="POST" style="background-color: white;">
  <div class="form-group">
    <label for="exampleInputEmail1">Nội Dung Thông Báo:</label>
    <input type="text" name="content" class="form-control" placeholder="Nội Dung" required>
    <small id="emailHelp" class="form-text text-muted">
        <?php
        if (isset($_SESSION['thongbaoError'])){
            echo $_SESSION['thongbaoError'];
            unset($_SESSION['thongbaoError']);
        }else{
            echo "Be Careful";
        }
        ?>
    </small>
  </div>
  
  <select class="form-select form-select-sm" name="class" aria-label=".form-select-sm example">
        <option selected value="alert-primary">Xanh Dương</option>
        <option value="alert-danger">Đỏ</option>
        <option value="alert-warning">Vàng</option>
        <option value="alert-dark">Đen</option>
    </select>
  
  
  <br>
  <button type="submit" name="thongbao" class="btn btn-primary">Gửi Thông Báo</button>
</form>

<?php
    require "../package/request.php";
    if (isset($_POST['thongbao'])){
        if ((isset($_POST['content']))&&(isset($_POST['class']))){
            $sql="select * from thongbao where ID=:id";
            $stmt=$pdo->prepare($sql);
            $stmt->execute(array(
                ':id'=>1
            ));
            $rowsChange=$stmt->fetchAll();
            if (!(isset($rowsChange[0]))){
                 $sql="INSERT INTO thongbao(ID,class,content) VALUES (1,:class,:content)";
                //$sql="UPDATE thongbao SET ID=1, class=:class ,content=:content  WHERE ID=1";
                $stmt=$pdo->prepare($sql);
                $stmt->execute(array(
                    ':class'=>$_POST['class'],
                    ':content'=>$_POST['content']
                ));
                $_SESSION['thongbaoError']= "Thêm Thông Báo Thành Công";
            }
            else{
                // $sql="INSERT INTO memInform(username,pass,coin) VALUES (:userW,:passW,:coin)";
                $sql="UPDATE thongbao SET class=:class ,content=:content  WHERE ID=1";
                $stmt=$pdo->prepare($sql);
                $stmt->execute(array(
                    ':class'=>$_POST['class'],
                    ':content'=>$_POST['content']
                ));
                $_SESSION['thongbaoError']= "Sửa Thông Báo Thành Công";
                
            }
            header( 'Location: ./' ) ;
            exit();
        }
    }
?>