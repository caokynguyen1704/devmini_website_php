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
    
        $sql="select * from memInform where username=:id";
        $stmt=$pdo->prepare($sql);
        $stmt->execute(array(
            ':id'=>$_GET['username']
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
        if (isset($rows[0])){
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
        }
?>
<div class="card-container">
	<?php if (isset($rows[0]['office'])){echo "<span class='pro'>".$rows[0]['office']."</span>";}?>
	<img class="round" src="<?php if (isset($rows[0]['avatarMW'])){echo $rows[0]['avatarMW'];}else{ echo "img/profile.jpg";}?>" width="150px"/>
	<h3><?php if (isset($rows[0]['username'])){echo $rows[0]['username'];}?></h3>
	<h6><B>UID: </B><?php if (isset($rows[0]['uidMW'])){echo $rows[0]['uidMW'];} if (!(isset($rows[0]))){echo "Người Dùng Không Tồn Tại";}?></h6>
	<p><?php if (isset($textMood)){echo $textMood;} ?></p>
    <?php if (!(isset($rows[0]))){echo "<h1>KHÔNG TÌM THẤY!</h1>";} ?>
	<div class="buttons">
		<button class="primary">
        <?php if (isset($rows[0])){echo number_format($rows[0]['coinVIP']);}else{echo "0";} ?>đ VIP
		</button>
		<button class="primary ghost">
			<?php if (isset($rows[0])){echo number_format($rows[0]['coin']);}else{"0";} ?>đ
		</button>
	</div>
	<div class="skills" onclick="window.location.replace('./profile.php')">
		<h6>Về Trang Cá Nhân Của Bạn</h6>
		<!--<ul>
			<li>UI / UX</li>
			<li>Front End Development</li>
			<li>HTML</li>
			<li>CSS</li>
			<li>JavaScript</li>
			<li>React</li>
			<li>Node</li>
		</ul>-->
       
	</div>
</div>

<footer>
	<p onclick="window.location.replace('./')";>
		VỀ TRANG CHỦ
	</p>
</footer>
