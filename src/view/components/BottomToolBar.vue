<template>
  <transition name="fade">
    <div v-show="show" class="bottom-toolbar material-shadow">
      <el-space>
        <i class="el-icon-arrow-left bottom-toolbar-item" style="font-size: 20px" @click="$parent.preImg()"/>
        <i class="el-icon-arrow-right bottom-toolbar-item" style="font-size: 20px" @click="$parent.nextImg"/>
        <i class="el-icon-delete bottom-toolbar-item" />
      </el-space>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'BottomToolBar',
  props: {
    toggle: Boolean
  },
  data () {
    return {
      show: false,
      timer: null
    }
  },
  watch: {
    toggle (newValue) {
      if (newValue) {
        clearTimeout(this.timer)
        this.show = true
      } else {
        clearTimeout(this.timer)
        const that = this
        this.timer = setTimeout(function () {
          that.show = false
        }, 1200)
      }
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease !important;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0 !important;
}

.bottom-toolbar {
  position: fixed;
  background: white;
  bottom: 0;
  width: 100%;
  height: 40px;
  opacity: 0.8;
  z-index: 1;
}

.bottom-toolbar-item {
  line-height: 40px;
  font-size: 14px;
  cursor: pointer;
}

.bottom-toolbar-item:hover {
  font-weight: bold;
  color: black;
}
</style>
