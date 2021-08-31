var title;
var description;
var comments;
var id_level;
var type;
var ele_has_script; //propietats checked i indeterminate
var ele_has_grammar;
var ele_has_quiz;
var ele_has_vocabulary;
var has_script; //valors 0,1,2 (indeterminat)
var has_grammar;
var has_quiz;
var has_vocabulary;

window.addEventListener('load', (event) => {
    init();
});

function init() {
    document.getElementById("has_script").indeterminate=true;
    document.getElementById("has_script").addEventListener("click", function(){change_has_script(this)});
    document.getElementById("has_grammar").indeterminate=true;
    document.getElementById("has_grammar").addEventListener("click", function(){change_has_grammar(this)});
    document.getElementById("has_quiz").indeterminate=true;
    document.getElementById("has_quiz").addEventListener("click", function(){change_has_quiz(this)});
    document.getElementById("has_vocabulary").indeterminate=true;
    document.getElementById("has_vocabulary").addEventListener("click", function(){change_has_vocabulary(this)});
	document.getElementById("send").addEventListener("click", function(){form_processing()});
}

function change_has_script(cb) {
	if (cb.readOnly) cb.checked=cb.readOnly=false;
	else if (!cb.checked) cb.readOnly=cb.indeterminate=true;
}

function change_has_grammar(cb) {
	if (cb.readOnly) cb.checked=cb.readOnly=false;
	else if (!cb.checked) cb.readOnly=cb.indeterminate=true;
}

function change_has_quiz(cb) {
	if (cb.readOnly) cb.checked=cb.readOnly=false;
	else if (!cb.checked) cb.readOnly=cb.indeterminate=true;
}

function change_has_vocabulary(cb) {
	if (cb.readOnly) cb.checked=cb.readOnly=false;
	else if (!cb.checked) cb.readOnly=cb.indeterminate=true;
}

function form_processing() {
	title = document.getElementById("title").value;
	description = document.getElementById("description").value;
	comments = document.getElementById("comments").value;
	id_level = document.getElementById("id_level").value;
	type = document.getElementById("type").value;
	ele_has_script = document.getElementById("has_script");
	ele_has_grammar = document.getElementById("has_grammar");
	ele_has_quiz = document.getElementById("has_quiz");
	ele_has_vocabulary = document.getElementById("has_vocabulary");
	/*
	console.log(ele_has_script.indeterminate);
	console.log(ele_has_script.checked);
	console.log(title);
	console.log(description);
	console.log(comments);
	console.log(id_level);
	console.log(type);
	*/
	has_script = ele_has_script.indeterminate==true?2:ele_has_script.checked==true?1:0; //0,1,2
	has_grammar = ele_has_grammar.indeterminate==true?2:ele_has_grammar.checked==true?1:0;
	has_quiz = ele_has_quiz.indeterminate==true?2:ele_has_quiz.checked==true?1:0;
	has_vocabulary = ele_has_vocabulary.indeterminate==true?2:ele_has_vocabulary.checked==true?1:0;

    var xmlhttp;
    xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            json_obj=xmlhttp.responseText;
            //alert(json_obj)
			var obj = JSON.parse(json_obj);
			var arr_dades = obj.data;

			if (arr_dades.length == 0) {
				var cad = "No s'han retornat dades";
				document.getElementById('results').innerHTML = cad;
			} else {

				document.getElementById('results').innerHTML = "";
				for (var i = 0; i < arr_dades.length; i++) {
					var div = document.createElement("div");
					var content = "";
					content = content + "<hr />";
					content = content + "<a href=\"" + arr_dades[i].url + "\" target=\"_blank\">" + arr_dades[i].id_resource + "</a>.&nbsp;";

					var has = "";

					if (typeof (arr_dades[i].id_video) == "string") content = content + "(V)&nbsp;";
					if (typeof (arr_dades[i].id_listenning) == "string") content = content + "(L)&nbsp;";

					if (arr_dades[i].S == "1") has = has + "S";
					if (arr_dades[i].G == "1") has = has + ((has=="")?"G":" - G");
					if (arr_dades[i].Q == "1") has = has + ((has=="")?"Q":" - Q");
					if (arr_dades[i].V == "1") has = has + ((has=="")?"V":" - V");

					content = content + arr_dades[i].resource;

					if (typeof (arr_dades[i].description) == "string") {
						if (arr_dades[i].description!="") content = content + "<br />" + "<b>Description</b>: " + arr_dades[i].description;
					}

					if (typeof (arr_dades[i].comments) == "string") {
						if (arr_dades[i].comments!="") content = content + "<br />" + "<b>Comments</b>:<br />" + arr_dades[i].comments;
					}

					content = content + "<br />" + arr_dades[i].level;

					content = content + "<br />" + has;
					content = content + "<br />" + arr_dades[i].source;
					//content = content + "<br /><button id=\"comment\">comment</button>";
					div.innerHTML = content;
					document.getElementById('results').appendChild(div);
					var div_comment = document.createElement("div");
					div_comment.id = "div_" + arr_dades[i].id_resource;
					var btn = document.createElement("BUTTON");
					btn.innerHTML = "edit comments";
					btn.id="btn_" + arr_dades[i].id_resource;
					div_comment.appendChild(btn);
					btn.addEventListener("click", function(){edit_comments(this.id)});
					document.getElementById('results').appendChild(div_comment);
				}

			}
        } else {
            document.getElementById('results').innerHTML = "<img src=\"img/ajax_wait.gif\" />";
        }
	}
    xmlhttp.open("POST","./php/processar.php", true)
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send("title=" + title + "&description=" + description + "&comments=" + comments + "&id_level=" + id_level + "&type=" + type + "&has_script=" + has_script + "&has_grammar=" + has_grammar + "&has_quiz=" + has_quiz + "&has_vocabulary=" + has_vocabulary);
}

function edit_comments(id_resource) {
	id_resource = id_resource.replace("btn_", "");

    var xmlhttp;
    xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			//alert(xmlhttp.responseText);
			var txtobj = JSON.parse(xmlhttp.responseText);
			var txtarea = document.createElement("TEXTAREA");
			txtarea.id = "txtarea_" + id_resource;
			txtarea.value = txtobj.comments;
			var btn = document.createElement("BUTTON");
			btn.innerHTML = "update";
			btn.id="btnupd_" + id_resource;
			btn.addEventListener("click", function(){update_comments(id_resource)});
			var div = document.getElementById('div_' + id_resource);
			div.appendChild(document.createElement("br"));
			div.appendChild(txtarea);
			div.appendChild(document.createElement("br"));
			div.appendChild(btn);
			document.getElementById('btn_' + id_resource).style.visibility="hidden";

        }
	}
    xmlhttp.open("POST","./php/select_comments.php", true)
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send("id_resource=" + id_resource);
}

function update_comments(id_resource) {
	var txtarea = document.getElementById('txtarea_' + id_resource);
	//alert(txtarea.value);

    var xmlhttp;
    xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			//alert(xmlhttp.responseText);
			form_processing();

        } else {
           document.getElementById('results').innerHTML = "<img src=\"img/ajax_wait.gif\" />";
        }
	}
    xmlhttp.open("POST","./php/update_comments.php", true)
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlhttp.send("id_resource=" + id_resource + "&comments=" + txtarea.value);
}
