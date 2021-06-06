<?php
require "../package/request.php";
if (isset($_POST)) {
    if (isset($_POST['callback_sign'])) {

        ///Chỗ này để lưu lại biến post sang cho dễ làm, chạy web thực nhớ bỏ đi
        $myfile = fopen("inform.txt", "w") or die("Unable to open file!");
        $txt = "form|".$_POST['status'] . "|" . $_POST['message'] . "\n";
        fwrite($myfile, $txt);
        fclose($myfile);

        /// status = 1 ==> thẻ đúng
        /// status = 2 ==> thẻ sai
        /// status = 3 ==> thẻ ko dùng đc
        /// status = 99 ==> thẻ chờ xử lý

        //// Kết quả trả về sẽ có các trường như sau:
        $partner_key = 'b4fdec21ba787ab7030fbcd599fc8c1e';

        $callback_sign = md5($partner_key . $_POST['code'] . $_POST['serial']);
        if ($_POST['callback_sign'] == $callback_sign) {
            
            $getdata['status'] = $_POST['status'];
            $getdata['message'] = $_POST['message'];
            $getdata['request_id'] = $_POST['request_id'];   /// Mã giao dịch của bạn
            $getdata['trans_id'] = $_POST['trans_id'];   /// Mã giao dịch của website ppay.vn
            $getdata['declared_value'] = $_POST['declared_value'];  /// Mệnh giá mà bạn khai báo lên
            $getdata['value'] = $_POST['value'];  /// Mệnh giá thực tế của thẻ
            $getdata['amount'] = $_POST['amount'];   /// Số tiền bạn nhận về (VND)
            $getdata['code'] = $_POST['code'];   /// Mã nạp
            $getdata['serial'] = $_POST['serial'];  /// Serial thẻ
            $getdata['telco'] = $_POST['telco'];   /// Nhà mạng
            print_r($getdata);
            $sql="INSERT INTO callback(statusCard,messageCard,requestId,transId,declaredValue,realValue,amount,codeCard,serialCard,telco) VALUES (:val1 ,:val2 ,:val3 ,:val4 ,:val5 ,:val6 ,:val7 ,:val8 ,:val9 ,:val10 )";
            $stmt=$pdo->prepare($sql);
            $stmt->execute(array(
                ':val1'=>$_POST['status'],
                ':val2'=>$_POST['message'],
                ':val3'=>$_POST['request_id'],
                ':val4'=>$_POST['trans_id'],
                ':val5'=>$_POST['declared_value'],
                ':val6'=>$_POST['value'],
                ':val7'=>$_POST['amount'],
                ':val8'=>$_POST['code'],
                ':val9'=>$_POST['serial'],
                'val10'=>$_POST['telco']
            ));

            $sql1="UPDATE history SET statusCard=:statusCard ,messageCard=:messageCard ,realValue=:realValue ,amount=:amount ,codeCard=:codeCard ,serialCard=:serialCard ,telco=:telco WHERE requestId=:requestId";
            $stmt1=$pdo->prepare($sql1);
            $stmt1->execute(array(
                ':statusCard'=>$_POST['status'],
                ':messageCard'=>$_POST['message'],
                ':requestId'=>$_POST['request_id'],
                ':realValue'=>$_POST['value'],
                ':amount'=>$_POST['amount'],
                ':codeCard'=>$_POST['code'],
                ':serialCard'=>$_POST['serial'],
                ':telco'=>$_POST['telco']
            ));

            $mystring = $_POST['request_id'];
            $findme   = 'l';
            $id="";
            $pos = strpos($mystring, $findme);
            for ($i=0;$i<$pos;$i++){
                $id=$id.$mystring[$i];
            }
            echo "you id is ".$id;
            $sql_user="select * from memInform where ID=:id";
            $stmt_user=$pdo->prepare($sql_user);
            $stmt_user->execute(array(
                ':id'=>$id
            ));
            $rows = $stmt_user->fetchAll(PDO::FETCH_ASSOC);
            echo "Trước: ".intval($rows[0]['coinVIP']);
            echo "<br>Sau: ".intval(intval($rows[0]['coinVIP'])+intval($_POST['value']));

            $sql_up="UPDATE memInform SET totalCoinVIP=:total, coinVIP=:coinVIP WHERE ID=:id";
            $stmt_up=$pdo->prepare($sql_up);
            $stmt_up->execute(array(
                ':total'=>intval(intval($rows[0]['totalCoinVIP'])+intval($_POST['value'])),
                ':coinVIP'=>intval(intval($rows[0]['coinVIP'])+intval($_POST['value'])),
                ':id'=>$id
            ));
            
        }

    }


}

