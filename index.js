const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const DiscordRPC = require("discord-rpc");

const static = require('./src/staticData')
const riotHelper = require('./src/riotHelper')

// This is the basic client ID for the Discord API
const ClientId = '384694314241884163';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 300,
    resizable: false,
    titleBarStyle: 'hidden',
	icon: path.join(__dirname, '/Icon.ico'),
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null)
    createWindow();
});

// only needed for discord allowing spectate, join, ask to join
DiscordRPC.register(ClientId);

const rpc = new DiscordRPC.Client({ transport: 'ipc' });
const startTimestamp = new Date();

async function setActivity() {
  if (!rpc || !mainWindow)
	return;

	riotHelper.getSummonerByName("Salty ASol", function(summoner) {
		riotHelper.getCurrentGame(summoner.id, function(game) {
	        //console.log(game);

	        for (var participant in game.participants)
	        {
	            if (game.participants[participant].summonerId == summoner.id)
	            {
	            	riotHelper.getChampionData(game.participants[participant].championId, function(champion) {
	                	console.log(champion.id);
	                	rpc.setActivity({
	                        details: "In Game | " + static.gameType[game.gameType] + " " + static.gameMap[game.mapId],
	                        startTimestamp,
	                        largeImageKey: 'league',
	                        smallImageKey: champion.id.toLowerCase(),
	                        smallImageText: "Playing: " + champion.name,
	                        instance: false,
	                	});
	            	});
	        	}
			}
		});
	});
}

rpc.on('ready', () => {
	setActivity();

	// activity can only be set every 15 seconds
	setInterval(() => {
		setActivity();
	}, 15e3);
});

rpc.login(ClientId).catch(console.error);
