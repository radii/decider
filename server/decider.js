var http = require('http')
var util = require('util')
var fs = require('fs')
var URL = require('url')

var server = http.createServer(function(request, response) {
    u = URL.parse(request.url, true)
    if (u.pathname == '/stream') {
        response.writeHead(200, {'Content-Type': 'text/plain'})
        response.end('yep some stuff')
    } else {
        fname = u.pathname
        if (fname == '/') fname = 'demo.html'
        if (fname[0] == '/') fname = fname.slice(1)
        console.log("fname is " + fname)
        if (fname in {'jquery.js':1, 'jquery-ui.js':1, 'demo.html':1, 'style.css':1}) {
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            body = fs.readFile(fname, function(err, body) {
                response.end(body)
            })
        } else {
            response.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'})
            response.end('permission denied')
        }
    }
})

server.listen(4242)
