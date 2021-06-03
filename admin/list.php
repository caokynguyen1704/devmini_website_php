<table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Username</th>
      <th scope="col">coinVIP</th>
      <th scope="col">coin</th>
      <th scope="col">Lần đăng nhập cuối</th>
    </tr>
  </thead>
  <tbody>
    
    <?php 
     require "../package/request.php";
     $stmt = $pdo->query("SELECT * FROM memInform ORDER BY id");
     $rows_list = $stmt->fetchAll(PDO::FETCH_ASSOC);
     foreach ($rows_list as $row){
     echo '<tr>
            <th scope="row">'.$row['ID'].'</th>
            <td>'.$row['username'].'</td>
            <td>'.number_format($row['coinVIP']).'</td>
            <td>'.number_format($row['coin']).'</td>
            <td>'.$row['lastLogin'].'</td>
        </tr>';
    
    }

    ?>
    

  </tbody>
</table>