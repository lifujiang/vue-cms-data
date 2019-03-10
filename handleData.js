/*
* @Author: shen
* @Date:   2019-03-09 10:50:24
* @Last Modified by:   xvvx
* @Last Modified time: 2019-03-10 23:31:15
*/

var fs = require('fs')
var path = require('path')
var GetData = require('./makeData.js')

//////////
// 函数封装 //
//////////

// 封装全局绝对地址
function fpath (fpath) {
  return path.join(__dirname, fpath)
}

// 封装随机数据写入 json 文件持久化
function writeData (name, data) {
  fs.writeFile(path.join(__dirname, 'data/' + name + '.json'), JSON.stringify(data), (err) => {
    if (err) return err
    console.log('文件已修改')
  })
}

// 从新闻随机数据中提取新闻列表的数据
function newsList (data, cb) {
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
  cb(newData)
}

// 从新闻随机数据中提取新闻详情的数据
function newsDetail (data, cb) {
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
  cb(newData)
}

//////////
// 功能逻辑区域 //
//////////

exports.setLunbo = function (cb) {
  var name = 'lunbo'
  var len = GetData[name].list.length
  var data = JSON.stringify(GetData[name])
  // 将轮播图随机数据写入文件
  var err = writeData(name, data)
  if (err) cb(err)
  cb(null, len)
}

exports.setNews = function (cb) {
  var name = 'news'
  var len = GetData[name].list.length
  var data = GetData[name]
  // 处理新闻列表数据, 从新闻数据中提取新闻列表数据并写入 json 中
  newsList(data, function (cdata) {
    var err = writeData('newsList', cdata)
    if (err) cb(err)
  })
  // 处理新闻详情数据, 从新闻数据中提取新闻详情数据并写入 json 中
  newsDetail(data, function (cdata) {
    var err = writeData('newsDetail', cdata)
    if (err) cb(err)
  })
  cb(null, len)
}

// 从评论随机数据中提取相应(新闻, 图片, 产品)评论数据并分别写入 json 中
exports.setComment = function (artid, cb) {
  /*artid代表不同区域的评论, 0为所有区域, 1为新闻, 2为图片, 3为商品*/
  // 通过 if 判断是否为修改所有评论
  if (artid === 0) {
    var adata = GetData['allComment']
    // 直接将获取的所有数据写入 json 中
    var err = writeData('comment', adata)
    if (err) cb(err)
    cb(null, '很长', '所有评论')
  }
  // 读取评论的 json 文件
  fs.readFile(fpath('data/comment.json'), 'utf-8', function (rerr, cmtdata) {
    if (rerr) cb(rerr)
    // 将下列变量定义在读文件内部代表如果读取失败也就没有必要获取假数据了
    var name = 'comment'
    var data = GetData[name]
    // 格式化读取的数据
    cmtdata = JSON.parse(cmtdata)
    var list = data.list
    // 匹配 artid 相同的项, 并将新获取的假数据代替原来的
    for (var item of cmtdata.cmt_area) {
      if (item.artid === artid) item.list = list
    }
    var len = list.length
    // 将修改后的数据重新写回 json 文件
    var werr = writeData('comment', cmtdata)
    if (werr) cb(werr)
    // 通过 if 和三元表达式判断评论的区域
    var cname = '新闻评论'
    if (artid !== 1) artid === 2 ? (cname = '图片评论') : (cname = '商品评论')
    cb(null, len, cname)
  })
}

// 获取轮播图
exports.getLunbo = function (cb) {
  fs.readFile(fpath('data/lunbo.json'), 'utf-8', function (err, data) {
    if (err) cb(err)
    cb(null, data)
  })
}

// 获取新闻列表
exports.getNewsList = function (cb) {
  fs.readFile(fpath('data/newsList.json'), 'utf-8', function (err, data) {
    if (err) cb(err)
    cb(null, err)
  })
}

exports.getNewsDetail = function (id, cb) {
    fs.readFile(fpath('data/newsDetail.json'), 'utf-8', function (err, data) {
    if (err) cb(err)
    var list = JSON.parse(data).list
    // 通过 ES6 数组的新方法 find 遍历找到内部相同 id 的项并返回
    data.list = list.find((item) => {
      return item.id === id
    })
    cb(null, data)
  })
}
