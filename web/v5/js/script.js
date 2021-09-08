var title;
var description;
var comments;
var id_level;
var type;
var id_skill;
var ele_has_script; //propietats checked i indeterminate
var ele_has_grammar;
var ele_has_quiz;
var ele_has_vocabulary;
var has_script; //valors 0,1,2 (indeterminat)
var has_grammar;
var has_quiz;
var has_vocabulary;

//paginació
var num_pages_in_nav_const = 5;
var divs_per_page = 9;
var num_pages;
var page;
var num_pages_in_nav;

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

function form_processing(vnum_pages, vpage) {
	title = document.getElementById("title").value;
	description = document.getElementById("description").value;
	comments = document.getElementById("comments").value;
	id_level = document.getElementById("id_level").value;
	type = document.getElementById("type").value;
	id_skill = document.getElementById("id_skill").value;
	ele_has_script = document.getElementById("has_script");
	ele_has_grammar = document.getElementById("has_grammar");
	ele_has_quiz = document.getElementById("has_quiz");
	ele_has_vocabulary = document.getElementById("has_vocabulary");

	if(vnum_pages && vpage) {
		num_pages = parseInt(vnum_pages);
		page = parseInt(vpage);
	} else {
		num_pages = '';
		page = '';
	}
	/*
	console.log(ele_has_script.indeterminate);
	console.log(ele_has_script.checked);
	console.log(title);
	console.log(description);
	console.log(comments);
	console.log(id_level);
	console.log(type);
	console.log(id_skill);
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
			num_pages = parseInt(obj.num_pages);
			page = parseInt(obj.page);
			var arr_dades = obj.data;

			if (arr_dades.length == 0) {
				var cad = "No data found";
				document.getElementById('pagination').innerHTML = "<h3 style=\"color:red;\">" + cad + "</h3>";
				document.getElementById('results').innerHTML = "";
			} else {

				//paginació
				document.getElementById('pagination').innerHTML = "";
				var nav = document.createElement("nav");
				var ul = document.createElement("ul");
				ul.className = "pagination";

				var li_first = document.createElement("li");
				li_first.className = "page-item";
				li_first.innerHTML = "<a class=\"page-link\" href=\"#\">First</a>";
				if (page>1) li_first.addEventListener("click", function(){form_processing(num_pages, 1)});
				ul.appendChild(li_first);

				var li_prev = document.createElement("li");
				li_prev.className = "page-item";
				li_prev.innerHTML = "<a class=\"page-link\" href=\"#\">Prev</a>";
				if (page>1) li_prev.addEventListener("click", function(){form_processing(num_pages, page-1)});
				ul.appendChild(li_prev);

				if (num_pages > num_pages_in_nav_const) {
					num_pages_in_nav = num_pages_in_nav_const;
				} else {
					num_pages_in_nav = num_pages;
				}

				for (var i=0;i<num_pages_in_nav;i++) {
					let k=0; //compte, aquesta variable és local
					var li = document.createElement("li");
					li.className = "page-item";
					if (page > num_pages_in_nav) {
						if (page == parseInt(page-num_pages_in_nav+i+1)) li.className = li.className + " active";	
						li.innerHTML = "<a class=\"page-link\" href=\"#\">" + parseInt(page-num_pages_in_nav+i+1) + "</a>";
						k=i+1;
						if (parseInt(page-num_pages_in_nav+k) != page) li.addEventListener("click", function(){form_processing(num_pages, parseInt(page-num_pages_in_nav+k))});
					} else {
						if (page == i+1) li.className = li.className + " active";
						li.innerHTML = "<a class=\"page-link\" href=\"#\">" + (i+1) + "</a>";
						k=i+1;
						if (page != k) li.addEventListener("click", function(){form_processing(num_pages, k)});
					}
					ul.appendChild(li);
				}

				var li_next = document.createElement("li");
				li_next.className = "page-item";
				li_next.innerHTML = "<a class=\"page-link\" href=\"#\">Next</a>";
				if (page<num_pages) li_next.addEventListener("click", function(){form_processing(num_pages, page+1)});
				ul.appendChild(li_next);

				var li_last = document.createElement("li");
				li_last.className = "page-item";
				li_last.innerHTML = "<a class=\"page-link\" href=\"#\">Last (" + num_pages + ")</a>";
				if (page<num_pages) li_last.addEventListener("click", function(){form_processing(num_pages, num_pages)});
				ul.appendChild(li_last);

				nav.appendChild(ul);
				document.getElementById('pagination').appendChild(nav);
				//fi paginació

				//resultats
				document.getElementById('results').innerHTML = "";
				for (var i = 0; i < arr_dades.length; i++) {

					var div_col = document.createElement("div");
					div_col.className = "col";
					var div_card_shadow_sm = document.createElement("div");
					div_card_shadow_sm.className = "card shadow-sm";
					var div_card_body = document.createElement("div");
					div_card_body.className = "card-body";

					var p1 = document.createElement("P");
					p1.className = "card-text";
					var type = "";
					if (typeof (arr_dades[i].id_video) == "string") type = "V";
					if (typeof (arr_dades[i].id_audio) == "string") type = "A";
					if (typeof (arr_dades[i].id_text) == "string") type = "T";
					p1.innerHTML = "<a href=\"" + arr_dades[i].url + "\" target=\"_blank\" class=\"btn btn-primary\">" + arr_dades[i].id_resource + "</a> (" + type + ") " + arr_dades[i].resource;

					div_card_body.appendChild(p1);

					var p2 = document.createElement("P");
					p2.className = "card-text";
					var content = "";
					//content = content + "<b>Description</b>: Two teachers make introductions and discuss famiy.<br />";
					if (typeof (arr_dades[i].description) == "string") {
						if (arr_dades[i].description!="") content = content + "<b>Description</b>: " + arr_dades[i].description;
					}
					if (typeof (arr_dades[i].comments) == "string") {
						if (arr_dades[i].comments!="") content = content + "<br />" + "<b>Comments</b>: " + arr_dades[i].comments;
					}
					content = content + "<br /><span class=\"color_level\">" + arr_dades[i].level + "</span>";
					content = content + "<br /><span class=\"color_source\">" + arr_dades[i].source + "</span>";
					p2.innerHTML = content;
					div_card_body.appendChild(p2);

					var div_d_flex = document.createElement("div");
					div_d_flex.className = "d-flex justify-content-between align-items-center";
					var div_btn_group = document.createElement("div");
					div_btn_group.className = "btn-group";
					div_btn_group.id = "div_" + arr_dades[i].id_resource;

					var btn = document.createElement("BUTTON");
					btn.type = "button";
					btn.className = "btn btn-sm btn-outline-secondary";
					btn.innerHTML = "Edit comments";
					btn.id="btn_" + arr_dades[i].id_resource;
					btn.addEventListener("click", function(){edit_comments(this.id)});
					div_btn_group.appendChild(btn);

					div_d_flex.appendChild(div_btn_group);

					var small = document.createElement("SMALL");
					small.className = "text-muted";
					//var has = "";
					var has = arr_dades[i].skill + "&nbsp;&nbsp;";
					if (arr_dades[i].S == "1") has = has + "S";
					if (arr_dades[i].G == "1") has = has + ((has=="")?"G":" - G");
					if (arr_dades[i].Q == "1") has = has + ((has=="")?"Q":" - Q");
					if (arr_dades[i].V == "1") has = has + ((has=="")?"V":" - V");
					small.innerHTML = has;

					div_d_flex.appendChild(small);
					div_card_body.appendChild(div_d_flex);

					div_card_shadow_sm.appendChild(div_card_body);
					div_col.appendChild(div_card_shadow_sm);
					document.getElementById('results').appendChild(div_col);
				}
			}
        } else {
            document.getElementById('results').innerHTML = "<img src=\"img/ajax_wait.gif\" />";
        }
	}
    xmlhttp.open("POST","./php/processar.php", true)
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    //alert("title=" + title + "&description=" + description + "&comments=" + comments + "&id_level=" + id_level + "&type=" + type + "&id_skill=" + id_skill + "&has_script=" + has_script + "&has_grammar=" + has_grammar + "&has_quiz=" + has_quiz + "&has_vocabulary=" + has_vocabulary + "&num_pages=" + num_pages + "&page=" + page + "&divs_per_page=" + divs_per_page);
    xmlhttp.send("title=" + title + "&description=" + description + "&comments=" + comments + "&id_level=" + id_level + "&type=" + type + "&id_skill=" + id_skill + "&has_script=" + has_script + "&has_grammar=" + has_grammar + "&has_quiz=" + has_quiz + "&has_vocabulary=" + has_vocabulary + "&num_pages=" + num_pages + "&page=" + page + "&divs_per_page=" + divs_per_page);
}

function edit_comments(id_resource) {
	//alert(id_resource);
	id_resource = id_resource.replace("btn_", "");

    var xmlhttp;
    xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			//alert(xmlhttp.responseText);
			var txtobj = JSON.parse(xmlhttp.responseText);
			var txtarea = document.createElement("TEXTAREA");
			txtarea.className = "form-control";
			txtarea.id = "txtarea_" + id_resource;
			txtarea.value = txtobj.comments;
			var btn = document.createElement("BUTTON");
			btn.type = "button";
			btn.className = "btn btn-sm btn-outline-secondary";
			btn.innerHTML = "update";
			btn.id="btnupd_" + id_resource;
			btn.addEventListener("click", function(){update_comments(id_resource)});
			var div = document.getElementById('div_' + id_resource);
			div.appendChild(document.createElement("br"));
			div.appendChild(txtarea);
			div.appendChild(document.createElement("br"));
			div.appendChild(btn);
			//document.getElementById('btn_' + id_resource).style.visibility="hidden";
			document.getElementById('btn_' + id_resource).style.display="none";
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
