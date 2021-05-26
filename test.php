<?php
 $base_url="http://".$_SERVER['SERVER_NAME'].dirname($_SERVER["REQUEST_URI"].'?').'/';
    $xml = file_get_contents($base_url."/package?uid=".(1000000000+8677737));
$json=json_decode($xml);
echo $json->{'uid'};
?>