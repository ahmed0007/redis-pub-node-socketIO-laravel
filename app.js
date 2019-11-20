const socketio = require('socket.io');
const express = require('express');
const http = require('http');
const redis = require('redis');
const bluebird = require('bluebird');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const CORE_APP_HOST = process.env.CORE_APP_HOST || 'http://localhost';


global.Promise = bluebird;
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


server.listen(process.env.PORT || 3000, ()=>{
    console.log("Server Listening on port: 3000 ...");
});


app.use((req, res)=>{
    return res.send("Use Socket.io Client")
})

// const redisClient = process.env.REDIS_URL? redis.createClient(process.env.REDIS_URL) : redis.createClient({
//   host: process.env.REDIS_HOST,
//   port: parseInt(process.env.REDIS_PORT) || undefined,
//   password: process.env.REDIS_PASS,
//   db: process.env.REDIS_DB
// })

var pub = redis.createClient();

io.on('connection', (socket) => {

  socket
  .on('location', async (data) => {
    try {
        var payload = JSON.stringify({
            data: 'Just For Test', 
        });

        pub.publish('worker.payload', payload);
        
    } catch (err) {
      console.error(err);
      socket.emit('error', "Couldn't publish location")
    }
  });
});


