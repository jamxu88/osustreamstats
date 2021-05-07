const fetch = require('node-fetch');
const express = require('express')
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);
const url = 'your osu profile url'
http.listen(12125, async() => {
    console.log('server created')
})
//http://localhost:12125
app.get('/', (req, res) => {
    res.sendFile(__dirname+'/index.html')
})
app.use(express.static(__dirname))

async function get() {
    await fetch(url, {
        headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9',
            'sec-ch-ua': '"Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
        }
    }).then(async (resp) =>{
        var a = await resp.text()
        a = a.split('\n')
        var r;
        for(item in a) {
            if(a[item].includes('"rankHistory":{')) r = JSON.parse(a[item])
        }
        io.emit('update', r.statistics.global_rank,r.statistics.country_rank,r.statistics.pp)
    })
}
setInterval(function(){get()},10000)

