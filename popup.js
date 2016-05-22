var bg = chrome.extension.getBackgroundPage();

var popup = {
	aplicarTexto: function(value) {
		document.getElementById('valorGerado').value = value;
		document.getElementById('mensagem').style.display = "block";
	},

	setUtilizarMascara: function() {
		localStorage["utilizarMascara"] = document.querySelector('#utilizarMascara').checked;
	},

	isAplicarMascara: function() {
		return document.getElementById('utilizarMascara').checked;
	},

	selecionarTodoTexto: function() {
		document.getElementById('valorGerado').select();
	},

	copiarParaAreaTransferencia: function() {
		document.execCommand("copy");		
	},

	executeScriptInCurrentTab: function() {		
		popup.documento = this.gerar(popup.isAplicarMascara());
		
		popup.aplicarTexto(popup.documento);
		popup.selecionarTodoTexto();
		popup.copiarParaAreaTransferencia();

		chrome.tabs.getSelected(null, function(tab) {
			var code = {
				code: bg.util.gerateCodeScript(popup.documento)
			} 

			chrome.tabs.executeScript(tab.id, code);
		});
	},

	documento: null
}

document.addEventListener('DOMContentLoaded', function () {
	document.querySelector('#configuracao').href = chrome.extension.getURL("optionsPage.html"); 
	document.querySelector('#utilizarMascara').checked = (localStorage["utilizarMascara"] == 'true' ? 'checked' : '');
	document.getElementById('icon').src = chrome.extension.getURL('zombie-32.png'); 
	
	document.querySelector('#utilizarMascara').addEventListener('change', popup.setUtilizarMascara);
	document.querySelector('#gerarCpf').addEventListener('click', popup.executeScriptInCurrentTab.bind(bg.cpf));
	document.querySelector('#gerarCnpj').addEventListener('click', popup.executeScriptInCurrentTab.bind(bg.cnpj));	
	
});