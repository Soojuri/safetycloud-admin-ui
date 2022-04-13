import mqtt from 'mqtt'

const Mqtt = function (connection) {
  let options = {
    keepalive: 30,
    clientId: connection.clientId,
    username: connection.username,
    password: connection.password,
    protocol: 'wss',
    useSSL: true,
    connectTimeout: 3000 * 10, // 超时时间
    reconnectPeriod: 1000 * 10, //重连间隔
  }
  // const isHttps = 'https:' == document.location.protocol ? true : false
  // let url = null
  // if (isHttps) {
  //   url = `wss://${connection.host}:${connection.port}/mqtt`
  // } else {

  // }
  let url = `wss://${connection.host}:${connection.port}/mqtt`
  this.client = mqtt.connect(url, options)
  // 重连次数
  this.reconnectNum = 0
  // 连接
  this.link = function () {
    return new Promise((resolve, reject) => {
      this.client.on('connect', e => {
        console.log('mqtt 连接成功')
        resolve(this.client)
      })
      this.client.on('reconnect', error => {
        this.reconnectNum++
        if (this.reconnectNum >= 10) this.client.end(true)
        console.log('mqtt 正在重连:', error)
      })
      this.client.on('error', error => {
        console.log('mqtt 连接错误:', error)
      })
    })
  }
  this.subscribe = function (topic, options) {
    this.client.subscribe(topic, options, (err) => {
      if (!err) {
        console.log('-----------------------' + topic + '订阅成功-----------------------')
      } else {
        throw new Error(err)
      }
    })
  }
  this.publish = function (topic, sendMsg, options) {
    this.client.publish(topic, JSON.stringify(sendMsg), options, (err, a) => {
      if (!err) {
        console.log('-----------------------' + topic + '发送成功-----------------------')
      } else {
        throw new Error(err)
      }
    })
  }
  this.message = function (callback) {
    this.client.on('message', (topic, message) => {
      let data = JSON.parse(message.toString())
      callback(data, topic)
    })
  }
  // 关闭
  this.close = function () {
    this.client.end(true)
  }
}

export default Mqtt
