var ErrorHandler = (function() {
	var module = {};

	module.show = function(error) {
		var message = error.toString();
		if (error instanceof Error) {
			message += '\nScript File: ' + File(error.fileName).displayName +
				'\nFunction: ' + arguments.callee.name +
				'\nError on Line: ' + error.line.toString();
		}
		alert(message);
	};

	return module;
})();