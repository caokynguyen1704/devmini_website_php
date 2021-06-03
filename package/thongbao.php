<?php
    require "package/request.php";
    
    $sql="select * from thongbao where ID=:id";
    $stmt=$pdo->prepare($sql);
    $stmt->execute(array(
        ':id'=>1
    ));
    $rows_thongbao= $stmt->fetchAll(PDO::FETCH_ASSOC);
    if (isset($rows_thongbao[0])){
        echo '<div class="alert '.$rows_thongbao[0]['class'].'" style="height:50px" role="alert"><marquee>
                '.$rows_thongbao[0]['content'].'</marquee>
                </div>';
    }
?>