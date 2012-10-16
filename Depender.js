function Depender() {
	this.loaded_list = [];
	this.callbacks   = [];
	if(!this.container) this.container = document.body;
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
		var xmlHttpRequest = new XMLHttpRequest();
		if (xmlHttpRequest) {
			xmlHttpRequest.open("GET", url, true);                             
			xmlHttpRequest.onreadystatechange = function(){
				if((this.readyState == 4 && this.status == 200) || !this.status)
					callback(this.responseText);
			};
			xmlHttpRequest.send(null);
		}
	},
	create_script_tag:	function(container) {
		var script_tag = document.createElement("script");
		this.container.appendChild(script_tag);
		return script_tag;
	},
	depends:		function(url, callback) {
		this.callbacks.push(callback);
		var script_tag = this.create_script_tag();
		this.waiting_downloads++;
		this.loaded_list.push(url);
		this.download(url, function(response){
			script_tag.innerHTML = response + ";				\
				Depender.getInstance().waiting_downloads--;		\
				if(Depender.getInstance().waiting_downloads == 0) {	\
					var cb = Depender.getInstance().callbacks.pop();\
					if(cb.constructor == Function)			\
						cb.call();				\
				}							\
			";
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
