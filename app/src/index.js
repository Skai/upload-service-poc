import http from 'http'
import App from './app'
import web from './web'

const port = process.env.PORT

let httpServer = http.createServer()
httpServer.on('request', web)
httpServer.listen(port, function () {
  console.log('Listening on ' + httpServer.address().port)
})

let app = new App(httpServer)
