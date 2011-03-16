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

function show_table(){
	var history = localStorage['wiki_trace'];
	var trace_list = new Array();
	if( history ){
		console.log(history);
		trace_list = JSON.parse( history );
	}

	var num = trace_list.length;
	var trace_table = document.createElement("table");
	trace_table.id = "trace_table";

	var tt_thead = trace_table.createTHead();
	var tt_thead_row = tt_thead.insertRow(-1);
	var tt_thead_date_cell = tt_thead_row.insertCell(-1);
	var tt_thead_src_cell = tt_thead_row.insertCell(-1);
	var tt_thead_dst_cell = tt_thead_row.insertCell(-1);

	tt_thead_date_cell.innerText = "Date";
	tt_thead_src_cell.innerText = "Source";
	tt_thead_dst_cell.innerText = "Dest";



	for(var i = 0; i < num ; i=i+1){
		var row = trace_table.insertRow(-1);
		var date_cell = row.insertCell(-1);
		var src_cell = row.insertCell(-1);
		var dst_cell = row.insertCell(-1);

		date_cell.innerText = trace_list[i].date;
		src_cell.innerText = trace_list[i].old_title;
		dst_cell.innerText = trace_list[i].new_title;
	}
	document.body.appendChild(trace_table);
}
