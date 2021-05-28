var img1 = document.getElementById("img1");
var ctx1 = img1.getContext("2d");
var img2 = document.getElementById("img2");
var ctx2 = img2.getContext("2d");
var picture;

function printPicture() { 
	console.log(picture)
 }
 function changeSize(picture,size) {
	sizeofPic=size
	img=picture
	img.width=$("#myImg")[0].width
	img.height=$("#myImg")[0].height
	if (img.width>sizeofPic){
		if (img.width>=img.height){
		  img.height=img.height/(img.width/sizeofPic)
		  img.width=sizeofPic

		}
		else{
		  img.width=img.width/(img.height/sizeofPic)
		  img.height=sizeofPic
		}
	  }
	  img1.width=img.width
	  img1.height=img.height
	  img2.width=img.width
	  img2.height=img.height
	  ctx1.drawImage(img, 0,0,img.width,img.height)
	 
 }
 function xacnhan(uid){
	$(".progress").show();
	$("._getcode").hide();
	if ($(".selectPixel option:selected").val()!="0"){
		if(location.pathname=="/devmini/pixel/"){
			getcode(uid);
		}
	}
 }
function resize(valueKey){
	$.getJSON( "./key.php?key="+valueKey, function( data ) {
		console.log("Select Size to "+data.value)
		changeSize(picture,data.value)
	  });
}
function processImage(file) {
	sizeofPic=256
	var reader = new FileReader();
	reader.onload = function(e) {
	  var img = new Image();
	  $('#myImg').attr('src', e.target.result);
	  img.onload = function() {
			picture=img;
			changeSize(picture,256)
  
  
	  }
	  img.src = e.target.result;
	}
	reader.readAsDataURL(file.files[0]);
  }
  

