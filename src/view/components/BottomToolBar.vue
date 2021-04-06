<template>
  <transition name="fade">
    <div v-show="show" class="bottom-toolbar material-shadow">
      <el-space>
        <el-tooltip effect="dark" content="滚轮切换模式" placement="top">
          <i class="el-icon-mouse bottom-toolbar-item" />
        </el-tooltip>
        <el-tooltip effect="dark" content="原始尺寸" placement="top">
          <i class="el-icon-c-scale-to-original bottom-toolbar-item" @click="$parent.scaleTo(1)" />
        </el-tooltip>
        <el-tooltip effect="dark" content="放大图片" placement="top">
          <i class="el-icon-zoom-in bottom-toolbar-item" @click="$parent.scaleImg(false)" />
        </el-tooltip>
        <el-tooltip effect="dark" content="缩小图片" placement="top">
          <i class="el-icon-zoom-out bottom-toolbar-item" @click="$parent.scaleImg(true)" />
        </el-tooltip>
        <el-tooltip effect="dark" content="上一张图片" placement="top">
          <i class="el-icon-arrow-left bottom-toolbar-item" style="font-size: 30px" @click="$parent.preImg"/>
        </el-tooltip>
        <el-tooltip effect="dark" content="幻灯片模式" placement="top">
          <i class="el-icon-film bottom-toolbar-item" />
        </el-tooltip>
        <el-tooltip effect="dark" content="下一张图片" placement="top">
          <i class="el-icon-arrow-right bottom-toolbar-item" style="font-size: 30px" @click="$parent.nextImg"/>
        </el-tooltip>
        <el-tooltip effect="dark" content="向左旋转90°" placement="top">
        <i class="el-icon-refresh-left bottom-toolbar-item" />
        </el-tooltip>
        <el-tooltip effect="dark" content="向右旋转90°" placement="top">
          <i class="el-icon-refresh-right bottom-toolbar-item" />
        </el-tooltip>
        <el-tooltip effect="dark" content="删除图片" placement="top">
          <i class="el-icon-delete bottom-toolbar-item" />
        </el-tooltip>
        <i class="el-icon-setting bottom-toolbar-item" />
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
  height: 45px;
  opacity: 0.8;
  z-index: 1;
}

.bottom-toolbar-item {
  line-height: 45px;
  font-size: 20px;
  cursor: pointer;
}

.bottom-toolbar-item:hover {
  font-weight: bold;
  color: black;
}
</style>
