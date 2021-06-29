<template>
  <div class="container">
    <div class="map" id="map"></div>
  </div>
</template>

<script>
import { initCesiumToken } from '../utils/map'
export default {
  name: 'layout',
  data () {
    return {
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
  },
  beforeDestroy () {
  },
  methods: {
    
  }
}
</script>
