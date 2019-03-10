/*
* @Author: shen
* @Date:   2019-03-07 22:45:21
* @Last Modified by:   shen
* @Last Modified time: 2019-03-10 21:18:09
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
    len: '已修改, 长度为' + len,
    name: name
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
  var name = 'comment'
  var data = GetData[name]
  // fs.readFile(fpath('data/comment.json'), 'utf-8', function (err, data) {
  //   if (err) throw err
  // })
  // var len = 1
  // HandlerData.newsComment(data, artid, function (cdata) {

  // })
  // 渲染页面
  // renderPage(res, len, '轮播图')
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
    res.status(200).send(data)
  })
})

// 新闻详情接口
router.get('/getNewsDetail', function (req, res) {
  var id = req.query.id
  HandlerData.getNewsDetail(id, function (err, data) {
    if (err) throw err
    res.status(200).send(data)
  })
})

module.exports = router
