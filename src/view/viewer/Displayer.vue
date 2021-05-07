<template>
  <el-image
    :style="{
    'width':width+'px',
    'height':height+'px',
    'left':left+'px',
    'top':top+'px',
    'box-shadow':'0px 3px 12px rgba(0, 0, 0, 0.23), 0 3px 12px rgba(0, 0, 0, 0.16)'}"
    :draggable="false"
    :src="imageUrl"/>
</template>

<script>
export default {
  name: 'Displayer',
  props: {
    image: Object
  },
  data () {
    return {
      scale: 0,
      left: 0,
      top: 0
    }
  },
  computed: {
    imageUrl: function () {
      return this.image ? this.image.data.url : ''
    },
    width: function () {
      return this.image ? this.image.data.width * this.scale + 1 : 0
    },
    height: function () {
      return this.image ? this.image.data.height * this.scale + 1 : 0
    }
  },
  watch: {
    image (newImage) {
      this.scale = newImage.attr.initScale
      this.left = newImage.attr.initLeft
      this.top = newImage.attr.initTop
    }
  }
}
</script>

<style scoped>
</style>
