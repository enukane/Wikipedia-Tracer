var port = chrome.extension.connect();

// document origin
var current_url = document.URL;
var current_title = current_url.split("/").pop();
var current_ref = document.referrer; // if null then head? => TODO

// links in document
function get_down_handler(link){
	return function(e){
		link_down_traced(link);
	}
}

function get_click_handler(link){
	return function(e){
		link_click_traced(link);
	}
}

function link_down_traced(link){
	if(link){
		var next_url = link.getAttribute("href");
		// assume inter-wikipedia link as"/wiki/***"
		//modify if changed
		var next_title = next_url.split("/").pop();

		console.log("title: "+current_title
			+"; url: "+current_url
			+"; ref "+current_ref
			+"; next:"+next_title
			+"; next_url: "+next_url
		);
		
		chrome.extension.sendRequest({
				"type":"reserve",
				"new_title":next_title,
				"new_url": next_url,
				"old_title":current_title,
				"old_url":current_url,
			});
	}
};

function link_click_traced(link){ 
	if(link){
		var next_title = link.getAttribute("title");
		var next_url = link.getAttribute("href");
		// invoked when link traced
		console.log("title: "+current_title
			+"; url: "+current_url
			+"; ref "+current_ref
			+"; next:"+next_title
			+"; next_url: "+next_url
		);
		chrome.extension.sendRequest({
				"type":"updated"
			});
	}
}

// inject handler
var links = document.getElementsByTagName("a");
var num_of_link = links.length;
for( var i = 0; i < num_of_link; i = i + 1){
	// inject event
	var link = links[i];
	link.addEventListener(
		"mousedown", 
		get_down_handler(link),
		false
	);
	link.addEventListener(
		"click", 
		get_click_handler(link),
		false
	);	
}
