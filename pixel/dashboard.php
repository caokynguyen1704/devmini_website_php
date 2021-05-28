
<?php
    require "../package/request.php";
    
    $stmt = $pdo->query("SELECT * FROM codepixelart");
    $rows_list = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<img id="myImg" src="" style="display: none;">



<main class="main_full">
<center><div id="getting-started"></div></center>
	<div class="container uploadImg" >
                <div class="popup" style="display: none;">
                    <span class="popuptext" id="myPopup">Click Here!</span>
                </div>
		<div class="panel">
			<div class="button_outer">
				<div class="btn_upload">
					<input type="file" id="upload_file" name="">
					Upload Image
				</div>
				<div class="processing_bar"></div>
                
				<div class="success_box" onclick="showrunImg()">
                </div>
			</div>
		</div>
		<div class="error_msg"></div>
		<div class="uploaded_file_view" id="uploaded_view">
			<span class="file_remove">X</span>
		</div>
	</div>

    <div class="container runImg" style="display: none;">
        <center><span class="undoRun" onclick="showuploadImg()">X</span></center>
        <center>
            <br>
            <p><b>Width : </b><i class="width"></i> px</p>
            <p><b>Height: </b><i class="height"></i> px</p>
            <p class="numPixel">Bạn chưa chọn kích thước</p>
            <select class="form-select selectPixel" onchange="getPixel()" aria-label="Default select example">
                <option value="0" selected>Bạn chưa chọn kích thước</option>
                <?php
                    foreach ( $rows_list as $row ) {
                        echo '<option value="'.md5($row['code'].date("Yhmid",time())).$row['ID'].'">'.$row['noType']."px giá: ".number_format($row['price']).' coin</option>';
                    }
                ?>
            </select>
            
            
            <script>
                function getPixel(){
                    if ($(".selectPixel option:selected").val()=="0"){
		                $("._getcode").hide();
	                }else{
                        $("._getcode").show();
                    }
                    $(".numPixel").empty();
                    $(".numPixel").append("Bạn vừa chọn "+$(".selectPixel option:selected").text());
                    resize($(".selectPixel option:selected").val());
                }
            </script>
            <canvas id="img1"></canvas>
            <canvas id="img2"></canvas>
            <div class="progress" style="display: none;">
                <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <form method="POST">
                <textarea name="code" class="code" style="display: none;"></textarea>
                <button type="submit" class="getcode btn btn-primary" style="display: none;">Lấy Script</button>
                <?php
                    if (isset($_POST['code'])){
                       
                    }
                ?>
            </form>
            <button class="_getcode btn btn-primary" onclick="xacnhan(<?php echo $_SESSION['uid'];?>)" style="display: none;">XÁC NHẬN HÌNH ẢNH</button>
        </center>
        


    </div>
</main>
<script>
    function showuploadImg() {
        $(".uploadImg").show();
        $(".runImg").hide();
    }
    function showrunImg() {
        $(".uploadImg").hide();
        $(".runImg").show();
        $(".width").empty();
        $(".height").empty();
        $(".width").append($(".pic")[0].naturalWidth);
        $(".height").append($(".pic")[0].naturalHeight);
    }
</script>

<script type="text/javascript">
  $('#getting-started').countdown(new Date(Date.now() + (30 * 60 * 1000)), function(event) { 
    $(this).html(event.strftime('Làm mới sau %M:%S')); 
  }).on('finish.countdown', function(event) { 
    location.reload();
  });
</script>