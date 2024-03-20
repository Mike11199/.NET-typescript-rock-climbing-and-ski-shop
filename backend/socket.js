const get_random = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

//https://socket.io/get-started/chat
const setupSocketEventListeners = (io) => {
  const admins = [];
  let activeChats = [];

  //back end connects to front end with this code, listening for this message
  io.on("connection", (socket) => {
    //server listens for message that admin is logged in
    socket.on("admin connected with server", (adminName) => {
      admins.push({ id: socket.id, admin: adminName });
    });

    //server listens for a client message
    socket.on("client sends message", (msg) => {
      console.log(msg);

      if (admins.length === 0) {
        socket.emit("no admin", "");
      } else {
        let client = activeChats.find(
          (client) => client.clientId === socket.id
        );
        let targetAdminId;

        if (client) {
          targetAdminId = client.adminId;
        } else {
          let admin = get_random(admins); //so only 1-1 communication
          activeChats.push({ clientId: socket.id, adminId: admin.id });
          targetAdminId = admin.id;
        }

        socket.broadcast
          .to(targetAdminId)
          .emit("server sends message from client to admin", {
            user: socket.id,
            message: msg,
          });
      }
    });

    //server listens for admin message
    socket.on("admin sends message", ({ user, message }) => {
      //server takes message from admin and emits back to clients
      socket.broadcast
        .to(user)
        .emit("server sends message from admin to client", message);
    });

    //server listens for admin closes chat
    socket.on("admin closes chat", (socketId) => {
      //server takes message and broadcast to that socket
      socket.broadcast.to(socketId).emit("admin closed chat", "");
      let c = io.sockets.sockets.get(socketId); //fix crash here?
      c.disconnect(); // reason:  server namespace disconnect
    });

    //server listens for admin disconnect
    socket.on("disconnect", (reason) => {
      //if admin disconnected remove admin from admin array
      const removeIndex = admins.findIndex((item) => item.id === socket.id);
      if (removeIndex !== -1) {
        admins.splice(removeIndex, 1);
      }

      activeChats = activeChats.filter((item) => item.adminId !== socket.id);

      //if client disconnected remove client from active chats
      const removeIndexClient = activeChats.findIndex(
        (item) => item.clientId === socket.id
      );
      if (removeIndex !== -1) {
        activeChats.splice(removeIndexClient, 1);
      }

      socket.broadcast.emit("disconnected", {
        reason: reason,
        socketId: socket.id,
      }); //emit to all
    });
  });
  return io;
};

module.exports = setupSocketEventListeners;
