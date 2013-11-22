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
        ftype = {'themes/smoothness/jquery-ui.css':'text/css',
                 'jquery.js':'text/javascript',
                 'jquery-ui.js':'text/javascript',
                 'demo.html':'text/html',
                 'style.css':'text/css'}
        if (fname in ftype) {
            response.writeHead(200, {'Content-Type': ftype[fname] + '; charset=utf-8'})
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
