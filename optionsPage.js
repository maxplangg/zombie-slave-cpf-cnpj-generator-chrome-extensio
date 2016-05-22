document.addEventListener('DOMContentLoaded', function () {
	loadOptions();	
	document.getElementById('scritpParaExecucao').addEventListener('change', saveOptions);	
	document.getElementById('icon').src = chrome.extension.getURL('zombie-32.png'); 
});

function saveOptions() {
  	chrome.storage.sync.set( {"scritpParaExecucao": document.getElementById('scritpParaExecucao').value }, function() {
	    document.getElementById('status').textContent = 'Cerebro armazenado para consumo.';
	    
	    setTimeout(function() {
      		document.getElementById('status').textContent = '';
    	}, 1000);
  	});
}

function loadOptions() {
	chrome.storage.sync.get("scritpParaExecucao", function (obj) {
		document.getElementById('scritpParaExecucao').value = obj.scritpParaExecucao;
	});
}