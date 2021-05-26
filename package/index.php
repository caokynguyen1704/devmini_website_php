<?php 

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
if (isset($_GET['uid'])){
    $server="http://hwshequ.mini1.cn:8080/miniw/profile?act=getProfile&op_uin=".$_GET['uid']."&auth=638ec4f1e4b7de067cc27e7aa35f1db3&uin=".$_GET['uid']."&ver=0.42.1&apiid=410&lang=10&country=VN";
    $xml = file_get_contents($server);
    $isDev=false;
    
    $text_key='["mood_text"]="';
    $text=getValue($xml,$text_key);
    $model=getValue_int($xml,'["Model"]=');
    $download=getValue_int($xml,'["all_download_count"]=');
    if (getValue_int($xml,'["creator"]=')!="ERROR"){
        $isDev=true;
        $lvDev=getValue_int($xml,'["level"]=');
    };
    
    $name_key='["NickName"]="';
    $image_key='["url"]="';
    $text=getValue($xml,$text_key);
    $url_img=getValue($xml,$image_key);
    $name=getValue($xml,$name_key);
    $json = new stdClass();
    $json->uid=$_GET['uid'];
    $json->name = $name;
    $json->text=$text;
    $json->model='https://map1.mini1.cn/roleicon/'.$model.'.png';
    $json->totalDownload=$download;
    $json->img = $url_img;
    $json->isDev=$isDev;
    if (isset($lvDev)){
        $json->lvDev=$lvDev;
    }
    $myJSON = json_encode($json);

    echo $myJSON;
}
?>