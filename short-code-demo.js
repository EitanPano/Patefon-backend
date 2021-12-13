
// BACKEND 
var gIo = null
function connectSockets(http, session) {
    gIo = require('socket.io')(http, {
        cors: {
            origin: '*',
        }
    })
    gIo.on('connection', socket => {
        socket.on('disconnect', socket => {
        })

        socket.on('station-join', stationId => {
            if (socket.currStation === stationId) return;
            if (socket.currStation) {
                socket.leave(socket.currStation)
            }
            socket.join(stationId)
            socket.currStation = stationId
            socket.broadcast.to(socket.currStation).emit('station-joined', 'someone joined the station: ' + stationId)
        })

        socket.on('share-player-data', playerData => {
            socket.broadcast.to(socket.currStation).emit('sync-player-data', playerData)
        })
    })
}

// FRONTEND 
socketService.on('station-joined', (msg) => {
    const playerData = {
        songIdx: this.songIdx,
        playList: this.playList,
        currentTime: this.currentTime,
    }
    socketService.emit('share-player-data', playerData);
});

socketService.on('sync-player-data', (playerData) => {
    this.player.loadPlaylist({
        playlist: playerData.playList,
        index: playerData.songIdx,
        startSeconds: playerData.currentTime,
    });
    this.playVideo();
});




