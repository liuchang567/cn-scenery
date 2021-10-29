import * as Cesium from 'cesium'

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibGN5eSIsImEiOiJja2htc2c0OTQwaW9vMnBxcTl4c2d1NDd1In0.drhx9Uv2m-a35dsoGEencw'
const MAPBOX_STYLE_ID = 'ckhmthlhs07w619nufi7i57gf'
const MAPBOX_USERNAME = 'lcyy'
const CESIUM_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3NWFjY2IyZC0xMDk1LTRkZmQtYjU5My01ZTdhMWU1ZTAxZmMiLCJpZCI6MzY2NTEsImlhdCI6MTYwMzg3MDA2NH0.xxGW4wAehVu2lqWA-9XT5ZjcIbvUlG6P2yHjl7-3Lu0'

export function initCesiumToken () {
  Cesium.Ion.defaultAccessToken = CESIUM_TOKEN
}

export function CreateMap(container, options = {}) {
  const tileKeys = options.tileKeys || ['mapbox']
  // const pos = options.pos || [116.435314, 40.960521, 20000000.0]
  // const initialPosition = new Cesium.Cartesian3.fromDegrees(pos[0], pos[1], pos[2])
  // const hpr = options.hpr || [0.0, -90.0, 0.0]
  // const initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(hpr[0], hpr[1], hpr[2])
  const defaultOptions = {
    scene3DOnly: true,
    geocoder: false,
    homeButton: false,
    navigationHelpButton: false,
    selectionIndicator: false,
    baseLayerPicker: false,
    timeline: false,
    creditsDisplay: false,
    animation: false,
    fullscreenButton: false
  }
  const viewer = new Cesium.Viewer(container, Object.assign({}, defaultOptions, options))
  // 初始化相机位置
  // viewer.camera.flyTo({
  //   destination: initialPosition,
  //   orientation: initialOrientation,
  //   endTransform: Cesium.Matrix4.IDENTITY
  // })

  // 显示帧率
  viewer.scene.debugShowFramesPerSecond = true

  // 删除默认图层
  viewer.imageryLayers.remove(viewer.imageryLayers.get(0))

  // 地球默认颜色
  viewer.scene.globe.baseColor = Cesium.Color.WHITE

  // 自然光照
  viewer.scene.globe.enableLighting = true
  //雾效
  viewer.scene.fog.enabled = true
  viewer.shadows = true
  //大气：
  viewer.scene.skyAtmosphere.saturationShift = 1.0
  
  return ObserverMapTiles(viewer, tileKeys)
}

const urls = {
  mapbox: '',
  tianditu: 'http://t0.tianditu.gov.cn/img_w/wmts?tk=ebf64362215c081f8317203220f133eb',
  google: 'http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}',
  mapboxB: 'https://api.mapbox.com/styles/v1/' + MAPBOX_USERNAME + '/' + MAPBOX_STYLE_ID + '/tiles/256/{z}/{x}/{y}?access_token=' + MAPBOX_ACCESS_TOKEN,
  //天地图
  TDTIMGC: 'https://{s}.tianditu.gov.cn/img_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=ebf64362215c081f8317203220f133eb',
  //标注
  TDTCIAC: 'https://{s}.tianditu.gov.cn/cia_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=ebf64362215c081f8317203220f133eb',
}

