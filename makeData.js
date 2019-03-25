/*
* @Author: shen
* @Date:   2019-03-07 22:45:29
* @Last Modified by:   xvvx
* @Last Modified time: 2019-03-25 13:36:36
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
  'list|3-6': [{
    'id|+1': 1,
    'img': '@img(900x500, lunbo)'
  }]
})

// 获取随机新闻数据
exports.news = Mock.mock({
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
  'cmt_area|95': [{
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
  'list|7': [{
    'cateid|+1': 1,
    'title': '@ctitle(4)'
  }]
})

// 随机获取图片列表
exports.img = Mock.mock({
  'cate|7': [{
    'cateid|+1': 1,
    'list|10': [{
      'id|+1': 26, // 这里必须从26开始, 否则获取不到相应评论
      'title': '@ctitle(24)',
      'img': '@img(350x450, image)',
      'content': '@csentence(120)',
      'zhaiyao': '@csentence(80)',
      'date': '@datetime()',
      'click': '@integer(20, 10000)'
    }]
  }]
})

// 随机获取图片缩略图
exports.imgPreview = Mock.mock({
  'imgprev|70': [{
    'id|+1': 26,
    'list|6': [{
      'src': '@img(640x480, imgPreview)'
    }]
  }]
})

// 随机获取商品列表信息
exports.goods = Mock.mock({
  'list|24': [{
    'id|+1': 97,
    'title': '@csentence(12)',
    'src': '@img(172x210, goods, ffffff)',
    'sale_price': '@integer(2300, 2800)',
    'market_price': '@integer(2900, 3200)',
    'add_time': '@datetime()',
    'stock_quantity': '@integer(40, 680)',
    'goods_num': 'SD@integer(1000000000, 9999999999)'
  }]
})

// 获取商品轮播图
exports.goodsSwiper = Mock.mock({
  'goodsamt|24': [{
    'id|+1': 97,
    'list|2-3': [{
      'img': '@img(165x200, goodsDetail, ffffff)'
    }]
  }]
})
