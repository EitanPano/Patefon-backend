
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

        socket.on('join station', stationId => {
            if (socket.currStation === stationId) return;
            if (socket.currStation) {
                socket.leave(socket.currStation)
            }
            socket.join(stationId)
            socket.currStation = stationId
            socket.broadcast.to(socket.currStation).emit('someone joined the station', 'someone joined the station: ' + stationId)
        })

        socket.on('send share-listen', playerData => {
            socket.broadcast.to(socket.currStation).emit('get share-listen', playerData)
        })
    })
}

module.exports = {
    connectSockets,
}

// FRONTEND 
socketService.on('someone joined the station', (msg) => {
    const playerData = {
        songIdx: this.songIdx,
        playList: this.playList,
        currentTime: this.currentTime,
        songVolume: this.songVolume,
    }
    socketService.emit('send share-listen', playerData);
});

socketService.on('get share-listen', (playerData) => {
    this.player.loadPlaylist({
        playlist: playerData.playList,
        index: playerData.songIdx,
        startSeconds: playerData.currentTime,
    });
    this.currentTime = playerData.currentTime;
    this.playVideo();
});




