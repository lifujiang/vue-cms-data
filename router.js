/*
* @Author: shen
* @Date:   2019-03-07 22:45:21
* @Last Modified by:   xvvx
* @Last Modified time: 2019-03-10 23:18:38
*/

// 引入模块
var express = require('express')
var router = express.Router()
var fs = require('fs')
var path = require('path')

// 引入逻辑部分
var HandlerData = require('./handleData.js')

// 封装渲染页面
function renderPage (res, len, name) {
  res.render('index.html', {
    len:  len,
    name: name + '已修改, 长度'
  })
}



////////////////
// 将设计的路由写成代码 //
////////////////

router.get('/', function (req, res) {
  res.render('index.html')
})

/*****获取数据路由*****/

// 获取轮播图数据并永久化
router.get('/setLunbo', function (req, res) {
  HandlerData.setLunbo(function (err, len) {
    if (err) throw err
    // 渲染页面
    renderPage(res, len, '轮播图')
  })
})

// 获取新闻数据并永久化
router.get('/setNews', function (req, res) {
  HandlerData.setNews(function (err, len) {
    if (err) throw err
    // 渲染页面
    renderPage(res, len, '新闻')
  })
})

// 获取评论数据并永久化
router.get('/setComment', function (req, res) {
  var artid = req.query.artid
  // 在传评论区域 id 时注意转格式
  HandlerData.setComment(parseInt(artid), function (err, len, name) {
    if (err) throw err
    // 渲染页面
    renderPage(res, len, name)
  })
})

/*****接口路由*****/

// 轮播图接口
router.get('/lunbo', function (req, res) {
  HandlerData.getLunbo(function (err, data) {
    if (err) throw err
    res.status(200).send(data)
  })

})

// 新闻列表接口
router.get('/getNewsList', function (req, res) {
  HandlerData.getNewsList(function (err, data) {
    if (err) throw err
    res.status(200).send(data)
  })
})

// 新闻详情接口
router.get('/getNewsDetail', function (req, res) {
  var id = req.query.id
  // 同样注意 id 的格式
  HandlerData.getNewsDetail(parseInt(id), function (err, data) {
    if (err) throw err
    res.status(200).send(data)
  })
})

module.exports = router