?>





<?php

$post = json_decode(file_get_contents('php://input'), true);

if (isset($post)) {
    if (isset($post['callback_sign'])) {

        ///Chỗ này để lưu lại biến post sang cho dễ làm, chạy web thực nhớ bỏ đi
        $myfile = fopen("inform.txt", "w") or die("Unable to open file!");
        $txt = "json|".$post['status'] . "|" . $post['message'] . "\n";
        fwrite($myfile, $txt);
        fclose($myfile);

        /// status = 1 ==> thẻ đúng
        /// status = 2 ==> thẻ sai
        /// status = 3 ==> thẻ ko dùng đc
        /// status = 99 ==> thẻ chờ xử lý

        //// Kết quả trả về sẽ có các trường như sau:
        $partner_key = 'b4fdec21ba787ab7030fbcd599fc8c1e';

        $callback_sign = md5($partner_key . $post['code'] . $post['serial']);
        if ($post['callback_sign'] == $callback_sign) {
            
            $getdata['status'] = $post['status'];
            $getdata['message'] = $post['message'];
            $getdata['request_id'] = $post['request_id'];   /// Mã giao dịch của bạn
            $getdata['trans_id'] = $post['trans_id'];   /// Mã giao dịch của website ppay.vn
            $getdata['declared_value'] = $post['declared_value'];  /// Mệnh giá mà bạn khai báo lên
            $getdata['value'] = $post['value'];  /// Mệnh giá thực tế của thẻ
            $getdata['amount'] = $post['amount'];   /// Số tiền bạn nhận về (VND)
            $getdata['code'] = $post['code'];   /// Mã nạp
            $getdata['serial'] = $post['serial'];  /// Serial thẻ
            $getdata['telco'] = $post['telco'];   /// Nhà mạng
            print_r($getdata);
            $sql="INSERT INTO callback(statusCard,messageCard,requestId,transId,declaredValue,realValue,amount,codeCard,serialCard,telco) VALUES (:val1 ,:val2 ,:val3 ,:val4 ,:val5 ,:val6 ,:val7 ,:val8 ,:val9 ,:val10 )";
            $stmt=$pdo->prepare($sql);
            $stmt->execute(array(
                ':val1'=>$post['status'],
                ':val2'=>$post['message'],
                ':val3'=>$post['request_id'],
                ':val4'=>$post['trans_id'],
                ':val5'=>$post['declared_value'],
                ':val6'=>$post['value'],
                ':val7'=>$post['amount'],
                ':val8'=>$post['code'],
                ':val9'=>$post['serial'],
                'val10'=>$post['telco']
            ));

            $sql1="UPDATE history SET statusCard=:statusCard ,messageCard=:messageCard ,realValue=:realValue ,amount=:amount ,codeCard=:codeCard ,serialCard=:serialCard ,telco=:telco WHERE requestId=:requestId";
            $stmt1=$pdo->prepare($sql1);
            $stmt1->execute(array(
                ':statusCard'=>$post['status'],
                ':messageCard'=>$post['message'],
                ':requestId'=>$post['request_id'],
                ':realValue'=>$post['value'],
                ':amount'=>$post['amount'],
                ':codeCard'=>$post['code'],
                ':serialCard'=>$post['serial'],
                ':telco'=>$post['telco']
            ));

            $mystring = $post['request_id'];
            $findme   = 'l';
            $id="";
            $pos = strpos($mystring, $findme);
            for ($i=0;$i<$pos;$i++){
                $id=$id.$mystring[$i];
            }
            echo "you id is ".$id;
            $sql_user="select * from memInform where ID=:id";
            $stmt_user=$pdo->prepare($sql_user);
            $stmt_user->execute(array(
                ':id'=>$id
            ));
            $rows = $stmt_user->fetchAll(PDO::FETCH_ASSOC);
            echo "Trước: ".intval($rows[0]['coinVIP']);
            echo "<br>Sau: ".intval(intval($rows[0]['coinVIP'])+intval($post['value']));

            $sql_up="UPDATE memInform SET totalCoinVIP=:total, coinVIP=:coinVIP WHERE ID=:id";
            $stmt_up=$pdo->prepare($sql_up);
            $stmt_up->execute(array(
                ':total'=>intval(intval($rows[0]['totalCoinVIP'])+intval($post['value'])),
                ':coinVIP'=>intval(intval($rows[0]['coinVIP'])+intval($post['value'])),
                ':id'=>$id
            ));
            
        }

    }


}
?>