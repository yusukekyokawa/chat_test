// モジュールオブジェクトの初期化
var fs = require('fs')
var server = require('http').createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'})
  var output = fs.readFileSync('./index.html', 'utf-8')
  res.end(output)
}).listen(8000)

var io = require('socket.io').listen(server)

// ユーザ管理ハッシュ
var userHash = {}

// イベントの定義
io.socket.on('connection', function (socket) {
  // 接続開始カスタムイベント(接続元ユーザを保持し、他ユーザへ通知)
  socket.on('connected', function (name) {
    var msg = name + 'が入室しました。'
    userHash[socket.id] = name
    io.socket.emit('publish', {value: msg})
  })

  // メッセージ送信カスタムイベント
  socket.on('publish', function (data) {
    io.socket.emit('publish', {value: data.value})
  })

  // 接続終了時組み込みイベント(接続元ユーザを削除し、他ユーザへ通知)
  socket.on('disconnect', function () {
    if (userHash[socket.id]) {
      var msg = userHash[socket.id] + 'が退出しました'
      delete userHash[socket.id]
      io.socket.emit('publish', {value: msg})
    }
  });
});
