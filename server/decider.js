var http = require('http')
var util = require('util')
var fs = require('fs')
var URL = require('url')
var crypto = require('crypto')

var sessions = {}

function rand_cookie() {
    var buf = crypto.randomBytes(15)
    return buf.toString('base64').replace(/\//g,'_').replace(/\+/g,'-')
}

function get_session(request) {
    var cookies = request.headers['cookie']
    var session = false
    if (cookies) {
        cookies.split('; ').every(function(c) {
                if (c in sessions) {
                    session = sessions[c]
                    return false
                }
                return true
        })
    }
    return session
}

var server = http.createServer(function(request, response) {
    var headers={}
    var session={}
    var cookie=""
    var u = URL.parse(request.url, true)
    session = get_session(request)
    console.log("cookie = " + request.headers['cookie'] + " session " + session)

    if (!session) {
        cookie = rand_cookie()
        sessions[cookie] = {ts: Date.now()}
        headers['Set-Cookie'] = cookie
    }
    if (u.pathname == '/poll') {
        response.writeHead(200, {'Content-Type': 'text/plain'})
        response.end('yep some stuff')
    } else {
        fname = u.pathname
        if (fname == '/') fname = 'demo.html'
        if (fname[0] == '/') fname = fname.slice(1)
        console.log("fname is " + fname)
        ftype = {'themes/smoothness/jquery-ui.css':'text/css',
                 'themes/smoothness/images/ui-bg_glass_75_e6e6e6_1x400.png':'image/png',
                 'themes/smoothness/images/ui-bg_glass_55_fbf9ee_1x400.png':'image/png',
                 'jquery.js':'text/javascript',
                 'jquery-ui.js':'text/javascript',
                 'demo.html':'text/html',
                 'style.css':'text/css'}
        if (fname in ftype) {
            headers['Content-Type'] = ftype[fname] + '; charset=utf-8'
            response.writeHead(200, headers)
            fs.readFile(fname, function(err, body) {
                response.end(body)
            })
        } else {
            response.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'})
            response.end('permission denied')
        }
    }
})

server.listen(4242)
