var FolderEx = (function() {
	var module = {};

	module.ensureFolderExists = function(folder) {
		folder = module.getFolderObject(folder);

		if (!folder.exists) {
			if (!folder.create()) {
				throw 'Could not create folder ' + folder.fsName;
			}
		}

		return folder;
	};

	module.getFolderObject = function(folder) {
		return (folder instanceof Folder) ? folder : new Folder(folder);
	};

	return module;
})();