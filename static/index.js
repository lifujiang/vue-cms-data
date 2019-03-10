/*
* @Author: shen
* @Date:   2019-03-07 22:45:43
* @Last Modified by:   shen
* @Last Modified time: 2019-03-08 13:06:28
*/

// 定义随机数据

var Random = Mock.Random

// 自定义拓展随机数据
Random.extend({
  img (size, name, color = this.color()) {
    name = name + this.increment()
    return this.image(size, color, name)
  }
})

Mock.mock(/\.json/, {
  'status': 0,
  'imgList|3-6': [{
    'id|+1': 1,
    'img': '@img(900x500, 233)'
  }]
})

$('#lunbo-btn').on('click', () => {
  $.ajax({
    url: 'hello.json'
  }).then((data) => {
    console.log(data)
    exports.lunbo = data
  })
})