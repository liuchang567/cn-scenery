<template>
  <div class="container">
    <div class="map" id="map"></div>
    <div class="info">
      <span>{{index}}</span>
      <span>longitude：{{position.longitude}}</span>
      <span>latitude：{{position.latitude}}</span>
      <span>altitude：{{position.altitude}}</span>
    </div>
  </div>
</template>

<script>
import { Cesium, initCesiumToken, CreateMap} from '../utils/map'
// import { Cesium, initCesiumToken, CreateMap, courseAngle, coursePitchAngle } from '../utils/map'
import 'cesium/Build/Cesium/Widgets/widgets.css'
export default {
  name: 'layout',
  data () {
    return {
      position: {},
      index: 0
    }
  },
  props: {
  },
  computed: {
    
  },
  watch: {
  },
  created () {
    initCesiumToken()
  },
  mounted () {
    this.init()
    this.loadModel()
  },
  beforeDestroy () {
    navigator.geolocation.clearWatch()
  },
  methods: {
    init() {
      this.viewer = CreateMap('map')
      this.scene = this.viewer.scene
      this.camera = this.viewer.camera
    },
    // 加载模型
    loadModel() {
      const startHpr = new Cesium.HeadingPitchRoll(0, 0, 0);
      const startPos =  Cesium.Cartesian3.fromDegrees(120.01231, 30.01231, 1000.0)
      const startOrientation = Cesium.Transforms.headingPitchRollQuaternion(
        startPos,
        startHpr
      )
      this.entity =  this.viewer.entities.add({
        position: startPos,
        orientation: startOrientation,
        model: {
          uri: 'glb/Cesium_Air.glb',
          minimumPixelSize: 128,
          maximumScale: 20000
        }
      })
      this.viewer.clock.multiplier = 5
      this.viewer.clock.shouldAnimate = true
      this.viewer.trackedEntity = this.entity
      
      this.location()
    },
    resHome () {
      const initialPosition = new Cesium.Cartesian3.fromDegrees(116.435314, 40.960521, 20000000.0)
      const initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(0.0, -90.0, 0.0)
      this.camera.flyTo({
        destination: initialPosition,
        orientation: initialOrientation,
        endTransform: Cesium.Matrix4.IDENTITY
      })
    },
    // cor() {
    //   let angle = 0, pitchAngle = 0, roll = 0,
    //   for(let i = 0; i < arr.length; i++) {
    //     if (i === this.arr.length -1) {
    //       angle = courseAngle(arr[i].lng, arr[i].lat, arr[i].lng, arr[i].lat)
    //       pitchAngle = coursePitchAngle(arr[i].lng, arr[i].lat, arr[i].h, arr[i].lng, arr[i].lat, arr[i].h)
    //     } else {
    //       angle = courseAngle(arr[i].lng, arr[i].lat, arr[i+1].lng, arr[i+1].lat)
    //       pitchAngle = coursePitchAngle(arr[i].lng, arr[i].lat, arr[i].h, arr[i+1].lng, arr[i+1].lat, arr[i+1].h)
    //     }
    //     angle = 360 - Number(angle.toFixed(0))
    //     pitchAngle = Number(pitchAngle.toFixed(0))
    //     hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(angle), Cesium.Math.toRadians(pitchAngle), Cesium.Math.toRadians(roll))
    //   }
    // },
    location () {
      if (navigator.geolocation){
        navigator.geolocation.watchPosition((position) => {
          this.position = {
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
            altitude: position.coords.altitude.toFixed(6) || 0
          }
          this.index++
          let pos = new Cesium.Cartesian3.fromDegrees(this.position.longitude, this.position.latitude, this.position.altitude)
          this.entity.position = pos
          
          // this.entity.orientation = Cesium.Transforms.headingPitchRollQuaternion(pos, this.hprArr[i])
        }, (err) => {
          console.log(err)
        }, {
          frequency: 6,
          enableHighAccuracy: true,
          timeout: 3000
        })
      } else {
        alert("不支持获取地理位置!")
      }
    }
  }
}
</script>
