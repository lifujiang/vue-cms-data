/*
* @Author: shen
* @Date:   2019-03-09 10:50:24
* @Last Modified by:   xvvx
* @Last Modified time: 2019-03-23 03:08:46
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

// 获取指定对象 --- 封装随机数据获取相应信息对象
function spcfObj (nameList, data) {
  // 该数组存放每次循环后得到的对象 (push入内)
  var list = []
  // 该对象为最终结果, 存放着返回状态和指定对象的数组
  var newData = {}
  for (var obj of data) {
    // 该对象为获取指定键值对数据, 必须在循环内定义, 否则最后 push 时保存的数据为相同的结果(最后的结果)
    var newObj = {}
    // 循环为每一项需要的对象键赋空值
    for (var nameItem of nameList) {
      newObj[nameItem] = ''
    }
    // 循环判断所需要的键值对是否定义, 定义则赋值
    for (var item in obj) {
      if (newObj[item] !== undefined) newObj[item] = obj[item]
    }
    // 通过 push 将得到的对象存入数组内
    list.push(newObj)
  }
  // 将最终结果和状态存入 newData 中并返回
  newData.list = list
  return newData
}

//////////
// 功能逻辑区域 //
//////////

/***** 生成假数据 *****/

// 轮播据 --- 从 mockjs 获取随机轮播图数据并写入 json 中
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
  // 使用数组将需要赋值的对象键名保存
  var newsListName = ['id', 'img', 'title', 'date', 'click']
  var newsDetailName = ['id', 'title', 'subtitle', 'date', 'click', 'content']
  // 处理新闻列表数据, 从新闻数据中提取新闻列表数据并写入 json 中
  var cdata = spcfObj(newsListName, data.list)
  var err = writeData('newsList', cdata)
  if (err) cb(err)
  // 处理新闻详情数据, 从新闻数据中提取新闻详情数据并写入 json 中
  cdata = spcfObj(newsDetailName, data.list)
  err = writeData('newsDetail', cdata)
  if (err) cb(err)
  cb(null, '固定为' + len)
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

// 图片类型 --- 从 mockjs 获取7 个图片类型并写入json中
exports.setImgCate = function (cb) {
  var name = 'imgCate'
  var data = GetData[name]
  var len = data.list.length
  var err = writeData(name, data)
  if (err) cb(err)
  cb(null, '固定为' + len)
}

// 图片 --- 从 mockjs 获取随机图片信息并分别写入图片列表和图片详情的 json 中
exports.setImg = function (cb) {
  var name = 'img'
  var data = GetData[name]
  // 对象需要提取的键名
  var imgListName = ['id', 'title', 'img', 'zhaiyao']
  var imgDetailName = ['id', 'title', 'date', 'click', 'content']
  // 最外层数组 cate
  var cateData = []
  // 最终数据
  var imgListData = {}
  var imgDetailData = {}
  // 由于图片的显示需要 cateid 验证, 所以生成的图片假数据是在 cate 数组中, 需要先循环外层 cate 数组, 拿到所有数据后
  // 再对里面的数据进行提取
  for (let item of data.cate) {
    // 临时变量, 用来存储每次提取的对象值, 并 push 入数组内
    var listTempData = {}
    // 获取 cateid
    listTempData.cateid = item.cateid
    // 获取最里层的 list 数据, 并将这个对象 push 进 cate 中
    listTempData.list = spcfObj(imgListName, item.list).list
    cateData.push(listTempData)
  }
  // 提取的最终数据
  imgListData.cate = cateData
  // 将最终数据写入文件
  var err = writeData('imgList', imgListData)
  if (err) cb(err)
  // 图片详情临时数据
  var detailTempData = []
  // 这里获取数据的验证方式为 id, 所以外层的 cate 不需要存入文件中
  for (let item of data.cate) {
    // 获取需提取的对象数组
    var oneList = spcfObj(imgDetailName, item.list).list
    // 将每个数组循环得到单个对象并将每个对象放入一个数组中
    for (let oneItem of oneList) {
      detailTempData.push(oneItem)
    }
  }
  // 提取的最终数据
  imgDetailData.list = detailTempData
  err = writeData('imgDetail', imgDetailData)
  if (err) cb(err)
  cb(null, '很长')
}

