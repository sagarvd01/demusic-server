const express = require("express");
const app = express();
const fs = require("fs");
const songInfo = require('./songInfo.json');
const alertUsers = require('./alertUser');
const announcement = require('./announcement');
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
//epns channel => eip155:5:0xee6f3c8c7452AcafA0A2d2586552f8b77a3e4286
app.get('/songs', function(req, res){
    const songs = songInfo.list;
    res.status(200).send(songs);
})
app.get("/song/:title", function(req, res){
    console.log(req.params);
    if(songInfo.songs.indexOf(req.params['title'])){
        res.status(400).send("Song not available");
    }
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
    }
    console.log(__dirname, songInfo.info[req.params['title']])
    const song = __dirname + '/songs/' + songInfo.info[req.params['title']].file;
    console.log(song);
    const fileSize = fs.statSync(song).size;
    console.log(fileSize);
    const CHUNK_SIZE = 10 ** 5;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, fileSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "audio/mpeg",
    };
    res.writeHead(206, headers);
    const musicStream = fs.createReadStream(song, { start, end });
    musicStream.pipe(res);
})
app.get('/alertUsersAboutSubscription', alertUsers);
app.get('/sendAnnouncementToUsersOnNewSongs', announcement);
// app.get("/info/:song", function(req, res){
//     res.status(200).send(songInfo.info[req.params['song']]);
//     // res.status(200).send(songs);
// })
app.listen(8000, function () {
    console.log("Listening on port 8000!");
});