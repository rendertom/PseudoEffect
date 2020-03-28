var Types = (function() {
	var module = {};

	module.isArray = function(array) {
		return array instanceof Array;
	};

	module.isFile = function(file) {
		return file instanceof File;
	};

	module.isInteger = function(number) {
		return module.isNumber(number) && number === parseInt(number, 10);
	};

	module.isLayer = function(layer) {
		return layer instanceof AVLayer ||
			layer instanceof ShapeLayer ||
			layer instanceof TextLayer ||
			layer instanceof CameraLayer ||
			layer instanceof LightLayer;
	};

	module.isNumber = function(value) {
		return !isNaN(value);
	};

	module.isString = function(string) {
		return typeof string === 'string';
	};

	module.isUndefined = function(object) {
		return typeof object === 'undefined';
	};

	return module;
})();