// 图片缩略图 --- 从 mockjs 获取随机图片缩略图列表并写入 json 中
exports.setImgPreview = function (cb) {
  var name = 'imgPreview'
  var data = GetData[name]
  // 由于 vue-preview 要求缩略图需要有小图
  // 这里循环遍历最里层的图片地址, 利用 replace 替换尺寸
  for (const list of data.imgprev) {
    for (const item of list.list) {
      item.msrc = item.src.replace('640x480', '112x84')
    }
  }
  var err = writeData(name, data)
  if (err) cb(err)
  cb(null, '很长')
}

// 商品列表 --- 获取商品列表随机数据
exports.setGoods = function (cb) {
  var name = 'goods'
  var data = GetData[name]
  var len = data.list.length
  // 需要提取的对象键数组
  var goodsListObj = ['id', 'title', 'src', 'sale_price', 'market_price', 'stock_quantity']
  var goodsDetailObj = ['id', 'title', 'goods_num', 'stock_quantity', 'sale_price', 'market_price']
  // 提取所需的对象值
  var goodsListData = spcfObj(goodsListObj, data.list)
  var err = writeData('goodsList', goodsListData)
  if (err) cb(err)
  var goodsDetailData = spcfObj(goodsDetailObj, data.list)
  err = writeData('goodsDetail', goodsDetailData)
  if (err) throw err
  cb(null, '固定为' + len)
}

/***** 接口 *****/

// 评论接口 --- 获取随机评论数据
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

// 轮播图接口 --- 从文件获取轮播图数据并作为接口数据
exports.getLunbo = function (cb) {
  fs.readFile(fpath('data/lunbo.json'), 'utf-8', function (err, data) {
    if (err) cb(err)
    var res = JSON.parse(data)
    res.status = 0
    cb(null, res)
  })
}

// 新闻列表接口 --- 从文件获取新闻列表据并作为接口数据
exports.getNewsList = function (cb) {
  fs.readFile(fpath('data/newsList.json'), 'utf-8', function (err, data) {
    if (err) cb(err)
    var res = JSON.parse(data)
    res.status = 0
    cb(null, res)
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
    var res = {}
    res.list = list.find((item) => {
      return item.id === id
    })
    res.status = 0
    cb(null, res)
  })
}

// 图片类型接口 --- 从文件获取图片类型数据
exports.getImgCate = function (cb) {
  fs.readFile(fpath('data/imgCate.json'), 'utf-8', function (err, data) {
    if (err) cb(err)
    var res = JSON.parse(data)
    res.status = 0
    cb(null, res)
  })
}

// 图片列表接口 --- 从文件获取随机图片列表数据
exports.getImgList = function (cateid, cb) {
  fs.readFile(fpath('data/imgList.json'), 'utf-8', function (err, data) {
    if (err) cb(err)
    // 获取分类列表并转格式
    var cateList = JSON.parse(data).cate
    // 判断获取单个列表或全部列表
    if (cateid === 0) { // 0 为获取全部列表
      var allList = {}
      allList.list = []
      // 嵌套循环获取单个图片内容列表中单个内容的对象, 并 push 进数组内
      for (const cate of cateList) {
        for (const item of cate.list) {
          allList.list.push(item)
        }
      }
      allList.status = 0
      cb(null, allList)
    } else { // 获取单个列表
      // 通过 find 返回相对应的列表内容
      var oneList = cateList.find(item => {
        return item.cateid === cateid
      })
      oneList.status = 0
      cb(null, oneList)
    }
  })
}

// 图片详情接口 --- 从文件获取图片详情数据
exports.getImgDetail = function (id, cb) {
  fs.readFile(fpath('data/imgDetail.json'), 'utf-8', function (err, data) {
    if (err) cb(err)
    data = JSON.parse(data)
    var res = {}
    res.list = data.list.find(item => {
      return item.id === id
    })
    res.status = 0
    cb(null, res)
  })
}

// 图片缩略图接口 --- 从文件获取图片缩略图数据
exports.getImgPreview = function (id, cb) {
  fs.readFile(fpath('data/imgPreview.json'), 'utf-8', function (err, data) {
    if (err) cb(err)
    data = JSON.parse(data)
    var res = {}
    var tempList = data.imgprev.find(item => {
      return item.id === id
    })
    res.list = tempList.list
    res.status = 0
    cb(null, res)
  })
}

/***** 其他 *****/

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

/***** 测试所用数据及接口 *****/

exports.test = function (cb) {
  var name = 'goods'
  var data = GetData[name]
  cb(null, data)
}
