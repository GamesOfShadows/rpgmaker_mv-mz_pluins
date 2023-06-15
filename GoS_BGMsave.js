/*:
* @plugindesc Save multiple BGMs
* @author GamesOfShadows
* @help
* With this plugin (for RPGmaker MV & MZ) you can save multiple BGMs.
* To save a BGM use the saveBGM plugin-command and set an "ID", 
* to play it later at the saved spot use the playBGM plugin-command and use the same "ID".
* 
* ------------------------------------------------------------
* 
* - Plugin-Commands (MV):
* 
* change_fadeInTime <number>
* 
* saveBGM <id>
* 
* playBGM <id>
* 
* 
* Examples: 
* 
* change_fadeInTime 3
* 
* saveBGM Area1
* 
* playBGM Area1
* 
* - Plugin-Commands (MZ) - Change the settings later ingame:
* Same as MV, but without entering the commands.
* You have to select them and just input the values.
* 
* ------------------------------------------------------------
* 
* PS: I'm still "beginner" to something "advanced" regarding JS.
* If there are problems with a plugin,
* I will probably NOT be able to solve them!
* 
* ------------------------------------------------------------
* 
* Version: 1.0
* 
* - You can do everything you want with this plugin
* - You can use it commercially
* - You DON'T need to credit me
* 
* It's just a short & simple plugin. ^^
*
* @target MZ
* 
* @command change_fadeInTime
* @text Change fade-in time (in seconds)
* @desc 0 = no fade-in
* 
* @arg fadeInTime
* @text Change fade-in time
* @desc Input a Number
* @type number
* @default 1
* 
* @command saveBGM
* @text Save current playing BGM
* @desc Use a simple ID like "area1"
* 
* @arg ID
* @text ID
* @desc Input an ID e.g. "area1"
* @type string
* 
* @command playBGM
* @text Play a saved BGM
* @desc Use the same ID you used at saving
* 
* @arg ID
* @text ID
* @desc Input a saved ID e.g. "area1"
* @type string
* 
* @command reset_BGMsaves
* @text Remove all BGMsaves
* @desc Use it for example before a map-transfer
* 
* @target MV
* 
* @param fadeInTime
* @text Set fade-in time
* @type number
* @min 0
* @max 60
* @decimals 0
* @desc Set the fade-in time (in seconds) / 0 = no fade-in
* @default 1
*/

var GoS_BGMsaveArray = [];

(() => {
	const pluginName = "GoS_BGMsave";
	var GoS_BGMfadeIn = Number(PluginManager.parameters(pluginName).fadeInTime);

//Plugin Commands (MZ)
	if (Utils.RPGMAKER_NAME == "MZ") {
		PluginManager.registerCommand(pluginName, "change_fadeInTime", args => {
			GoS_BGMfadeIn = Number(args.fadeInTime);
		});
		PluginManager.registerCommand(pluginName, "saveBGM", args => {
			BGMsave(args.ID);
		});
		PluginManager.registerCommand(pluginName, "playBGM", args => {
			BGMplay(args.ID);
		});
		PluginManager.registerCommand(pluginName, "reset_BGMsaves", args => {
			GoS_BGMsaveArray = [];
		});
	};

//Plugin Commands (MV)
	if (Utils.RPGMAKER_NAME == "MV") {
		var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
		Game_Interpreter.prototype.pluginCommand = function(command, args) {
			_Game_Interpreter_pluginCommand.call(this, command, args);
			
			if (command === 'change_fadeInTime') {
				if (args.length >= 1) {
					GoS_BGMfadeIn = Number(args[0]);
				};
			} else if (command === 'saveBGM') {
				if (args.length >= 1) {
					BGMsave(args[0]);
				};
			} else if (command === 'playBGM') {
				if (args.length >= 1) {
					BGMplay(args[0]);
				};
			} else if (command === 'reset_BGMsaves') {
				GoS_BGMsaveArray = [];
			};
		};
	};
	
	//Functions
	function BGMsave(ID) {
		if (AudioManager._currentBgm != null) {
			var InArray = false;
			var GetIndex = 0;
			if (GoS_BGMsaveArray.length > 0) {
				GoS_BGMsaveArray.forEach(function(currentValue, index, arr) {
					if (currentValue[0] == ID) {
						InArray = true;
						GetIndex = index;
					};
				});
			};
			if (!InArray) {
				GoS_BGMsaveArray.push([ID, AudioManager._currentBgm.name, AudioManager._currentBgm.volume, AudioManager._currentBgm.pitch, AudioManager._currentBgm.pan, AudioManager.saveBgm().pos]);
			} else {
				GoS_BGMsaveArray[GetIndex][1] = AudioManager._currentBgm.name;
				GoS_BGMsaveArray[GetIndex][2] = AudioManager._currentBgm.volume;
				GoS_BGMsaveArray[GetIndex][3] = AudioManager._currentBgm.pitch;
				GoS_BGMsaveArray[GetIndex][4] = AudioManager._currentBgm.pan;
				GoS_BGMsaveArray[GetIndex][5] = AudioManager.saveBgm().pos;
			};
		};
	};

	function BGMplay(ID) {
		if (GoS_BGMsaveArray.length > 0) {
			var InArray = false;
			var GetIndex = 0;
			GoS_BGMsaveArray.forEach(function(currentValue, index, arr) {
				if (currentValue[0] == ID) {
					InArray = true;
					GetIndex = index;
				};
			});
			if (InArray) {
				AudioManager.playBgm({ name: GoS_BGMsaveArray[GetIndex][1], volume: GoS_BGMsaveArray[GetIndex][2], pitch: GoS_BGMsaveArray[GetIndex][3], pan: GoS_BGMsaveArray[GetIndex][4] }, GoS_BGMsaveArray[GetIndex][5]);
				if (GoS_BGMfadeIn > 0) {
					AudioManager.fadeInBgm(GoS_BGMfadeIn);
				};
			};
		};
	};

})();