/*
* @Author: shen
* @Date:   2019-03-07 22:45:29
* @Last Modified by:   xvvx
* @Last Modified time: 2019-03-14 14:09:09
*/
var Mock = require('mockjs')

var Random = Mock.Random

// 自定义拓展随机数据
Random.extend({
  // 获取自增编号图片
  img (size, name, color = this.color()) {
    name = name + this.increment()
    return this.image(size, color, name)
  },

  // 获取标题
  newsTitle () {
    return this.ctitle(4, 6) + ',' + this.ctitle(8, 14)
  }
})

// 获取随机轮播图
exports.lunbo = Mock.mock({
  'status': 0,
  'list|3-6': [{
    'id|+1': 1,
    'img': '@img(900x500, lunbo)'
  }]
})

// 获取随机新闻数据
exports.news = Mock.mock({
  'status': 0,
  'list|25': [{
    'id|+1': 1,
    'title': '@newsTitle()',
    'subtitle': '@ctitle(8, 13)',
    'img': '@img(200x150, NewsTitle)',
    'date': '@datetime()',
    'click': '@integer(20, 10000)',
    'content': '@csentence(6)'
  }]
})

// 获取所有随机评论数据, 包括新闻评论, 图片评论, 商品评论等
exports.comment = Mock.mock({
  'status': 0,
  'cmt_area|25': [{
    'artid|+1': 1,
    'list|40-80': [{
      'user_name': '@cname',
      'add_time': '@datetime()',
      'content': '@csentence(6)'
    }]
  }]
})

// 随机获取图片类型
exports.imgCate = Mock.mock({
  'status': 0,
  'list|7': [{
    'cateid|+1': 1,
    'title': '@ctitle(4)'
  }]
})

// 随机获取图片列表
exports.imgList = Mock.mock({
  'status': 0,
  'cate|7': [{
    'cateid|+1': 1,
    'list|8-16': [{
      'id|+1': 26, // 这里必须从26开始, 否则获取不到相应评论
      'title': '@ctitle(8)',
      'img': '@img(900x500, image)',
      'zhaiyao': '@csentence(45)'
    }]
  }]
})
