// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
httpServer.listen(8080);

// Any normal http request
function requestHandler(req, res) {
	// Read index.html
	fs.readFile(__dirname + '/index.html', 
		// Callback function for reading
		function (err, data) {
			// if there is an error
			if (err) {
				res.writeHead(500);
				return res.end('Error loading index.html');
			}
			// Otherwise, send the data, the contents of the file
			res.writeHead(200);
			res.end(data);
  		}
  	);
}

var players = [];
var readytoplay = [];
var currentplayers = [];
var currentgames = [];

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', 
	// We are given a websocket object in our function

	function (socket) {

		console.log("We have a new client: " + socket.id);

		//object of players data
		var obj = {};
		obj.id = socket.id;
		console.log(obj.id);

		obj.socket = socket;

		obj.wantstoplay = false;
		console.log(obj.wantstoplay);

		obj.isplaying = false;
		console.log(obj.isplaying);

		obj.gameid= "";
		console.log(obj.gameid);

		obj.iswinner = false;
		console.log(obj.iswinner);

		obj.name = 'default';
		console.log(obj.name);

		//push objects to player[] array

		players.push(obj);
		//console.log(players);


		//if player clicks "compete" mark .wantstoplay as true and push player object into ready to readytoplay[]
		// keep track of who is available to compete
		socket.on('newplayer', function(){
			console.log("new player received");
			console.log(socket.id);

				for (var i = 0; i < players.length; i++){

					console.log("players[i]:" + players[i].id );

					if(players[i].id == socket.id){
					players[i].isplaying = false;
					players[i].wantstoplay = true;
					players[i].gameid= "";




					console.log("wants to play:" + players[i].id);
					};
				};

			//send all player data to player who clicked compete
			//socket.emit('availableplayers', players)

			//sort through players if they want to play but not currently in game 
			for (var i = 0; i < players.length; i++){
                    if (players[i].wantstoplay && !players[i].isplaying){

                    	//try to add them to an available game
                    	for ( g = 0; g < currentgames.length; g++){
							if (currentgames[g].competitors.length < 2 && !players[i].isplaying){
								currentgames[g].competitors.push(players[i]);
								players[i].isplaying = true;
								players[i].gameid = currentgames[g].id; //???

								console.log("Adding " + players[i].id + " to game " + currentgames[g].id);
								//start game for player

								if (currentgames[g].competitors.length == 2) {
									
									var colors = {}
									colors.r = Math.floor(Math.random()*256);
									colors.g = Math.floor(Math.random()*256);
									colors.b = Math.floor(Math.random()*256);

									socket.emit('startplay', colors);

									//start game for other players in game
									currentgames[g].competitors[0].socket.emit('startplay', colors);
									currentgames[g].competitors[0].gameid = currentgames[g].id
								}

							};
                    	};

                    	//if no available games start new game
                    	if(!players[i].isplaying){

                    		//new object for each game
                    		var newgame = {};
                    		//unigue ID for each game
                    		newgame.id = Math.floor(Math.random()*10000);
                    		//array in game object to keep track of players in the game
                    		newgame.competitors = [];

                    		//push newgame players into new game 
                    		newgame.competitors.push(players[i]);

                    		console.log("New Game:" + newgame.id + " player: " + players[i].id );

                    		//push to array of game objects
                    		currentgames.push(newgame);
                    		players[i].isplaying = true;
                    	};
                    };
            //socket.emit('availableplayers', readytoplay)
        	};


        //find last three players stored in readytoplay[] and start play for those three players
		// if(readytoplay.length > 1){
		// 	for (var i = readytoplay.length; i > 0; i-- ){

		// 		// if (.isplaying isn't true && only 3 players??

		// 		socket.emit('startplay', readytoplay) // to that specfic player??

		// 		//if play is started push player object into currentplayers[]
		// 		//keep track of who is playing
		// 		currentplayers.push(readytoplay[i])

		// 		//mark .isplaying as true
		// 		//help sort readytolay[]??

		// 		//mark .isplaying as true // how????
		// 		//obj[socket.id].isplaying = true;
		// 	}
		// };

	});
		//if there is a winner inform other current players that they have lost
		socket.on('newwinner', function (){

			console.log("new winner");

			var currentgameid = "";
			var loser = ""

			for (var i = 0; i < players.length; i++){
				if (players[i].socket == socket){
					// currentgameid = players[i].gameid 
					players[i].iswinner = true;
				} else {
					loser = players[i];
				};
			};

				loser.socket.emit('youlost');
			});
					
});
