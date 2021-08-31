<?php

$title = fixQuotes($_POST['title']);
$description = fixQuotes($_POST['description']);
$comments = fixQuotes($_POST['comments']);
$id_level = $_POST['id_level'];
$type = $_POST['type'];
$has_script = $_POST['has_script'];
$has_grammar = $_POST['has_grammar'];
$has_quiz = $_POST['has_quiz'];
$has_vocabulary = $_POST['has_vocabulary'];

//echo $title." ".$description." ".$comments." ".$id_level." ".$type." ".$has_script." ".$has_grammar." ".$has_quiz." ".$has_vocabulary;

$pwd = file_get_contents('./.pwd');
$conn = mysqli_connect("localhost", "alumne", $pwd);
if (!$conn) {
    $log->error('Could not connect: ' . mysql_error());
    die('Could not connect: ' . mysql_error());
}
mysqli_select_db($conn,"englishresources") or die('Could not select englishresources database.');
mysqli_set_charset($conn, 'utf8');

//$sql = "select * from RESOURCE R INNER JOIN LEVEL L ON R.id_level=L.id_level where active=true";
//$sql = "select R.id_resource, resource, url, level, description, comments, has_script, has_grammar, has_quiz, has_vocabulary from RESOURCE R INNER JOIN LEVEL L ON R.id_level=L.id_level INNER JOIN VIDEO V ON R.id_resource=V.id_resource where active=true";
$sql = "select R.id_resource, resource, id_video, id_listenning, url, level, description, comments, V.has_script VS, V.has_grammar VG, V.has_quiz VQ, V.has_vocabulary VV, L.has_script LS, L.has_grammar LG, L.has_quiz LQ, L.has_vocabulary LV from RESOURCE R INNER JOIN LEVEL LE ON R.id_level=LE.id_level LEFT OUTER JOIN VIDEO V ON R.id_resource=V.id_resource LEFT OUTER JOIN LISTENNING L ON R.id_resource=L.id_resource WHERE active=true";

if ($title!="") $sql.=" AND resource LIKE '%".$title."%'";
if ($description!="") $sql.=" AND description LIKE '%".$description."%'";
if ($comments!="") $sql.=" AND comments LIKE '%".$comments."%'";
if ($id_level!="") $sql.=" AND LE.id_level = ".$id_level;
if ($type=="video") $sql.=" AND V.id_video IS NOT NULL";
if ($type=="listenning") $sql.=" AND L.id_listenning IS NOT NULL";

$resultset = mysqli_query($conn,$sql);
$data = array();

while($row = mysqli_fetch_array($resultset, MYSQLI_ASSOC)) {
	$data[] = $row;
}

mysqli_free_result($resultset);

$res = "{\"valor\":\"vvv\",\"data\":".json_encode($data)."}";
echo $res;

mysqli_close($conn);

function fixQuotes($cadena){
	return str_replace("'","''",$cadena);
}
?>
