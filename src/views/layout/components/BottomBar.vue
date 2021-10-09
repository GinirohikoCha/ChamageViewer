<template>
  <div class="bottom-toolbar-wrapper"
    v-on:mouseenter="showToolBar(true)"
    v-on:mouseleave="showToolBar(false)">
    <transition name="fade">
      <div v-show="display" class="material-shadow" :class="barClass">
        <el-space class="item-wrapper">
          <el-tooltip effect="dark" content="漫画模式" placement="top">
            <i class="el-icon-reading" :class="itemClass" @click="this.$router.replace('/comic')"/>
          </el-tooltip>
          <el-tooltip effect="dark" content="原始尺寸" placement="top">
            <i class="el-icon-c-scale-to-original" :class="itemClass" @click="$emit('scale')" />
          </el-tooltip>
          <el-tooltip effect="dark" content="放大图片" placement="top">
            <i class="el-icon-zoom-out" :class="itemClass" @click="$emit('scaleDown')" />
          </el-tooltip>
          <el-tooltip effect="dark" content="放大图片" placement="top">
            <i class="el-icon-zoom-in" :class="itemClass" @click="$emit('scaleUp')" />
          </el-tooltip>
          <el-tooltip effect="dark" content="上一张图片" placement="top">
            <i class="el-icon-arrow-left" :class="itemClass"
               style="font-size: 30px;transform: translate(0,5px);-ms-transform: translate(0,5px);-webkit-transform: translate(0,5px);"
               @click="$emit('pre')"/>
          </el-tooltip>
          <el-tooltip effect="dark" content="幻灯片模式" placement="top">
            <i class="el-icon-film" :class="itemClass" @click="$emit('fullscreen')" />
          </el-tooltip>
          <el-tooltip effect="dark" content="下一张图片" placement="top">
            <i class="el-icon-arrow-right" :class="itemClass"
               style="font-size: 30px;transform: translate(0,5px);-ms-transform: translate(0,5px);-webkit-transform: translate(0,5px);"
               @click="$emit('next')"/>
          </el-tooltip>
          <el-tooltip effect="dark" content="逆时针旋转90°" placement="top">
            <i class="el-icon-refresh-left" :class="itemClass" @click="$emit('rotateL')"/>
          </el-tooltip>
          <el-tooltip effect="dark" content="顺时针旋转90°" placement="top">
            <i class="el-icon-refresh-right" :class="itemClass" @click="$emit('rotateR')"/>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除图片" placement="top">
            <i class="el-icon-delete" :class="itemClass" @click="$emit('delete')"/>
          </el-tooltip>
<!--          <i class="el-icon-setting" :class="itemClass" @click="$emit('config')"/>-->
        </el-space>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'BottomBar',
  props: {
    fullscreen: Boolean
  },
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
  computed: {
    itemClass () {
      return {
        'bottom-toolbar-item': !this.fullscreen,
        'bottom-toolbar-item-dark': this.fullscreen
      }
    },
    barClass () {
      return {
        'bottom-toolbar': !this.fullscreen,
        'bottom-toolbar-dark': this.fullscreen
      }
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

.bottom-toolbar-dark {
  position: absolute;
  background: black;
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

.bottom-toolbar-item-dark {
  font-size: 20px;
  cursor: pointer;
  color: white;
}

.bottom-toolbar-item-dark:hover {
  font-weight: bold;
}
</style>
