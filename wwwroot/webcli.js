class WebCLI{
	constructor(){
		var self = this;
		self.history = [];
		self.cmdOffset = 0;

		self.createElement();
		self.wireEvents();
		self.showGreeting();
	}
	
	wireEvents(){
		var self = this;
		
		self.keyDownHandler = function (e) { self.onKeyDown(e); };
		self.clickHandler = function (e) { self.onClick(); };

		
		document.addEventListener('keydown', self.keyDownHandler);
		self.ctrlEl.addEventListener('click', self.clickHandler);
	}

	onClick(){
		this.focus();
	}
	
	onKeyDown(e){
		var self = this, ctrlStyle = self.ctrlEl.style;

		if (e.ctrlKey && e.keyCode==192) {
			if (ctrlStyle.display == "none") {
			    ctrlStyle.display = "";
			    self.focus();
			}			
			else {
			    ctrlStyle.display = "none";
			}	
			return;	
		}
		
		if (self.inputEl === document.activeElement) {
			switch (e.keyCode) {
			    
				case 13: return self.runCmd(); 

				case 38: if ((self.history.length + self.cmdOffset) > 0) {
					self.cmdOffset--;
					self.inputEl.value = self.history[self.history.length + self.cmdOffset];
					e.preventDefault();
				}
				break;

				case 40: if (self.cmdOffset < -1) {
					self.cmdOffset++;
					self.inputEl.value = self.history[self.history.length + self.cmdOffset];
					e.preventDefault();
				}
				break;
			}
		}
	}

	runCmd(){
		var self = this, txt = self.inputEl.value.trim();

		self.cmdOffset = 0;
		self.inputEl.value = "";
		self.writeLine(txt,"cmd");
		if (txt ==="") {return;}
		self.history.push(txt);

		//client cmd
		var tokens = txt.split(" "),
			cmd = tokens[0].toUpperCase();

		if (cmd === "CLS"){self.outputEl.innerHTML = ""; return;} 
		if (cmd === "IMG"){self.writeHTML("<img src='https://duckduckgo.com/i/0227507d.png'>"); return;} 
		if (cmd === "YOUTUBE"){self.writeHTML('<iframe width="560" height="315" src="https://www.youtube.com/embed/B1JeuKOm--M?autoplay=1" frameborder="0" allowfullscreen></iframe>'); return;} 
		//server cmd
		fetch("/api/webcli",{
			method: "post",
			headers: new Headers({"Content-Type": "application/json"}),
			body: JSON.stringify({cmdline: txt})
		})
		.then(function (r){return r.json(); })
		.then(function (result){
			var output = result.output;
			var style = result.isError ? "error" : "ok";

			if (result.isHTML) {
				self.writeHTML(output);
			}
			else{
				self.writeLine(output, style);
			}
		})
		.catch(function(){self.writeLine("Error with server request", "error");})
	}
	
	focus(){
		this.inputEl.focus();
	}

	scrollToBottom(){
		this.ctrlEl.scrollTop = this.ctrlEl.scrollHeight;
	}

	newLine(){
		this.outputEl.appendChild(document.createElement("br"));
		this.scrollToBottom();
	}
	
	writeHTML(markup){
		var div = document.createElement("div");
		div.innerHTML = markup;
		this.outputEl.appendChild(div);
		this.newLine();
	}

	writeLine(txt, cssSuffix){
		var span = document.createElement("span");
		cssSuffix = cssSuffix || "ok";
		span.className = "webcli-" + cssSuffix;
		span.innerText = txt;
		this.outputEl.appendChild(span);
		this.newLine();
	}

	showGreeting(){
		this.writeLine("Web CLI [version 0.0.1]", "cmd");
		this.newLine();
	}

	createElement(){
		var self = this, doc = document;
		
		self.ctrlEl = doc.createElement("div");
		self.outputEl = doc.createElement("div");					
		self.inputEl = doc.createElement("input");
		self.busyEl = doc.createElement("div");
	
		self.ctrlEl.className = 'webcli';	
		self.outputEl.className = 'webcli-output';
		self.inputEl.className = 'webcli-input';
		self.busyEl.className = 'webcli-busy';

		
		self.ctrlEl.appendChild(self.outputEl);
		self.ctrlEl.appendChild(self.inputEl);
		self.ctrlEl.appendChild(self.busyEl);

		
		self.ctrlEl.style.display = 'none';
		doc.body.appendChild(self.ctrlEl);
	}
	
}