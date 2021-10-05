<template>
  <div class="bottom-toolbar-wrapper"
    v-on:mouseenter="showToolBar(true)"
    v-on:mouseleave="showToolBar(false)">
    <transition name="fade">
      <div v-show="display" class="bottom-toolbar material-shadow">
        <el-space class="item-wrapper">
          <el-tooltip effect="dark" content="漫画模式" placement="top">
            <router-link to="comic">
              <i class="el-icon-reading bottom-toolbar-item"/>
            </router-link>
          </el-tooltip>
          <el-tooltip effect="dark" content="原始尺寸" placement="top">
            <i class="el-icon-c-scale-to-original bottom-toolbar-item" @click="$emit('scale')" />
          </el-tooltip>
          <el-tooltip effect="dark" content="放大图片" placement="top">
            <i class="el-icon-zoom-out bottom-toolbar-item" @click="$emit('scaleDown')" />
          </el-tooltip>
          <el-tooltip effect="dark" content="放大图片" placement="top">
            <i class="el-icon-zoom-in bottom-toolbar-item" @click="$emit('scaleUp')" />
          </el-tooltip>
          <el-tooltip effect="dark" content="上一张图片" placement="top">
            <i class="el-icon-arrow-left bottom-toolbar-item"
               style="font-size: 30px;transform: translate(0,5px);-ms-transform: translate(0,5px);-webkit-transform: translate(0,5px);"
               @click="$emit('pre')"/>
          </el-tooltip>
          <el-tooltip effect="dark" content="幻灯片模式" placement="top">
            <i class="el-icon-film bottom-toolbar-item"  @click="$emit('fullscreen')" />
          </el-tooltip>
          <el-tooltip effect="dark" content="下一张图片" placement="top">
            <i class="el-icon-arrow-right bottom-toolbar-item"
               style="font-size: 30px;transform: translate(0,5px);-ms-transform: translate(0,5px);-webkit-transform: translate(0,5px);"
               @click="$emit('next')"/>
          </el-tooltip>
          <el-tooltip effect="dark" content="逆时针旋转90°" placement="top">
            <i class="el-icon-refresh-left bottom-toolbar-item" @click="$emit('rotateL')"/>
          </el-tooltip>
          <el-tooltip effect="dark" content="顺时针旋转90°" placement="top">
            <i class="el-icon-refresh-right bottom-toolbar-item" @click="$emit('rotateR')"/>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除图片" placement="top">
            <i class="el-icon-delete bottom-toolbar-item" @click="$emit('delete')"/>
          </el-tooltip>
          <i class="el-icon-setting bottom-toolbar-item" @click="$emit('config')"/>
        </el-space>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'BottomBar',
  emits: {
    pre: null,
    next: null,
    scale: null,
    scaleUp: null,
    scaleDown: null,
    rotateL: null,
    rotateR: null,
    delete: null,
    config: null,
    fullscreen: null,
    comic: null
  },
  data () {
    return {
      display: false,
      timer: null
    }
  },
  methods: {
    showToolBar (bool) {
      clearTimeout(this.timer)
      if (bool) {
        this.display = true
      } else {
        const that = this
        this.timer = setTimeout(function () {
          that.display = false
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

.bottom-toolbar-wrapper {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 45px;
}

.bottom-toolbar {
  position: absolute;
  background: white;
  width: 100%;
  height: 100%;
  line-height: 45px;
  opacity: 0.8;
  z-index: 1;
}

.item-wrapper {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
}

.bottom-toolbar-item {
  font-size: 20px;
  cursor: pointer;
  color: gray;
}

.bottom-toolbar-item:hover {
  font-weight: bold;
  color: black;
}

.bottom-toolbar-item-active {
  padding: 5px;
  border-radius: 5px;
  background: black;
  color: white;
  font-size: 20px;
  cursor: pointer;
}
</style>
