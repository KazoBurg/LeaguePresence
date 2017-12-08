fs = require('fs')

module.exports = {
	getRiotAPIKey: function(callback) {
		fs.readFile('__dirname/../riotapikey.txt', 'utf8', function (err, fileData) {
			if (err)
				return console.log(err);

			var lines = fileData.split("\n");
			var riotAPIKey = lines[1].substring(0, 42);
			if (riotAPIKey.length != 42)
				console.log("Your RiotAPI key seems to be invalid. Plese check if you have a valid key inside riotapikey.txt");

			callback(riotAPIKey);
		});
	}
}
