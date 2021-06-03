<link rel="stylesheet" href="css/profile.css" type="text/css">
<?php

function get_content($URL){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_URL, $URL);
    $data = curl_exec($ch);
    curl_close($ch);
    return $data;
}


    require "package/request.php";
    
        $sql="select * from memInform where ID=:id";
        $stmt=$pdo->prepare($sql);
        $stmt->execute(array(
            ':id'=>$_SESSION['userCode']
        ));
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        
        function getValue($strName,$keyName){
            $pos=strpos($strName,$keyName);
            if ($pos){
                
                $str1=substr($strName,$pos+strlen($keyName));
                $pos2=strpos($str1,'"');
                $result=substr($str1,0,$pos2);
                return $result;
            }
            return "ERROR";
        }
        
        function getValue_int($strName,$keyName){
            $pos=strpos($strName,$keyName);
            if ($pos){
                $str1=substr($strName,$pos+strlen($keyName));
        
                $a=strpos($str1,'}');
                $b=strpos($str1,',');
                if ($a>=$b){
                    $pos2=$b;
                }else{
                    $pos2=$a;
                }
                $result=substr($str1,0,$pos2);
                return $result;
            }
            return "ERROR";
        }
        $server="http://hwshequ.mini1.cn:8080/miniw/profile?act=getProfile&op_uin=".(1000000000+$rows[0]['uidMW'])."&auth=638ec4f1e4b7de067cc27e7aa35f1db3&uin=".(1000000000+$rows[0]['uidMW'])."&ver=0.42.1&apiid=410&lang=10&country=VN";
        /*$opts = array(
            'http'=>array(
              'method'=>"GET",
              'header'=>"Accept-language: en\r\n" .
                        "Cookie: foo=bar\r\n"
            )
          );
          $context = stream_context_create($opts);
        $xml = file_get_contents($server,false,$context);*/
        $xml= get_content($server);
        $textMood=getValue($xml,'["mood_text"]="');
?>
<div class="card-container">
	<?php if (isset($rows[0]['office'])){echo "<span onclick=\"window.location.replace('./admin')\" class='pro'>".$rows[0]['office']."</span>";}?>
	<img class="round" src="<?php if (isset($rows[0]['avatarMW'])){echo $rows[0]['avatarMW'];}else{ echo "img/profile.jpg";}?>" width="150px"/>
	<h3><?php if (isset($rows[0]['username'])){echo $rows[0]['username'];}?></h3>
	<h6><B>UID: </B><a onclick="showModal()"><?php if (isset($rows[0]['uidMW'])){echo $rows[0]['uidMW'];}?></a></h6>
	<p><?php echo $textMood; ?></p>
	<div class="buttons">
		<button class="primary">
        <?php echo number_format($rows[0]['coinVIP']); ?>đ VIP
		</button>
		<button class="primary ghost">
			<?php echo number_format($rows[0]['coin']); ?>đ
		</button>
	</div>
	<div class="skills">
		<h6>Lịch sử</h6>
		<!--<ul>
			<li>UI / UX</li>
			<li>Front End Development</li>
			<li>HTML</li>
			<li>CSS</li>
			<li>JavaScript</li>
			<li>React</li>
			<li>Node</li>
		</ul>-->
        <table class="table table-dark">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Thời Gian</th>
      <th scope="col">Thông Tin</th>
      <th scope="col">Giao Dịch</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>
<form method="GET" action="view.php" class="d-flex">
        <input class="form-control me-2" name="username" type="search" placeholder="Nhập Username" aria-label="Search">
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
	</div>
</div>

<footer>
	<p onclick="window.location.replace('./')";>
		VỀ TRANG CHỦ
	</p>
</footer>


<div id="myModal" class="modal fade" role="dialog">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h4 class="modal-title">Thông Tin User</h4>
      </div>
      <div class="modal-body">
        <form method="POST">
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="inputGroup-sizing-default">UID Miniworld</span>
                </div>
                <input type="number" onchange="checkuid(this.value)" name="uid" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" required>
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="exampleCheck1" required>
                    <label class="form-check-label" for="exampleCheck1">Tôi chịu hoàn toàn trách nhiệm pháp lý về thông tin tôi khai báo ở trên.</label>
                </div>
            </div>
            

            <input type="submit" class="btn btn-secondary" disabled value="Hoàn Thành">
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal" onclick='hideModal()'>Close</button>
      </div>
    </div>

  </div>
</div>
<script type="text/javascript">
function checkuid(value){
    if (value<1000000000){
        $(':input[type="submit"]').prop('disabled', false);
    }else{
        $(':input[type="submit"]').prop('disabled', true);
    }
}
function hideModal(){
    $("#myModal").modal('hide');
}
function showModal(){
    $("#myModal").modal('show');
}
<?php 
if (isset($rows[0]['uidMW'])==false){
    echo    "$(window).on('load', function() {
                $('#myModal').modal('show');
            });";
}
?>
</script>

<?php


    if (isset($_POST)&&(isset($_POST['uid']))){
        unset($_SESSION['uid']);
        $_SESSION['uid']=$_POST['uid'];
        $server="http://hwshequ.mini1.cn:8080/miniw/profile?act=getProfile&op_uin=".(1000000000+$_POST['uid'])."&auth=638ec4f1e4b7de067cc27e7aa35f1db3&uin=".(1000000000+$_POST['uid'])."&ver=0.42.1&apiid=410&lang=10&country=VN";
        //$xml = file_get_contents($server);
        $xml= get_content($server);
        $url=getValue($xml,'["url"]="');
        $name=getValue($xml,'["NickName"]="');
        $img=$url;
        if ($url=="ERROR"){
            $model=getValue_int($xml,'["Model"]=');
            $img='https://map1.mini1.cn/roleicon/'.$model.'.png';
        }
        $sql11="UPDATE memInform SET uidMW=:idMW ,avatarMW=:avt ,nameMW=:nameMW  WHERE ID=:id";
                $stmt11=$pdo->prepare($sql11);
                $stmt11->execute(array(
                    ':idMW'=>$_POST['uid'],
                    ':avt'=>$img,
                    ':nameMW'=>$name,
                    ':id'=>$_SESSION['userCode']
                ));
                header( "Location: ./profile.php");
                exit();
    }
?>