buffer = null; // {tabid, old_title, old_url, new_title, new_url}
console.log("hell");

function link_traced(params){
	var old_title = UnescapeUTF8(params.old_title);
	old_title = old_title.split("#")[0];
	var old_url = params.old_url;
	var new_title = UnescapeUTF8(params.new_title);
	new_title = new_title.split("#")[0];
	var new_url = params.new_url;
	
	// what to do?
	console.log("TRACED : "
		+ UnescapeUTF8(params.old_title)
		+ " -> " 
		+ UnescapeUTF8(params.new_title)
	);

	// element = {date, old_title, new_title}
	var history = localStorage.wiki_trace;
	var trace_list = null;
	if( history ){
		trace_list = JSON.parse(history);
	}else{
		trace_list = new Array();
	}

	var now = new Date();
	var now_string = now.getFullYear()+"/"
			+now.getMonth()+"/"
			+now.getDate()+" "
			+now.getHours()+":"
			+now.getMinutes()+":"
			+now.getSeconds();

	trace_list.push({
			"date": now_string,
			"old_title": old_title,
			"new_title": new_title,
	});

	var history_str = JSON.stringify(trace_list);
	console.log("history: "+ history_str);

	// size limit not considered
	localStorage.wiki_trace = history_str;
}

chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse){
		console.log("received: "+JSON.stringify(request));
		tabid = sender.tab.id;
		if( request.type == "reserve" ){
			buffer = null;
			buffer = {
				"tabid": tabid, 
				"old_title": request.old_title,
				"old_url": request.old_url,
				"new_title": request.new_title, 
				"new_url": request.new_url
			};
			// when clicked on "#****", jumps within the page
			// but chrome gives request.new_title="#***"
			// the case, new_title must be same as old one
			if( buffer.new_title.charAt(0) == "#"){
			buffer.new_title = buffer.old_title;
		}

		}else if( request.type == "updated" ){
			link_traced(buffer);	
			buffer = null;
		}
	}
);

chrome.tabs.onSelectionChanged.addListener(
	function(tabid, info){
		console.log("select changed:"
			+ " tabid: " + tabid
			+ " info: " + JSON.stringify(info)
		);
		
		buffer = null;
	}
);

chrome.tabs.onCreated.addListener(
	function(tab){
		console.log("created : " + JSON.stringify(tab));

		if( buffer == null ){
			// tab selectionChanged
			// or removed
			return;
		}

		// must hecks domain
		// ugly implementation here
		if( tab.url == "chrome://newtab/" ){
			buffer == null;
		}

		// traced
		buffer.new_url = tab.url;
		buffer.new_title = tab.url.split("/").pop();
		link_traced(buffer);
	}
);

chrome.tabs.onUpdated.addListener(
	function(tabid, info, tab){
		console.log("updated id:"+tabid
			+ " info: " + JSON.stringify(info)
			+ " tab: " + JSON.stringify(tab)
		);
		// ignores this for onCreated does hook.
		// and simply handling "reserve->update" would
		// fail in the case below 
		// "rightclick->ignore->win change->reload"
	}
);

chrome.tabs.onRemoved.addListener(
	function(tabid, info){
		console.log("removed id:" + tabid
			+" info: " + JSON.stringify(info)
		);

		if( buffer == null ){
			return;
		}

		if( buffer.tabid == tabid ){
			buffer = null;
		}
	}
);
