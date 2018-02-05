document.addEventListener("DOMContentLoaded", function(event){
	
	

	
	chrome.tabs.query({currentWindow : true, active : true}, function(tab){
		chrome.storage.sync.get(function(storage){
			var tabArray = storage.tabList;
			var activeTabHistory;
			var indexOfActive;
			for(var i=0; i<tabArray.length; i++){
				if(tabArray[i].id == tab[0].id){
					activeTabHistory = tabArray[i].hist;
					indexOfActive = i;
					break;
				}
			}
			initalLoad(activeTabHistory, tabArray.length, indexOfActive);
			
			document.getElementById("accordion").addEventListener("click",function(e){
				var elementId = e.target.id;
				//check if not current tab and target hasn't been loaded yet
				var targetBody = document.getElementById("tabBody"+elementId);
				if(targetBody != null){
					if(elementId != "currentDrop" && !targetBody.hasChildNodes()){
						var historyArray = tabArray[elementId].hist;
						createHistoryList(historyArray, elementId);
					}
				}
			});
			
			
			
		});	
	});
});




function initalLoad(activeTabHistory, tabArrayLength, indexOfActive){
	
	var activeTab = document.getElementById("currentTab");
	var list = document.createElement("UL");
	
	document.getElementById("currentDrop").innerHTML += " (tab: " + (Number(indexOfActive)+1) + ")";
	document.getElementById("pageNum").innerHTML = activeTabHistory.length;
	
	for(var i=(activeTabHistory.length-1); i>=0; i--){
		var nextItem = document.createElement("LI");
		var nextLink = document.createElement("A");
		
		nextLink.setAttribute("target", "_blank");
		nextLink.setAttribute("href", activeTabHistory[i][1]);
		nextLink.innerHTML = activeTabHistory[i][0];
		
		nextItem.appendChild(nextLink);
		list.appendChild(nextItem);
	}
		activeTab.appendChild(list);
	
	
	for(var j=0; j<tabArrayLength; j++){
		if(j!=indexOfActive){
			var panDef = document.createElement("DIV");
			panDef.className = "panel panel-default";
			var panHead = document.createElement("DIV");
			panHead.className = "panel-heading";
			var h4 = document.createElement("H6");
			h4.className = "panel-title";
			var dropDown = document.createElement("A");
			
			dropDown.innerHTML = "tab: " + (Number(j)+1);
			dropDown.setAttribute("href",'#tab'+j);
			dropDown.setAttribute("data-toggle","collapse");
			dropDown.setAttribute("data-parent","#accordion");
			dropDown.id = j;
			
			var collapse = document.createElement("DIV");
			collapse.id = "tab"+j;
			collapse.className = "collapse panel-collapse";
		
			var panBody = document.createElement("DIV");
			panBody.id = "tabBody"+j;
			panBody.className = "panel-body";
			
			collapse.appendChild(panBody);
			
			h4.appendChild(dropDown);
			panHead.appendChild(h4);
			
			panDef.appendChild(panHead);
			panDef.appendChild(collapse);
			
			document.getElementById("accordion").appendChild(panDef);
		
		}
	}
	
}

function createHistoryList(historyArray, index){
	
	var list = document.createElement("UL");
	
	for(var i=(historyArray.length-1); i>=0; i--){
		var nextItem = document.createElement("LI");
		var nextLink = document.createElement("A");
		
		nextLink.setAttribute("target", "_blank");
		nextLink.setAttribute("href", historyArray[i][1]);
		nextLink.innerHTML = historyArray[i][0];
		
		nextItem.appendChild(nextLink);
		list.appendChild(nextItem);
	}
		
		document.getElementById("tabBody"+index).appendChild(list);
		
}