var btnUpload = $("#upload_file"),
		btnOuter = $(".button_outer");
	btnUpload.on("change", function(e){
		var ext = btnUpload.val().split('.').pop().toLowerCase();
		if($.inArray(ext, ['gif','png','jpg','jpeg']) == -1) {
			$(".error_msg").text("Not an Image...");
		} else {
			$(".error_msg").text("");
			btnOuter.addClass("file_uploading");
			setTimeout(function(){
				btnOuter.addClass("file_uploaded");
			},3000);
			var uploadedFile = URL.createObjectURL(e.target.files[0]);
			processImage(e.target);
			

			setTimeout(function(){
				$("#uploaded_view").append('<img class="pic" src="'+uploadedFile+'" />').addClass("show");
                $(".popup").show();
			},3500);
            
            //console.log($(".pic")[0].naturalWidth)
            //console.log($(".pic")[0].naturalHeight)
		}
	});
	$(".file_remove").on("click", function(e){
        $(".popup").hide();
		$("#uploaded_view").removeClass("show");
		$("#uploaded_view").find("img").remove();
		btnOuter.removeClass("file_uploading");
		btnOuter.removeClass("file_uploaded");
	});


	function rgbToHex1(r, g, b) {
		if (r > 255 || g > 255 || b > 255)
			throw "Invalid color component";
		return ((r << 16) | (g << 8) | b).toString(16);
	}
	load=0;
	function getcode(uid) {
		uidMW=1000000000+parseInt(uid)
		  array=[]
		  denta=60
		  text_val=""
		  str=""
		  lib=""
		  count=0;
		  i=0;
		  j=0;
		  done=1;
		  var canvas_review = document.getElementById("img1");
		  var review = img1.getContext("2d");
		  var canvas_view = document.getElementById("img2");
		  var view = img2.getContext("2d");  
		  setInterval(function(){
			$(".progress-bar").css("width",load+"%")
			  if (done==1){
				  count=count+1;
				  load=count*100/(canvas_review.height*canvas_review.width);
				  $(".progress-bar").empty();
				  $(".progress-bar").append("<center>"+Math.round(load)+"%</center>")
					  
		  if (j==canvas_review.height){i=i+1;j=0;};
		  if(j<canvas_review.height){j=j+1;};
		  if (i==canvas_review.width){done=0;};
			imgData=review.getImageData(i,j,1,1).data 
			r=imgData[0]
			g=imgData[1]
			b=imgData[2]
			k=0
			far1=100
			for (m=0;m<check.length;m++) {
				
				far2=Math.abs(r-check[m].r)+Math.abs(g-check[m].g)+Math.abs(b-check[m].b)
				if (far2<far1) { 
					far1=far2
					k=m
					}
				}
				stt=check[k].stt
				id = check[k].id
				data=check[k].data
				str=str+stt
				view.fillStyle = "#"+rgbToHex1(check[stt].r,check[stt].g,check[stt].b);
				view.fillRect(i,j,1,1);
				if (array.length!=0){
					let sum=0
					for (l=0;l<array.length;l++){
					if (stt==array[l]){
						sum++;
						}
					}
					if (sum==0){
						array[array.length]=stt
					}
				}
				else{
					array[array.length]=stt
				}
				if ((i==canvas_review.width-1)&&(j==canvas_review.height-1))
				{
					str=str
				}
				else{
					str=str+","
				}
			}	
			if (done==0){
				done=3;
				text_val="{"+str+"}"
	  			for (m=0;m<array.length;m++) {
					lib=lib+"{stt="+array[m]+",id="+check[array[m]].id+",data="+check[array[m]].data+"},"
		  		}
		  		lib="{"+lib+"0}"
				ddd=
	  `
	  local x,y,z
	  local Block = class.Block.new()
	  click=false
	  local result,uin=Player:getHostUin()
	  function ok(param)
		  if x==nil then 
			  x=param.x
			  y=param.y
			  z=param.z
			  click=true 
			  Actor:setPosition(0, math.ceil(x), 250, math.ceil(z))
			  Block:placeBlock(1001, math.ceil(x), 248, math.ceil(z),0)
		  end
	  end
	  ScriptSupportEvent:registerEvent([=[Player.ClickBlock]=],ok)
	  
	  function build (a)
		  if (a.content == 'build')and(`+uidMW+`==uin) then 
			  if (click) then
				  lib=`+lib+`
				  map=`+text_val+`
				  s_socot=`+canvas_review.height+`
				  sohang,socot=0,0
				  for i=1,#map do
					  local vitri_lib
					  for j=1,#lib-1 do
						  if map[i]==lib[j].stt then
							  vitri_lib=j
							  break
						  end
					  end
					  Block:setBlockAll(x-socot,y,z+sohang,lib[vitri_lib].id,lib[vitri_lib].data)
					  if i%s_socot==0 then
						  socot=socot+1
						  sohang=0
					  else
						  sohang=sohang+1
					  end
				  end
			  end
		  end
	  end
	  ScriptSupportEvent:registerEvent([=[Player.NewInputContent]=], build)
	  
	  local x2,y2,z2
	  function diBoTrenTroi(a)
		  if click then 
		  Block:destroyBlock(x2,y2-1,z2,true)
		  _,x4,y4,z4=Actor:getPosition(0)
		  x2=x4 
		  y2=y4 
		  z2=z4
		  Block:placeBlock(1001, x2, y2-1, z2,0)
		  end
	  end 
	  ScriptSupportEvent:registerEvent([=[Game.Run]=], diBoTrenTroi)
	  function diBoTrenTroi2(a)
		  _,x3,y3,z3=Actor:getPosition(0)
		  x2=x3 
		  y2=y3 
		  z2=z3
	  end 
	  ScriptSupportEvent:registerEvent([=[Game.Start]=], diBoTrenTroi2)
	  `
	  
	  			eee="function getStr(str) local b='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=' str= string.gsub(str, '[^'..b..'=]', '') return (str:gsub('.', function(x) if (x == '=') then return '' end error=b local r,f,io='',(b:find(x)-1) for i=6,1,-1 do print,r=nil,r..(f%2^i-f%2^(i-1)>0 and '1' or '0') end return r; end):gsub('%d%d%d?%d?%d?%d?%d?%d?', function(x) if (#x ~= 8) then return '' end local c=0 for i=1,8 do c=c+(x:sub(i,i)=='1' and 2^(8-i) or 0) end return string.char(c) end)) end\n"
	  			fff="loadstring(getStr(key))()"    
	  			ggg="key='"+window.btoa(ddd)+"'"
	  			textcode=eee+ggg+"\n"+fff;
				  $(".getcode").show();
				$(".code").text(textcode)
			}
	  	},1);
}



$(".getcode").click(function(){
	download();
})
function download() {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent($(".code").text()));
    element.setAttribute('download', "script_"+Date.now());
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
