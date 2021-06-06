<?php
require "../package/request.php";
$partner_key = 'b4fdec21ba787ab7030fbcd599fc8c1e';
echo "hey-".md5($partner_key . "611391964135191". "10006883235155");

if (isset($_POST['submit'])) {
    if (!isset($_POST['telco']) || !isset($_POST['amount']) || !isset($_POST['serial']) || !isset($_POST['code'])) {
        $err = 'Bạn cần nhập đầy đủ thông tin';
    } else {
        $sql="select * from memInform where ID=:id";
        $stmt=$pdo->prepare($sql);
        $stmt->execute(array(
            ':id'=>$_SESSION['userCode']
        ));
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);


        $request_id = $rows[0]['ID']."luascript".$rows[0]['sodonhang'];  //Mã đơn hàng của bạn

        $sql_up="UPDATE memInform SET sodonhang=:sodonhang WHERE ID=:id";
        $stmt_up=$pdo->prepare($sql_up);
        $stmt_up->execute(array(
            ':sodonhang'=>$rows[0]['sodonhang']+1,
            ':id'=>$_SESSION['userCode']
        ));


        $command = 'charging';  // Nap the
        $url = 'https://ppay.vn/chargingws/v2';
        $partner_id = '5097082261';
        $partner_key = 'b4fdec21ba787ab7030fbcd599fc8c1e';

        $dataPost = array();
        $dataPost['request_id'] = $request_id;
        $dataPost['code'] = $_POST['code'];
        $dataPost['partner_id'] = $partner_id;
        $dataPost['serial'] = $_POST['serial'];
        $dataPost['telco'] = $_POST['telco'];
        $dataPost['command'] = $command;
        ksort($dataPost);
        $sign = $partner_key;
        foreach ($dataPost as $item) {
            $sign .= $item;
        }
        
        $mysign = md5($sign);

        $dataPost['amount'] = $_POST['amount'];
        $dataPost['sign'] = $mysign;

        $data = http_build_query($dataPost);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        $actual_link = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
        curl_setopt($ch, CURLOPT_REFERER, $actual_link);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $result = curl_exec($ch);
        curl_close($ch);

        $obj = json_decode($result);
        $sql_his="INSERT INTO history(idUser,statusCard,messageCard,requestId,amount,codeCard,serialCard,telco) VALUES (:val1 ,:val2 ,:val3 ,:val4 ,:val5 ,:val6 ,:val7 ,:val8 )";
        $stmt_his=$pdo->prepare($sql_his);
    // idUser INT,
    // statusCard int,
    // messageCard varchar(255) DEFAULT "Đang Xử Lý",
    // requestId varchar(255),
    // amount INT,
    // codeCard VARCHAR(255),
    // serialCard VARCHAR(255),
    // telco VARCHAR(255),
    $maloi="Đang Xử Lý";
    if ($obj->status == 99){
        $maloi="Gửi thẻ thành công, đợi duyệt.";
    }elseif ($obj->status == 1){
        $maloi="Thành công";
    }elseif ($obj->status == 2){
        $maloi="Thành công nhưng sai mệnh giá";
    }elseif ($obj->status == 3){
        $maloi="Thẻ lỗi";
    }elseif ($obj->status == 4){
        $maloi="Bảo trì";
    }else{
        $maloi="Lỗi";
    }
        $stmt_his->execute(array(
            ':val1'=>$_SESSION['userCode'],
            ':val2'=>$obj->status,
            ':val3'=>$maloi,
            ':val4'=>$request_id,
            ':val5'=>$_POST['amount'],
            ':val6'=>$_POST['code'],
            ':val7'=>$_POST['serial'],
            ':val8'=>$_POST['telco']
        ));
        header("Location: ../profile.php") ;
        exit();  
        // if ($obj->status == 99) {
        //     //Gửi thẻ thành công, đợi duyệt.
        //     echo '<pre>';
        //     print_r($obj);
        //     echo '</pre>';
        // } elseif ($obj->status == 1) {
        //     //Thành công
        //     echo '<pre>';
        //     print_r($obj);
        //     echo '</pre>';
        // } elseif ($obj->status == 2) {
        //     //Thành công nhưng sai mệnh giá
        //     echo '<pre>';
        //     print_r($obj);
        //     echo '</pre>';
        // } elseif ($obj->status == 3) {
        //     //Thẻ lỗi
        //     echo '<pre>';
        //     print_r($obj);
        //     echo '</pre>';
        // } elseif ($obj->status == 4) {
        //     //Bảo trì
        //     echo '<pre>';
        //     print_r($obj);
        //     echo '</pre>';
        // } else {
        //     //Lỗi
        //     echo '<pre>';
        //     print_r($obj);
        //     echo '</pre>';
        // }


    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Nạp thẻ</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css"
          integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
</head>
<body>
<div class="container">
    <div class="row" style="margin-top: 50px;">
        <div class="col-md-8" style="float:none;margin:0 auto;">
            <form method="POST" action="">
                <div class="form-group">
                    <label>Loại thẻ:</label>
                    <select class="form-control" onchange="getValue()" name="telco" required>
                        <option value="">Chọn loại thẻ</option>
                        <option value="VIETTEL">Viettel</option>
                        <option value="MOBIFONE">Mobifone</option>
                        <option value="VINAPHONE">Vinaphone</option>
						<option value="VNMB">Vietnamobile</option>
                        <option value="GATE">Gate</option>
                        <option value="ZING">Zing</option>
						<option value="VCOIN">Vcoin</option>
                        <option value="GARENA">Garena</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Mệnh giá:</label>
                    <select class="form-control" onchange="getValue()" name="amount" required>
                        <option value="">Chọn mệnh giá</option>
                        <option value="10000">10.000</option>
                        <option value="20000">20.000</option>
                        <option value="30000">30.000</option>
                        <option value="50000">50.000</option>
                        <option value="100000">100.000</option>
                        <option value="200000">200.000</option>
                        <option value="300000">300.000</option>
                        <option value="500000">500.000</option>
                        <option value="1000000">1.000.000</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Số seri:</label>
                    <input type="text" class="form-control" onchange="getValue()" name="serial" required/>
                </div>
                <div class="form-group">
                    <label>Mã thẻ:</label>
                    <input type="text" class="form-control" onchange="getValue()" name="code" required/>
                </div>
                <div class="form-group">
                    <button type="submit" class="btn btn-success btn-block" name="submit">NẠP NGAY</button>
                </div>
            </form>
        </div>
    </div>
</div>
<div>

<i class="error" style="color: red;"></i><br>
<b>Bạn sẽ nhận được: <i class="value">0</i> coinVIP</b>
<script>
function getValue(){
    thue=1
    if (($("select[name='telco'] option:selected").val()=="VIETTEL")||($("select[name='telco'] option:selected").val()=="VNMB")||($("select[name='telco'] option:selected").val()=="VINAPHONE")||($("select[name='telco'] option:selected").val()=="GATE")){
        thue=0.32
    }else if (($("select[name='telco'] option:selected").val()=="MOBIFONE")||($("select[name='telco'] option:selected").val()==="VCOIN")||($("select[name='telco'] option:selected").val()=="GARENA")){
        thue=0.35
    }else if (($("select[name='telco'] option:selected").val()=="ZING")){
        thue=0.28
    }
    $(".value").empty();
    num=Math.round($("select[name='amount'] option:selected").val()*(1-thue))
    $(".value").append(num)


    $(".error").empty();
    if ($("select[name='amount'] option:selected").val()==""){
        $(".error").append("Trường mệnh giá thẻ còn thiếu. ")
        
    }else{
       
    }
    if ($("select[name='telco'] option:selected").val()==""){
        $(".error").append("Trường loại thẻ còn thiếu. ")
      
    }else{
       
    }
    
    
      
    
}
</script>
</div>
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
        integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
        crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"
        integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49"
        crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"
        integrity="sha384-smHYKdLADwkXOn1EmN1qk/HfnUcbVRZyYmZ4qpPea6sjB/pTJ0euyQp0Mk8ck+5T"
        crossorigin="anonymous"></script>
</body>
</html>