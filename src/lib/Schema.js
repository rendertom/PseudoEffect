var Schema = (function() {
	var _schema = {
		binaryString: function(string) {
			return Types.isString(string);
		},
		file: function(string) {
			return Types.isFile(string) || Types.isString(string);
		},
		matchName: function(string) {
			return Types.isString(string);
		},
	};

	_schema.binaryString.required = true;
	_schema.file.required = true;
	_schema.matchName.required = false;

	var module = {};

	module.validate = function(object) {
		for (var property in _schema) {
			if (!_schema.hasOwnProperty(property)) {
				return;
			}

			if (_schema[property].required || object.hasOwnProperty(property)) {
				if (!_schema[property](object[property])) {
					throw 'PseudoEffect: property "' + property + '" is invalid';
				}
			}
		}
	};

	return module;
})();