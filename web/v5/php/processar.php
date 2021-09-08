<?php

$title = fixQuotes($_POST['title']);
$description = fixQuotes($_POST['description']);
$comments = fixQuotes($_POST['comments']);
$id_level = $_POST['id_level'];
$type = $_POST['type'];
$id_skill = $_POST['id_skill'];
$has_script = $_POST['has_script'];
$has_grammar = $_POST['has_grammar'];
$has_quiz = $_POST['has_quiz'];
$has_vocabulary = $_POST['has_vocabulary'];

$first_query = false;
$divs_per_page = $_POST['divs_per_page'];

if (isset($_POST["page"]) && !empty($_POST["page"])) { 
	$page = $_POST["page"];
	$num_pages = $_POST["num_pages"];
} else { 
	$page=1;
	$first_query = true;
};  
$startFrom = ($page-1) * $divs_per_page; 

//echo $title." ".$description." ".$comments." ".$id_level." ".$type." ".$has_script." ".$has_grammar." ".$has_quiz." ".$has_vocabulary;

$pwd = file_get_contents('./.pwd');
$conn = mysqli_connect("localhost", "alumne", $pwd);
if (!$conn) {
    $log->error('Could not connect: ' . mysql_error());
    die('Could not connect: ' . mysql_error());
}
mysqli_select_db($conn,"englishresources") or die('Could not select englishresources database.');
mysqli_set_charset($conn, 'utf8');

$sql = "select R.id_resource, resource, id_video, id_audio, id_text, url, level, source, skill, description, comments, has_script S, has_grammar G, has_quiz Q, has_vocabulary V from RESOURCE R INNER JOIN LEVEL L ON R.id_level=L.id_level INNER JOIN SKILL SK ON R.id_skill=SK.id_skill INNER JOIN SOURCE S ON R.id_source=S.id_source LEFT OUTER JOIN VIDEO V ON R.id_resource=V.id_resource LEFT OUTER JOIN AUDIO A ON R.id_resource=A.id_resource LEFT OUTER JOIN TEXT T ON R.id_resource=T.id_resource WHERE active=true";

if ($title!="") $sql.=" AND resource LIKE '%".$title."%'";
if ($description!="") $sql.=" AND description LIKE '%".$description."%'";
if ($comments!="") $sql.=" AND comments LIKE '%".$comments."%'";
if ($id_level!="") $sql.=" AND L.id_level = ".$id_level;
if ($id_skill!="") $sql.=" AND SK.id_skill = ".$id_skill;
if ($type=="video") $sql.=" AND id_video IS NOT NULL";
if ($type=="audio") $sql.=" AND id_audio IS NOT NULL";
if ($type=="text") $sql.=" AND id_text IS NOT NULL";

if ($has_script=='1') {
	$sql.=" AND has_script=1";
} else if ($has_script=='0') {
	$sql.=" AND has_script=0";
} 

if ($has_grammar=='1') {
	$sql.=" AND has_grammar=1";
} else if ($has_grammar=='0') {
	$sql.=" AND has_grammar=0";
} 

if ($has_quiz=='1') {
	$sql.=" AND has_quiz=1";
} else if ($has_quiz=='0') {
	$sql.=" AND has_quiz=0";
} 

if ($has_vocabulary=='1') {
	$sql.=" AND has_vocabulary=1";
} else if ($has_vocabulary=='0') {
	$sql.=" AND has_vocabulary=0";
} 

if ($first_query == true) {
	$sqlfirst = str_replace("R.id_resource, resource, id_video, id_audio, id_text, url, level, source, skill, description, comments, has_script S, has_grammar G, has_quiz Q, has_vocabulary V", "count(*) as num", $sql);
		$resultset = mysqli_query($conn,$sqlfirst);
		$row = mysqli_fetch_array($resultset, MYSQLI_ASSOC);
		$num = $row["num"];
		$num_pages = intdiv($num,$divs_per_page) + 1;
		mysqli_free_result($resultset);
}

$sql.=" ORDER BY R.id_resource ASC LIMIT $startFrom, $divs_per_page";

$resultset = mysqli_query($conn,$sql);
$data = array();

while($row = mysqli_fetch_array($resultset, MYSQLI_ASSOC)) {
	$data[] = $row;
}

mysqli_free_result($resultset);

$res = "{\"num_pages\":\"".$num_pages."\",\"page\":\"".$page."\",\"data\":".json_encode($data)."}";

echo $res;

mysqli_close($conn);

function fixQuotes($cadena){
	return str_replace("'","''",$cadena);
}
?>
