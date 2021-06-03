<?php
    $databaseName="devmini";
    $databaseUser="root";
    $databasePass="";
    $pdo = new PDO('mysql:host=localhost;port=3306;dbname='.$databaseName,$databaseUser,$databasePass); 
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
?>
<?php

/*

    $databaseName="id16925237_devmini";
    $databaseUser="id16925237_caoky99";
    $databasePass="Kihitpro1999#";
    $pdo = new PDO('mysql:host=localhost;port=3306;dbname='.$databaseName,$databaseUser,$databasePass); 
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
*/
?>