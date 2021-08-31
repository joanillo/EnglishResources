<?php

$id_resource = $_POST['id_resource'];
$comments = fixQuotes($_POST['comments']);
$comments = str_replace("\n", '<br />', $comments);

//echo $id_resource." ".$comments;

$pwd = file_get_contents('./.pwd');
$conn = mysqli_connect("localhost", "alumne", $pwd);
if (!$conn) {
    $log->error('Could not connect: ' . mysql_error());
    die('Could not connect: ' . mysql_error());
}
mysqli_select_db($conn,"englishresources") or die('Could not select englishresources database.');
mysqli_set_charset($conn, 'utf8');

$sql = "UPDATE RESOURCE SET comments='".$comments."' WHERE id_resource=".$id_resource;
//echo $sql;

$resultset = mysqli_query($conn,$sql);

//$res = "{\"valor\":\"vvv\",\"data\":".json_encode($data)."}";
$res = "OK";

echo $res;

mysqli_close($conn);

function fixQuotes($cadena){
	return str_replace("'","''",$cadena);
}
?>
