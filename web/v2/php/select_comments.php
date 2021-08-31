<?php

$id_resource = $_POST['id_resource'];

$pwd = file_get_contents('./.pwd');
$conn = mysqli_connect("localhost", "alumne", $pwd);
if (!$conn) {
    $log->error('Could not connect: ' . mysql_error());
    die('Could not connect: ' . mysql_error());
}
mysqli_select_db($conn,"englishresources") or die('Could not select englishresources database.');
mysqli_set_charset($conn, 'utf8');

$sql = "SELECT comments FROM RESOURCE WHERE id_resource=".$id_resource;
//echo $sql;

$resultset = mysqli_query($conn,$sql);

$row = mysqli_fetch_array($resultset, MYSQLI_ASSOC);
mysqli_free_result($resultset);

$res = "{\"comments\":\"".$row['comments']."\"}";

echo $res;

mysqli_close($conn);

function fixQuotes($cadena){
	return str_replace("'","''",$cadena);
}
?>
