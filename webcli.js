'use strict';

module.exports = function (app) {
	app.post("/api/webcli", function (req, res) {
		var result = new CmdResult("invalid command", false, true);
		try{
			var args = getArgs(req.body.cmdline);
			var cmd = args[0].toUpperCase();
			result = _commands[cmd].func(args); //run command
		}
		finally{
			res.send(result); //send result in our response
		}
	});
};

class CmdResult{
	constructor(output, isHTML, isError){
		this.output = output || ""; //success or error output
		this.isHTML = isHTML || false; //text or html string output
		this.isError = isError || false; //true if output is error message
	}
}

function getArgs(cmdLine) {
	var tokenEx = /[^\s"]+|"[^"]*"/g;
	var quoteEx = /"/g;
	var args = cmdLine.match(tokenEx);
	//remove quotes from args
	for (var i = 0; i < args.length; i++) {
		args[i] =args[i].replace(quoteEx, '');
	}
	return args;
}

var _commands = {};
class Command{
	constructor(help, func){
		this.help = help; //help description for command
		this.func = func; //function that implements the command
	}
}

_commands.ECHO = new Command("Echoes back the first <token> recieved", function (args) {
	if (args.length >=2) {return new CmdResult(args[1]);
	}
	return new CmdResult("");
});