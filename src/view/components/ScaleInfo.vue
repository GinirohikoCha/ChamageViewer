<template>
  <transition name="fade">
    <div v-show="show" class="scale-info">
      {{ scale }}
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ScaleInfo',
  props: {
    change: Number,
    scale: String
  },
  data () {
    return {
      show: false,
      timer: null
    }
  },
  watch: {
    change (newValue) {
      console.log(newValue)
      clearTimeout(this.timer)
      this.show = true
      const that = this
      this.timer = setTimeout(function () {
        that.show = false
      }, 1200)
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease !important;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 0.6 !important;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0 !important;
}

.scale-info {
  position: fixed;
  background: black;
  border-radius: 17px;
  left: 50%;
  top: 50%;
  color: white;
  height: 35px;
  min-width: 80px;
  line-height: 35px;
  text-align: center;
  font-size: 15px;
  letter-spacing: 1px;
  transform: translate(-50%,-50%);
  -ms-transform: translate(-50%,-50%);
  -webkit-transform: translate(-50%,-50%);
  opacity: 0.6;
  /* 鼠标穿透 */
  pointer-events: none;
}
</style>
