function Depender() {
	this.loaded_list = [];
}

Depender.getInstance = function() {
	if(!Depender.instance)
		Depender.instance = new Depender();
	return Depender.instance;
};

Depender.prototype = {
	waiting_downloads:	0,
	loaded_list:		null,
	download:		function(url, callback) {
		var AJAX = new XMLHttpRequest();
		if (AJAX) {
			var _this = this;
			AJAX.open("GET", url, true);                             
			AJAX.onreadystatechange = function(){
console.log("running:");
console.log("readState: " + AJAX.readState);
console.log("status   : " + AJAX.status);
				if(AJAX.readyState == 4 && AJAX.status == 200)
					callback(AJAX.responseText);
			};
			AJAX.send(null);
		}
	},
	create_script_tag:	function(container) {
		if(!container) container = document.body;
		var script_tag = document.createElement("script");
		container.appendChild(script_tag);
		return script_tag;
	},
	depends:		function(url, callback) {
		var _this = this;
		var script_tag = _this.create_script_tag();
		_this.waiting_downloads++;
		_this.download(url, function(response){
			script_tag.innerHTML = response;
			_this.loaded_list.push(url);
			_this.waiting_downloads--;
			if(_this.waiting_downloads == 0)
				callback();
		});
	},
	already_loaded:		function(url) {
		for(var i = 0; i < this.loaded_list.length; i++) {
			if(url == this.loaded_list[i])
				return true;
		}
		return false;
	},
};
