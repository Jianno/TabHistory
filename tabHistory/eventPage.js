//startup
chrome.tabs.query({currentWindow: true}, function(tabs){
	var initalTabArray = [];
	for(var i=0; i<tabs.length; i++){
		var newTab = {
			id : tabs[i].id,
			hist : [[tabs[i].title,tabs[i].url]]
			}
		initalTabArray.push(newTab);
	}
	
	chrome.storage.sync.set({"tabList" : initalTabArray});
});


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	if(tab.status == "complete"){
		addToStorage(tab);
	}		
});

chrome.tabs.onMoved.addListener(function(tabId, moveInfo){
	var fromIndex = moveInfo.fromIndex;
	var toIndex = moveInfo.toIndex;
	var difference = toIndex - fromIndex;
	
	chrome.storage.sync.get(function(storage){
		
		var tabArray = storage.tabList;
		var movedElement = tabArray[fromIndex];
		tabArray[fromIndex] = tabArray[toIndex];
		tabArray[toIndex] = movedElement;
		
		chrome.storage.sync.remove("tabList");
		chrome.storage.sync.set({"tabList" : tabArray});
		
	});
});


chrome.windows.onRemoved.addListener(function(windowId){
	chrome.storage.sync.remove("tabList");
	chrome.storage.sync.set({"tabList" : []});
});

chrome.tabs.onRemoved.addListener(function(tabId,removeInfo){
	
	//update storage
	chrome.storage.sync.get(function(storage){
		tabArray = storage.tabList;
		for(var i=0; i<tabArray.length; i++){
			if(tabArray[i].id == tabId){
				tabArray.splice(i,1);
				break;
			}
		}
		chrome.storage.sync.remove("tabList");
		chrome.storage.sync.set({"tabList" : tabArray});
	});
});


function addToStorage(tab){
	
	tabId = tab.id;
	title = tab.title;
	url = tab.url;
	index = tab.index;
	
	chrome.storage.sync.get(function(storage){
		
		tabArray = storage.tabList;
		if(isNewTab(tabArray, tabId)){
			var newTab = {
			id : tabId,
			hist : [[title,url]]
			}
			tabArray.splice(index, 0, newTab);
		}else{
			var tabObj = tabArray[index];
			var histArray = tabObj.hist;
			console.log(histArray);
			if(histArray[histArray.length-1][0] != title){
				tabObj.hist.push([title,url]);
			}
		}
	
	chrome.storage.sync.set({"tabList" : tabArray});
	});
}


function isNewTab(tabArray, tabId){
	var i;
	for(i=0; i<tabArray.length; i++){
		if(tabArray[i].id == tabId){
			return false;
		}
	}
	
	return true;	
}














