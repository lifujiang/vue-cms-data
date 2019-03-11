/*
* @Author: shen
* @Date:   2019-03-09 10:50:24
* @Last Modified by:   xvvx
* @Last Modified time: 2019-03-11 14:09:55
*/

var fs = require('fs')
var path = require('path')
var GetData = require('./makeData.js')
var moment = require('moment')

//////////
// 函数封装 //
//////////

// 封装全局绝对地址
function fpath (fpath) {
  return path.join(__dirname, fpath)
}

// 文件持久化 --- 封装随机数据写入 json 文件持久化
function writeData (name, data) {
  fs.writeFile(path.join(__dirname, 'data/' + name + '.json'), JSON.stringify(data), (err) => {
    if (err) return err
    console.log('文件已修改')
  })
}

// 提取新闻列表 --- 从新闻随机数据中提取新闻列表的数据
function newsList (data) {
  var list = []
  var newData = {}
  // 第一次循环遍历数组里的每一个对象
  for (var obj of data.list) {
    // 对象必须定义在内部, 否则 push 时会出问题
    var newsObj = {
      id: '',
      img: '',
      title: '',
      date: '',
      click: ''
    }
    // 第二次循环遍历对象里的每一个键值对
    for (var item in obj) {
      // 当所需属性存在则获取
      if (newsObj[item] !== undefined) newsObj[item] = obj[item]
    }
    // 将完整的一个对象 push 进数组
    list.push(newsObj)
  }
  // 获取原数据的 static
  newData.status = data.status
  newData.list = list
  // 回调传数据回去
  return newData
}

// 提取新闻详情 --- 从新闻随机数据中提取新闻详情的数据
function newsDetail (data) {
  var list = []
  var newData = {}
  // 这里的操作同上
  for (var obj of data.list) {
    var newsObj = {
      id: '',
      title: '',
      subtitle: '',
      date: '',
      click: '',
      content: ''
    }
    for (var item in obj) {
      if (newsObj[item] !== undefined) newsObj[item] = obj[item]
    }
    // console.log(obj)
    list.push(newsObj)
  }
  // console.log(list)
  newData.status = data.status
  newData.list = list
  return newData
}

//////////
// 功能逻辑区域 //
//////////

// 轮播图 --- 从 mockjs 获取随机轮播图数据并写入 json 中
exports.setLunbo = function (cb) {
  var name = 'lunbo'
  var data = GetData[name]
  var len = data.list.length
  // 将轮播图随机数据写入文件
  var err = writeData(name, data)
  if (err) cb(err)
  cb(null, len)
}

// 新闻 --- 从 mockjs 获取随机新闻数据并写入 json 中
exports.setNews = function (cb) {
  var name = 'news'
  var data = GetData[name]
  var len = data.list.length
  // 处理新闻列表数据, 从新闻数据中提取新闻列表数据并写入 json 中
  var cdata = newsList(data)
  var err = writeData('newsList', cdata)
  if (err) cb(err)
  // 处理新闻详情数据, 从新闻数据中提取新闻详情数据并写入 json 中
  cdata = newsDetail(data)
  err = writeData('newsDetail', cdata)
  if (err) cb(err)
  cb(null, len)
}

// 评论 --- 从 mockjs 获取随机评论并写入 json 中
exports.setComment = function (artid, cb) {
  var name = 'comment'
  var data = GetData[name]
  // 将所有评论写入文件
  var err = writeData(name, data)
  if (err) cb(err)
  cb(null, '很长')
}

// 轮播图接口 --- 从文件获取轮播图数据并作为接口数据
exports.getLunbo = function (cb) {
  fs.readFile(fpath('data/lunbo.json'), 'utf-8', function (err, data) {
    if (err) cb(err)
    cb(null, data)
  })
}

// 新闻列表接口 --- 从文件获取新闻列表据并作为接口数据
exports.getNewsList = function (cb) {
  fs.readFile(fpath('data/newsList.json'), 'utf-8', function (err, data) {
    if (err) cb(err)
    cb(null, data)
  })
}

// 新闻详情接口 --- 从文件获取新闻详情据并作为接口数据
exports.getNewsDetail = function (id, cb) {
  fs.readFile(fpath('data/newsDetail.json'), 'utf-8', function (err, data) {
    if (err) cb(err)
    // 将 json 格式转为对象
    data = JSON.parse(data)
    var list = data.list
    // 通过 ES6 数组的新方法 find 遍历找到内部相同 id 的项并返回
    data.list = list.find((item) => {
      return item.id === id
    })
    cb(null, data)
  })
}

// 获取随机评论假数据
exports.getComment = function (artid, pageIndex, cb) {
  fs.readFile(fpath('data/comment.json'), 'utf-8', function (err, data) {
    if (err) cb(err)
    // 根据不同 id 筛选出相应的评论
    data = JSON.parse(data).cmt_area.find((item) => {
      return item.artid === artid
    })
    // 计算每页显示 10 条内容
    var pageMin = (pageIndex - 1) * 10
    var pageMax = pageIndex * 10
    var list = data.list.slice(pageMin, pageMax)
    // 创建新的对象并传回
    var res = {}
    res.status = 0
    res.list = list
    cb(null, res)
  })
}

// 提交评论
exports.postComment = function (data, cb) {
  fs.readFile(fpath('data/comment.json'), 'utf-8', function (err, fdata) {
    if (err) cb(err)
    fdata = JSON.parse(fdata)
    var artid = parseInt(data.artid)
    // 通过 moment 模块获取当前时间
    var now = moment().format('YYYY-M-D HH:mm:ss')
    // 遍历得到相同区域的评论
    var res = fdata.cmt_area.find((item) => {
      if (artid === item.artid) return item
    })
    // 将获取的评论数据放入对象中
    var cmt = {}
    cmt.user_name = data.cmt_name
    cmt.content = data.cmt_content
    cmt.add_time = now
    // 将获取的评论 push 进该区域评论中
    res.list.unshift(cmt)
    // 通过遍历的方式将新的区域评论覆盖原来的
    for (var item of fdata.cmt_area) {
      if (item.artid === artid) item = res
    }
    // 写入 json 中
    writeData('comment', fdata)
    // 这里一定要调用回调函数, 否则将出不去了!!!
    cb()
  })
}
