/*
* @Author: shen
* @Date:   2019-03-07 22:17:00
* @Last Modified by:   xvvx
* @Last Modified time: 2019-03-11 11:43:35
*/

// 加载模块
var express = require('express')
var router = require('./router.js')
var bodyParser = require('body-parser')

var app = express()

// 开放静态资源
app.use('/static', express.static('static'))
app.use('/node_modules', express.static('node_modules'))

// 配置模板引擎
app.engine('html', require('express-art-template'))

// 配置 body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 跨域
app.all('*', function (req, res, next) {
  // 设置允许跨域的域名，*代表允许任意域名跨域
  res.header('Access-Control-Allow-Origin', '*')
  // 允许的header类型
  res.header('Access-Control-Allow-Headers', 'content-type')
  // 跨域允许的请求方式
  res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS')
  if (req.method.toLowerCase() === 'options') {
    // 让options尝试请求快速结束
    res.send(200)
  } else {
    next()
  }
})

app.use(router)

app.listen('3030', function () {
  console.log('server is running')
})
