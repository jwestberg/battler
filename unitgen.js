var fs = require('fs')

function writeFile(obj, filename) {
	fs.writeFile(filename, JSON.stringify(obj), function(err) {
		if(err) throw err;
		console.log("Wrote "+Object.keys(obj).length+" entries to "+filename);
	});
}

fs.readdir('units', function(err, unitFileArray) {
	if(err) throw err;
	var regiments = {};
	var ships = {};
	for (var i = 0; i < unitFileArray.length; i++) {
		var unitFile = unitFileArray[i];
		var lines = fs.readFileSync('units/'+unitFile, {'encoding': 'UTF8'}).split('\n');
		var obj = {};

		for(var j = 0; j < lines.length; j++) {
			if(lines[j].trim()!='' && lines[j].indexOf('=')>=0) {
				pair = lines[j].trim().split('=');
				obj[pair[0].trim()] = pair[1].trim();
			}
		};

		unitName = unitFile.substring(0, unitFile.length - 4);
		if(obj.type == 'cavalry' || obj.type == 'infantry' || obj.type == 'artillery') {
			regiments[unitName] = obj;
		} else {
			ships[unitName] = obj;
		}
	};

	writeFile(regiments, "regimentdata.js");
	writeFile(ships, "shipdata.js");
});
