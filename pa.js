function open_options_page(){
	chrome.tabs.create({"url":"options.html"});
}

function delete_table(){
	delete localStorage.wiki_trace;
	var trace_table = document.getElementById("trace_table");
	if( trace_table ){
		document.body.removeChild(trace_table);
	}
}

function append_zero(num) {
	var num_str = num;
	if (num < 10) {
		num_str = "0" + num;
	}

	return num_str;
}

function generate_date(date_str) {
	// 2012-08-29 03:04:05
	var date = new Date(date_str);
	var yy = date.getYear();
	var mm = date.getMonth();
	var dd = date.getDate();
	var HH = date.getHours();
	var MM = date.getMinutes();
	var SS = date.getSeconds();

	if (yy < 2000)  {
		yy += 1900;
	}

	mm = append_zero(mm);
	dd = append_zero(dd);
	HH = append_zero(HH);
	MM = append_zero(MM);
	SS = append_zero(SS);

	return yy + "-" + mm + "-" + dd + " " + HH + ":" + MM + ":" + SS;
}

function generate_href(title, url) {
	return "<a href=\"" + url + "\">" + title + "</a>";
}

function show_table(){
	var history = localStorage['wiki_trace'];
	var trace_list = new Array();
	if( history ){
		console.log(history);
		trace_list = JSON.parse( history );
	}

	// generate headline
	var headline = document.createElement("h1");
	headline.innerHTML = "Wikipedia Tracer";
	document.body.appendChild(headline);

	var num = trace_list.length;
	var trace_table = document.createElement("table");
	trace_table.id = "trace_table";

	var tt_thead = trace_table.createTHead();
	var tt_thead_row = tt_thead.insertRow(-1);
	/*
	var tt_thead_date_cell = tt_thead_row.insertCell(-1);
	var tt_thead_src_cell = tt_thead_row.insertCell(-1);
	var tt_thead_dst_cell = tt_thead_row.insertCell(-1);

	tt_thead_date_cell.innerText = "Date";
	tt_thead_src_cell.innerText = "From:";
	tt_thead_dst_cell.innerText = "To:";
	*/
	var tt_thead_date = document.createElement("th");
	tt_thead_date.innerHTML = "Date";
	tt_thead_row.appendChild(tt_thead_date);

	var tt_thead_from = document.createElement("th");
	tt_thead_from.innerHTML = "From:";
	tt_thead_row.appendChild(tt_thead_from);

	var tt_thead_to = document.createElement("th");
	tt_thead_to.innerHTML = "To:";
	tt_thead_row.appendChild(tt_thead_to);



	for(var i = 0; i < num ; i=i+1){
		// #num | source | dst | time | date 
		var row = trace_table.insertRow(-1);
		var time_cell = row.insertCell(-1);
		var src_cell = row.insertCell(-1);
		var dst_cell = row.insertCell(-1);

		time_cell.innerHTML = generate_date(trace_list[i].date);

		src_cell.innerHTML = generate_href(trace_list[i].old_title, trace_list[i].old_url);
		dst_cell.innerHTML = generate_href(trace_list[i].new_title, trace_list[i].new_url);
	}
	document.body.appendChild(trace_table);
}
