// export default function MapLoader () { // 这里使用的是module.exports高德地图异步加载
//   return new Promise((resolve, reject) => {
//     if (window.AMap) {
//       resolve(window.AMap)
//     } else {
//       var script = document.createElement('script')
//       script.type = 'text/javascript'
//       script.async = true
//       script.id = 'amapJs'
//       // script.src = 'https://webapi.amap.com/maps?v=1.4.15&key=bdf413cfa0b6de1e621478589abd2c41&callback=initAMap'
//       script.src = 'https://webapi.amap.com/maps?v=1.4.15&key=bdf413cfa0b6de1e621478589abd2c41&callback=initAMap&plugin=AMap.MouseTool'
//       document.head.appendChild(script)
//     }
//     window.initAMap = () => {
//       resolve(window.AMap)
//     }
//   })
// }

export default function MapLoader () {
  const key = 'bdf413cfa0b6de1e621478589abd2c41'
  const p1 = new Promise(function (resolve, reject) {
    window.init = function () {
      resolve(AMap)
    }
    let script = document.createElement("script")
    script.type = "text/javascript"
    script.src = "https://webapi.amap.com/maps?v=1.4.6&key=" + key + '&plugin=AMap.Geocoder' + "&callback=init"
    script.onerror = reject
    document.head.appendChild(script)
  })
  const p2 = new Promise(function (resolve, reject) {
    let script2 = document.createElement("script")
    script2.type = "text/javascript"
    script2.src = "https://webapi.amap.com/ui/1.1/main-async.js"
    script2.onerror = reject
    script2.onload = function (su) {
      resolve('success')
    }
    document.head.appendChild(script2)
  })
  return Promise.all([p1, p2])
    .then(function (result) {
      return result[0]
    }).catch(e => {
      console.log(e)
    })
};

// 使用方法
//
// import MapLoader from '@/utils/AMap' // 引入高德地图 原生api
//
// // 高德引入后
// MapLoader().then(AMap => {
//   console.log('地图加载成功')
// 按需引用高德 js api
// // AMap.plugin(['AMap.GraspRoad', 'AMap.Weather'], function () {
//
// })
// }),( e => {
//   console.log('地图加载失败', e)
// })
