var http = require('http')
var path = require('path')
var morgan = require('morgan')
var express = require('express')
var bodyParser = require('body-parser')

var app = express()

app.use(morgan('combined'))
app.use('static',
  express.static(path.join(__dirname, 'static')));

app.use(bodyParser.urlencoded({extend: false}))

app.set('views', path.join(__dirname, 'templates'))
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  return res.render('index', {title: 'Hello World'})
})

app.get('/form', function (req, res) {
  return res.render('form')
})

app.post('/form', function (req, res) {
  return res.render('result', {
    username: req.body.username,
    message: req.body.message
  })
})
var server = http.createServer(app)
server.listen(3000)
