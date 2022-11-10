<template>
  <div class="container">
    <div class="map" id="map"></div>
    <div class="info">
      <span>{{position.longitude}} E</span>
      <span>{{position.latitude}} N</span>
      <span>{{position.altitude}} M</span>
    </div>
    <div class="action">
      <div class="action-btn" :class="{active:active==0}" @click="changView(0)">上帝视角</div>
      <div class="action-btn" :class="{active:active==1}" @click="changView(1)">跟随视角</div>
      <div class="action-btn" :class="{active:active==2}" @click="changView(2)">自由视角</div>
    </div>
  </div>
</template>

<script>
import { Cesium, initCesiumToken, CreateMap, courseAngle, coursePitchAngle } from '../utils/map'
import 'cesium/Build/Cesium/Widgets/widgets.css'
export default {
  name: 'layout',
  data () {
    return {
      position: {},
      index: 0,
      active: 0
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
  },
  beforeDestroy () {
    navigator.geolocation.clearWatch()
  },
  methods: {
    init() {
      this.viewer = CreateMap('map')
      this.scene = this.viewer.scene
      this.camera = this.viewer.camera
      const pos = [116.435314, 40.960521, 20000000.0]
      const initialPosition = new Cesium.Cartesian3.fromDegrees(pos[0], pos[1], pos[2])
      const hpr =  [0.0, -90.0, 0.0]
      const initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(hpr[0], hpr[1], hpr[2])
      this.camera.flyTo({
        destination: initialPosition,
        orientation: initialOrientation,
        complete: () => {
          // this.viewer.trackedEntity = this.entity
        }
      })
      this.loadModel()
    },
    changView(num) {
      if (this.active === num) return
      this.active = num
      if (num === 0 ) {
        this.viewer.trackedEntity = this.entity
      } else if (num === 1) {
        this.viewer.trackedEntity = this.entity
      } else {
        this.viewer.trackedEntity = undefined
        this.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
      }
    },
    // 加载模型
    loadModel() {
      const heading = Cesium.Math.toRadians(-90)
      const startHpr = new Cesium.HeadingPitchRoll(heading, 0, 0)
      const startPos =  Cesium.Cartesian3.fromDegrees(120.01231, 30.01231, 10000.0)
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
      
      // this.location()
      this.test2()
      // this.camera.moveBackward(5000)
    },
    setView(longitude, latitude) {
      const pos2 = new Cesium.Cartesian3.fromDegrees(longitude, latitude - 0.1, 50000)
      const initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(0.0, -70.0, 0.0)
      this.camera.setView({
        destination: pos2,
        orientation: initialOrientation
      })
    },
    test2(){
      let longitude = 120.01231
      let latitude = 30.012+31
      let altitude = 10000.0
      setInterval(() => {
        this.index++
        longitude += 0.001231313
        latitude += 0.001231313
        const pos = new Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude)
        this.entity.position = pos
        // this.setView(longitude, latitude)
        // const pos2 = new Cesium.Cartesian3.fromDegrees(longitude, latitude - 0.1, 50000)
        // const initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(0.0, -70.0, 0.0)
        // this.camera.setView({
        //   destination: pos2,
        //   orientation: initialOrientation
        // })
      }, 80)
    },
    test() {
      let longitude = 120.01231
      let latitude = 30.01231
      let altitude = 1.0
      setInterval(() => {
        this.index++
        longitude += 0.001231313
        latitude += 0.001231313
        altitude += 1
        let pos = new Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude)
        this.entity.position = pos
      }, 80)
    },
    cor() {
      let arr = [], angle = 0, pitchAngle = 0, roll = 0;
      for(let i = 0; i < arr.length; i++) {
        if (i === this.arr.length -1) {
          angle = courseAngle(arr[i].lng, arr[i].lat, arr[i].lng, arr[i].lat)
          pitchAngle = coursePitchAngle(arr[i].lng, arr[i].lat, arr[i].h, arr[i].lng, arr[i].lat, arr[i].h)
        } else {
          angle = courseAngle(arr[i].lng, arr[i].lat, arr[i+1].lng, arr[i+1].lat)
          pitchAngle = coursePitchAngle(arr[i].lng, arr[i].lat, arr[i].h, arr[i+1].lng, arr[i+1].lat, arr[i+1].h)
        }
        angle = 360 - Number(angle.toFixed(0))
        pitchAngle = Number(pitchAngle.toFixed(0))
        let hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(angle), Cesium.Math.toRadians(pitchAngle), Cesium.Math.toRadians(roll))
        console.log(hpr)
      }
    },
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
