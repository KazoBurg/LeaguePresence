const rest = require('./rest')
const file = require("./fileHandler")
const request = require("request")

// Read the riotapikey.txt and set it to this instance of the riotHelper
// Warning: This is somewhat of a race condition atm
var apiKey;
file.getRiotAPIKey(function(riotAPIKey) {
	apiKey = riotAPIKey;
});

module.exports = {
	updateAPIKey: function()
	{
		if (apiKey == undefined)
		{
			apiKey = file.getRiotAPIKey();
			console.log("Updated apiKey to " + apiKey)
		}
	},

	getSummonerByName: function(summonerName, callback)
	{
		console.log(apiKey);
	    var options = {
	        host: 'euw1.api.riotgames.com',
	        port: 443,
	        path: "https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/SaltyAsol?api_key=" + apiKey,
	        method: 'GET',
	        headers: {
	            'Content-Type': 'application/json'
	        }
	    };

	    rest.getJSON(options, function(statusCode, result) {
	        console.log("StatusCode: (" + statusCode + ")");
	        callback(result)
	    });
	},

	getCurrentGame: function(summonerId, callback)
	{
	    var options = {
	        host: 'euw1.api.riotgames.com',
	        port: 443,
	        path: "https://euw1.api.riotgames.com/lol/spectator/v3/active-games/by-summoner/" + summonerId + "?api_key=" + apiKey,
	        method: 'GET',
	        headers: {
	            'Content-Type': 'application/json'
	        }
	    };

	    rest.getJSON(options, function(statusCode, result) {
	        console.log("StatusCode: (" + statusCode + ")");
	        callback(result)
	    });
	},

	getChampionData: function(championId, callback)
	{
	    request({
	        url: "http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json",
	        json: true
	    }, function (error, response, body) {
	        if (!error && response.statusCode === 200) {

	            for (var champion in body.data)
	            {
	                if (body.data[champion].key == championId)
	                {
	                    callback(body.data[champion]);
	                }
	            }
	        }
	    });
	}
}
