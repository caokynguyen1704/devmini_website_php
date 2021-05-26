<?php
    $databaseName="devmini";
    $databaseUser="root";
    $databasePass="";
    $pdo = new PDO('mysql:host=localhost;port=3306;dbname='.$databaseName,$databaseUser,$databasePass); 
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
?>