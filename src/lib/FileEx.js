var FileEx = (function() {
	var module = {};

	module.canWriteFiles = function() {
		var appVersion, commandID, scriptName, tabName;

		appVersion = parseFloat(app.version);
		commandID = 2359;
		tabName = 'General';
		if (appVersion >= 16.1) {
			commandID = 3131;
			tabName = 'Scripting & Expressions';
		}

		if (isSecurityPrefSet()) {
			return true;
		}

		scriptName = (!Types.isUndefined(script) && script.name) ? script.name : 'Script';
		alert(message = scriptName + ' requires access to write files.\n' +
			'Go to the "' + tabName + '" panel of the application preferences and make sure ' +
			'"Allow Scripts to Write Files and Access Network" is checked.');

		app.executeCommand(commandID);

		return isSecurityPrefSet();
	};

	module.createResourceFile = function(file, binaryString) {
		file = module.getFileObject(file);

		if (!file.exists) {
			file = module.writeFile(file, binaryString, 'BINARY');
		}

		return file;
	};

	module.getFileObject = function(file) {
		return (file instanceof File) ? file : new File(file);
	};

	module.writeFile = function(file, contents, encoding, openMode) {
		var success;

		file = module.getFileObject(file);
		FolderEx.ensureFolderExists(file.parent);
		encoding = encoding || 'UTF-8';
		openMode = openMode || 'w'; // 'a', 'e', 'r', 'w';

		file.encoding = encoding;
		file.open(openMode);
		success = file.write(contents);
		file.close();

		if (!success) {
			throw 'Unable to write file ' + file.fsName;
		}

		return file;
	};

	return module;



	function isSecurityPrefSet() {
		return app.preferences.getPrefAsLong(
			'Main Pref Section',
			'Pref_SCRIPTING_FILE_NETWORK_SECURITY'
		) === 1;
	}
})();