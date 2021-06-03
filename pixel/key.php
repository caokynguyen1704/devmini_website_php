<?php
    if(isset($_GET)){
        if(isset($_GET['key'])){
            require "../package/request.php";
    
            $stmt = $pdo->query("SELECT * FROM codePixelArt");
            $rows_list = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ( $rows_list as $row ) {
                for ($i=0;$i<=30;$i++){
                    if (md5($row['code'].date("Yhmid",strtotime("-".$i." minutes"))).$row['ID']==$_GET['key']){
                        $json = new stdClass();
                        $json->key = $_GET['key'];
                        $json->value=$row['noType'];
                        $json->price=$row['price'];
                        $myJSON = json_encode($json);
                        echo $myJSON;
                    }
                }
            }
        }
    }
?>