function ObserverMapTiles(map, tileKeys) {
  map.tiles = {
    mapbox: new Cesium.ImageryLayer(new Cesium.MapboxImageryProvider({
      mapId: 'mapbox.satellite',
      accessToken: MAPBOX_ACCESS_TOKEN
    })),
    tianditu: new Cesium.ImageryLayer(new Cesium.WebMapTileServiceImageryProvider({
      url: urls.tianditu,
      layer: 'img',
      style: 'default',
      tileMatrixSetID: 'w',
      format: 'tiles'
    })),
    google: new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
      url: urls.google
    })),
    mapboxB: new Cesium.ImageryLayer(new Cesium.UrlTemplateImageryProvider({
      url: urls.mapboxB,
      maximumLevel: 22
    })),
    TDT_IMG_C: new Cesium.ImageryLayer (new Cesium.WebMapTileServiceImageryProvider({
			url: urls.TDTIMGC,
			layer: 'tdtImg_c',
			style: 'default',
			format: 'tiles',
			tileMatrixSetID: 'c',
			subdomains:['t0','t1','t2','t3','t4','t5','t6','t7'],
			tilingScheme:new Cesium.GeographicTilingScheme(),
			tileMatrixLabels:['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19'],
			maximumLevel:50,
			show: false
			})),
			TDT_CIA_C: new Cesium.ImageryLayer (new Cesium.WebMapTileServiceImageryProvider({
				url: urls.TDTCIAC,
				layer: 'tdtImg_c',
				style: 'default',
				format: 'tiles',
				tileMatrixSetID: 'c',
				subdomains:['t0','t1','t2','t3','t4','t5','t6','t7'],
				tilingScheme:new Cesium.GeographicTilingScheme(),
				tileMatrixLabels:['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19'],
				maximumLevel:50,
				show: false
			}))
  }
  Object.defineProperty(map, 'tileKeys', {
    get: () => tileKeys,
    set: (keys) => {
      tileKeys = keys
      Object.keys(map.tiles).forEach(key => {
        const _layer = map.tiles[key]
        const _isShow = map.imageryLayers.contains(_layer)
        const _shouldShow = tileKeys.includes(key)
        if (_shouldShow && !_isShow) {
          map.imageryLayers.add(_layer)
        } else if (!_shouldShow && _isShow) {
          map.imageryLayers.remove(_layer, false)
        }
      })
    }
  })
  map.tileKeys = tileKeys
  return map
}


// 计算角度-偏行角
export function courseAngle(lng_a, lat_a, lng_b, lat_b) {
  //以a点为原点建立局部坐标系（东方向为x轴,北方向为y轴,垂直于地面为z轴），得到一个局部坐标到世界坐标转换的变换矩阵
  const localToWorld_Matrix = Cesium.Transforms.eastNorthUpToFixedFrame(new Cesium.Cartesian3.fromDegrees(lng_a, lat_a));
  //求世界坐标到局部坐标的变换矩阵
  const worldToLocal_Matrix = Cesium.Matrix4.inverse(localToWorld_Matrix, new Cesium.Matrix4());
  //a点在局部坐标的位置，其实就是局部坐标原点
  const localPosition_A = Cesium.Matrix4.multiplyByPoint(worldToLocal_Matrix, new Cesium.Cartesian3.fromDegrees(lng_a, lat_a), new Cesium.Cartesian3());
  //B点在以A点为原点的局部的坐标位置
  const localPosition_B = Cesium.Matrix4.multiplyByPoint(worldToLocal_Matrix, new Cesium.Cartesian3.fromDegrees(lng_b, lat_b), new Cesium.Cartesian3());
  //弧度
  const angle = Math.atan2((localPosition_B.y - localPosition_A.y), (localPosition_B.x - localPosition_A.x))
  //角度
  let theta = angle * (180 / Math.PI);
  if (theta < 0) {
    theta = theta + 360;
  }
  return theta;
}

// 计算角度-俯仰角
export function coursePitchAngle(lng_a, lat_a, alt_a, lng_b, lat_b, alt_b) {
  //以a点为原点建立局部坐标系（东方向为x轴,北方向为y轴,垂直于地面为z轴），得到一个局部坐标到世界坐标转换的变换矩阵
  const localToWorld_Matrix = Cesium.Transforms.eastNorthUpToFixedFrame(new Cesium.Cartesian3.fromDegrees(lng_a, lat_a));
  //求世界坐标到局部坐标的变换矩阵
  const worldToLocal_Matrix = Cesium.Matrix4.inverse(localToWorld_Matrix, new Cesium.Matrix4());
  //a点在局部坐标的位置，其实就是局部坐标原点
  const localPosition_A = Cesium.Matrix4.multiplyByPoint(worldToLocal_Matrix, new Cesium.Cartesian3.fromDegrees(lng_a, lat_a), new Cesium.Cartesian3());
  //B点在以A点为原点的局部的坐标位置
  const localPosition_B = Cesium.Matrix4.multiplyByPoint(worldToLocal_Matrix, new Cesium.Cartesian3.fromDegrees(lng_b, lat_b), new Cesium.Cartesian3());

  let distance = Math.sqrt(Math.pow((localPosition_B.x - localPosition_A.x), 2) + Math.pow((localPosition_B.y - localPosition_A.y), 2))
  let dz = alt_b - alt_a;
  let angle = 0;
  if (distance != 0) {
    angle = Math.tanh(dz / distance);
  }
  let theta = angle * (180 / Math.PI);
  return theta
}

export {
  Cesium
}
