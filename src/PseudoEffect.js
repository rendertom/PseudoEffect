var PseudoEffect = (function() {
	// @include 'lib/ErrorHandler.js'
	// @include 'lib/FileEx.js'
	// @include 'lib/FolderEx.js'
	// @include 'lib/Schema.js'
	// @include 'lib/Types.js'
	
	var _cache, module;

	_cache = [];
	module = {};

	module.apply = function(layer, value) {
		try {
			switch (true) {
				case Types.isInteger(value):
					return module.applyByIndex(layer, value);
				case Types.isString(value):
					return module.applyByMatchName(layer, value);
				default:
					throw 'PseudoEffect: unsupported format. Expected Integer or String';
			}
		} catch (error) {
			ErrorHandler.show(error);
		}
	};

	module.applyByIndex = function(layer, index) {
		var cacheLength, object;

		try {
			cacheLength = _cache.length;
			if (index > cacheLength - 1) {
				throw ('PseudoEffect: Index ' + index + ' exceeds cache length of ' + cacheLength);
			}

			object = _cache[index];
			return applyFromObject(layer, object);
		} catch (error) {
			ErrorHandler.show(error);
		}
	};

	module.applyByMatchName = function(layer, matchName) {
		var effectsProperty, property;

		try {
			effectsProperty = getEffectsProperty(layer);
			if (effectsProperty.canAddProperty(matchName)) {
				property = effectsProperty.addProperty(matchName);
			} else {
				property = applyByMatchName(layer, matchName);
			}

			return property;
		} catch (error) {
			ErrorHandler.show(error);
		}
	};

	module.push = function(objects) {
		if (Types.isUndefined(_cache) || !Types.isArray(_cache)) {
			_cache = [];
		}

		if (!Types.isArray(objects)) {
			objects = [objects];
		}

		try {
			for (var i = 0, il = objects.length; i < il; i++) {
				Schema.validate(objects[i]);
				_cache.push(objects[i]);
			}
		} catch (error) {
			ErrorHandler.show(error);
		}
	};

	return module;



	function applyByMatchName(layer, matchName) {
		var object;

		for (var i = 0, il = _cache.length; i < il; i++) {
			if (_cache[i].matchName === matchName) {
				object = _cache[i];
			}
		}

		if (!object) {
			throw 'PseudoEffect: could not find effect by matchName "' + matchName + '"';
		}

		return applyFromObject(layer, object);
	}

	function applyFromObject(layer, object) {
		var ffxFile, matchName;

		ffxFile = getFFXFile(object);
		matchName = makePseudoEffectLive(ffxFile);

		return module.applyByMatchName(layer, matchName);
	}

	function getEffectsProperty(layer) {
		if (!Types.isLayer(layer)) {
			throw 'PseudoEffect: layer is not of Layer type';
		}

		return layer.property('ADBE Effect Parade');
	}

	function getFFXFile(object) {
		if (!FileEx.canWriteFiles()) {
			throw 'PseudoEffect: can not read/write files because of dissabled preferences';
		}

		return FileEx.createResourceFile(object.file, object.binaryString);
	}

	function makePseudoEffectLive(ffxFile) {
		var composition, layer, matchName;

		composition = app.project.items.addComp('temp', 4, 4, 1, 1, 24);
		layer = composition.layers.addShape();
		layer.applyPreset(ffxFile);

		matchName = getEffectsProperty(layer).property(1).matchName;
		composition.remove();

		return matchName;
	}
})();