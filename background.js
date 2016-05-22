var contextMenu = {
	menuPai: chrome.contextMenus.create({"title": "Zombie Slave - CPF/CNPJ generator", "contexts": ['editable', 'selection']}),

	createContextMenu: function () {
		chrome.contextMenus.create(contextMenu.configSubMenu("CPF", contextMenu.executeScriptSemMascara.bind(cpf)));
		chrome.contextMenus.create(contextMenu.configSubMenu("CPF (com máscara)", contextMenu.executeScriptComMascara.bind(cpf)));
		chrome.contextMenus.create(contextMenu.configSubMenu("CNPJ", contextMenu.executeScriptSemMascara.bind(cnpj)));
		chrome.contextMenus.create(contextMenu.configSubMenu("CNPJ (com máscara)", contextMenu.executeScriptComMascara.bind(cnpj)));
	},

	configSubMenu: function(title, eventClick) {
		return {
			"title": title,
			"parentId": contextMenu.menuPai,
			"contexts": ['editable'],
			"onclick": eventClick
		}
	},

	executeScriptSemMascara: function(info, tab) {	
		return chrome.tabs.executeScript(tab.id, { code: util.gerateCodeScript(this.gerar(), true) });
	},

	executeScriptComMascara: function(info, tab) {
		return chrome.tabs.executeScript(tab.id, { code: util.gerateCodeScript(this.gerar(true), true) });
	}
}

var cpf = {
	numerosAleatorios: null,
	multiplicadoresDv1: [2, 3, 4, 5, 6, 7, 8, 9, 10 ],
	multiplicadoresDv2: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ],

	gerar: function(isAplicarMascara) {
		
		cpf.numerosAleatorios = util.startNumerosAleatorios(9);

		var digitoVerificador1 = util.calculaDigitoVerificador.call(cpf, cpf.multiplicadoresDv1);

		cpf.numerosAleatorios.unshift(digitoVerificador1);

		var digitoVerificador2 = util.calculaDigitoVerificador.call(cpf, cpf.multiplicadoresDv2);

		cpf.numerosAleatorios.shift();
		cpf.numerosAleatorios.reverse();
		cpf.numerosAleatorios.push(digitoVerificador1);
		cpf.numerosAleatorios.push(digitoVerificador2);

		var cpfGerado = util.retornarValorGerado.call(cpf, isAplicarMascara);
		
		util.limparNumerosAleatorios.call(cpf);

		return cpfGerado;
	},

	aplicarMascara: function(cpf) {
		return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g,"\$1.\$2.\$3\-\$4");
	}
}

var cnpj = {
	numerosAleatorios: null,
	multiplicadoresDv1: [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5 ],
	multiplicadoresDv2: [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5, 6 ],
				        
	gerar: function (isAplicarMascara) {		
		
		cnpj.numerosAleatorios = util.startNumerosAleatorios(8, true);

		var digitoVerificador1 = util.calculaDigitoVerificador.call(cnpj, cnpj.multiplicadoresDv1);

		cnpj.numerosAleatorios.unshift(digitoVerificador1);

		var digitoVerificador2 = util.calculaDigitoVerificador.call(cnpj, cnpj.multiplicadoresDv2);

		cnpj.numerosAleatorios.shift();
		cnpj.numerosAleatorios.reverse();
		cnpj.numerosAleatorios.push(digitoVerificador1);
		cnpj.numerosAleatorios.push(digitoVerificador2);

		var cnpjGerado = util.retornarValorGerado.call(cnpj, isAplicarMascara);

		util.limparNumerosAleatorios.call(cnpj);

		return cnpjGerado;
	},

	aplicarMascara: function(cnpj) {
		return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,"\$1.\$2.\$3\/\$4\-\$5");
	}
}

var util = {
	startNumerosAleatorios: function(quantidade, isCnpj) {
		var numeros = new Array(quantidade);

		for (var i = numeros.length - 1; i >= 0; i--) {
			numeros[i] = util.gerarNumeroRandomico();
		}

		if(isCnpj) {
			numeros.unshift(0);
			numeros.unshift(0);
			numeros.unshift(0);
			numeros.unshift(1);
		}

		return numeros;
	},	

	limparNumerosAleatorios: function () {
		return this.numerosAleatorios = null;
	},

	calculaDigitoVerificador: function(multiplicadores) {
		var dv = this.numerosAleatorios.reduce( function (total, num, index) {
			return total + num * multiplicadores[index]; 
		} , 0);

	   	dv = 11 - ( dv % 11 );

		return (dv>=10) ? 0 : dv;
	},

	gerarNumeroRandomico: function gerarNumeroRandomico() {
	    return Math.round(Math.random()*9);
	},

	retornarValorGerado: function (isAplicarMascara) {
		return (isAplicarMascara) ? this.aplicarMascara(this.numerosAleatorios.join("")) : this.numerosAleatorios.join("");
	},

	gerateCodeScript: function(cpfCnpj, isContextMenu){					
		var codigo;
		var codigoSalvo = util.options.replace(/[\"\']/g, '\\"').replace("{cpfCnpj}", cpfCnpj);

		if (isContextMenu != undefined && isContextMenu) {
			codigo = "document.activeElement.value = '" + cpfCnpj + "';" + codigoSalvo;
		} else {			
			codigo = "location.href = 'javascript: !(function GRRRRHRRMM () { " + codigoSalvo + " })()'";
		}

		return codigo;
	},	

	loadOptions: function() {
		chrome.storage.sync.get("scritpParaExecucao", function (obj) {
			util.options = obj.scritpParaExecucao;
		})	
	},

	options: null
}

if (localStorage["utilizarMascara"] == null) { localStorage["utilizarMascara"] = 'false'; }

contextMenu.createContextMenu();
util.loadOptions();