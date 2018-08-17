'use strict'

var log4js = require('log4js')
log4js.configure({
  appenders: { 'out': { type: 'stdout' } },
  categories: { default: { appenders: ['out'], level: 'info' } }
})
var logger = log4js.getLogger('log')
logger.level = 'debug'

const net = require('net')
const PORT = 47000
const HOST = 'localhost'

class Client {
  constructor (port, address) {
    this.socket = new net.Socket()
    this.address = address || HOST
    this.port = port || PORT
    this.init()
  }

  init () {
    var client = this
    client.socket.connect(client.port, client.address, () => {
      logger.debug(`Client connected to: ${client.address} :  ${client.port}`)
    })

    client.socket.on('close', () => {
      logger.debug('Client closed')
    })
  }

  sendMessage (message) {
    var client = this
    return new Promise((resolve, reject) => {
      client.socket.write(message + '\n')

      client.socket.on('data', (data) => {
        logger.debug(message)
        logger.debug('about to promise something:\n' + data)
        // need to make sure we are in correct promise!!!!!
        // to avoid multiple incorrect returned values
        resolve(data)
        if (data.toString().endsWith('exit')) {
          client.socket.destroy()
        }
      })

      client.socket.on('error', (err) => {
        reject(err)
      })
    })
  }
}
module.exports = Client
