module.exports = function base(io) {
    io.on("connection", socket => {
        console.log("somebody has connected. yay! their socket id is ", socket.id);
        console.log(`${Object.keys(io.sockets.sockets).length} connected sockets!`);
        socket.on("disconnect", () => {
            console.log("somebody had disconnected");
        });

        socket.on("someKindOfAClick", object => {
            console.log("there was some kind of a click");
            console.log(object.impossible);
            io.to(socket.id).emit("hello from the server side");
        });

        socket.on("sendMessage", (peerId, message) => {
            console.log(peerId);
            io.to(peerId).emit("sendMessage", message);
        });
    });
};