/*
* @Author: shen
* @Date:   2019-03-07 22:45:21
* @Last Modified by:   xvvx
* @Last Modified time: 2019-03-27 11:59:11
*/

// 引入模块
var express = require('express')
var router = express.Router()

// 引入逻辑部分
var HandlerData = require('./handleData.js')

// 封装渲染页面
function renderPage (res, len, name) {
  res.render('index.html', {
    len: len,
    name: name + '已修改, 长度'
  })
}

////////////////
// 将设计的路由写成代码 //
////////////////

// 根目录
router.get('/', function (req, res) {
  res.render('index.html')
})

/***** 获取数据路由 *****/

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
  HandlerData.setComment(parseInt(artid), function (err, len) {
    if (err) throw err
    // 渲染页面
    renderPage(res, len, '评论')
  })
})

// 获取图片类型并永久化
router.get('/setImgCate', function (req, res) {
  HandlerData.setImgCate(function (err, len) {
    if (err) throw err
    renderPage(res, len, '图片类型')
  })
})

// 获取图片数据(图片列表和图片详情)并永久化
router.get('/setImg', function (req, res) {
  HandlerData.setImg(function (err, len) {
    if (err) throw err
    renderPage(res, len, '图片列表与详情')
  })
})

// 获取图片缩略图数据并永久化
router.get('/setImgPreview', function (req, res) {
  HandlerData.setImgPreview(function (err, len) {
    if (err) throw err
    renderPage(res, len, '图片缩略图')
  })
})

// 获取商品列表
router.get('/setGoods', function (req, res) {
  HandlerData.setGoods(function (err, len) {
    if (err) throw err
    renderPage(res, len, '商品')
  })
})

// 获取商品轮播图
router.get('/setGoodsSwiper', function (req, res) {
  HandlerData.setGoodsSwiper(function (err, len) {
    if(err) throw err
    renderPage(res, len, '商品轮播图')
  })
})

/***** 接口路由 *****/

// 轮播图接口
router.get('/lunbo', function (req, res) {
  HandlerData.getLunbo(function (err, data) {
    if (err) throw err
    res.send(data)
  })
})

// 新闻列表接口
router.get('/getNewsList', function (req, res) {
  HandlerData.getNewsList(function (err, data) {
    if (err) throw err
    res.send(data)
  })
})

// 新闻详情接口
router.get('/getNewsDetail', function (req, res) {
  var id = req.query.id
  // 同样注意 id 的格式
  HandlerData.getNewsDetail(parseInt(id), function (err, data) {
    if (err) throw err
    res.send(data)
  })
})

// 评论接口
router.get('/getComment', function (req, res) {
  var artid = req.query.artid
  var pageIndex = req.query.pageIndex
  HandlerData.getComment(parseInt(artid), parseInt(pageIndex), function (err, data) {
    if (err) throw err
    res.send(data)
  })
})

// 图片类型接口
router.get('/getImgCate', function (req, res) {
  HandlerData.getImgCate(function (err, data) {
    if (err) throw err
    res.send(data)
  })
})

// 图片列表接口
router.get('/getImgList', function (req, res) {
  var cateid = req.query.cateid
  HandlerData.getImgList(parseInt(cateid), function (err, data) {
    if (err) throw err
    res.send(data)
  })
})

// 图片详情接口
router.get('/getImgDetail', function (req, res) {
  var id = req.query.id
  HandlerData.getImgDetail(parseInt(id), function (err, data) {
    if (err) throw err
    res.send(data)
  })
})

// 图片缩略图接口
router.get('/getImgPreview', function (req, res) {
  var id = req.query.id
  HandlerData.getImgPreview(parseInt(id), function (err, data) {
    if (err) throw err
    res.send(data)
  })
})

// 商品列表接口
router.get('/getGoodsList', function (req, res) {
  var pageIndex = req.query.pageIndex
  HandlerData.getGoodsList(parseInt(pageIndex), function (err, data) {
    if (err) throw err
    res.send(data)
  })
})

// 商品轮播图接口
router.get('/getGoodsSwiper', function (req, res) {
  var id = req.query.id
  HandlerData.getGoodsSwiper(parseInt(id), function (err, data) {
    if (err) throw err
    res.send(data)
  })
})

// 商品详情接口
router.get('/getGoodsDetail', function (req, res) {
  var id = req.query.id
  HandlerData.getGoodsDetail(parseInt(id), function (err, data) {
    if (err) throw err
    res.send(data)
  })
})

// 商品图文详情接口
router.get('/getGoodsRCMD', function (req, res) {
  var id = req.query.id
  HandlerData.getGoodsRCMD(parseInt(id), function (err, data) {
    if (err) throw err
    res.send(data)
  })
})

/***** 其他路由 *****/

// 提交评论
router.post('/postComment', function (req, res) {
  HandlerData.postComment(req.body, function (err) {
    if (err) throw err
    res.send({ message: 'ok', status: 0 })
  })
})

// 测试所用接口
router.get('/test', function (req, res) {
  HandlerData.test(function (err, data) {
    if (err) throw err
    res.send(data)
  })
})

module.exports = router
