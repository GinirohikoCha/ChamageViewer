<template>
  <div
    class="bottom-toolbar-wrapper"
    v-on:mouseenter="showToolBar(true)"
    v-on:mouseleave="showToolBar(false)">
    <transition name="fade">
      <div v-show="display" class="bottom-toolbar material-shadow">
        <el-space>
          <el-tooltip effect="dark" content="漫画模式" placement="top">
            <i class="el-icon-reading bottom-toolbar-item"  @click="$emit('comic')"/>
          </el-tooltip>
<!--          <el-tooltip effect="dark" :content="modeTitle" placement="top">-->
<!--            <i class="el-icon-mouse"-->
<!--               :class="{'bottom-toolbar-item-active': modeSwitched, 'bottom-toolbar-item': !modeSwitched}"-->
<!--               @click="toggleScrollMode"/>-->
<!--          </el-tooltip>-->
          <el-tooltip effect="dark" content="原始尺寸" placement="top">
            <i class="el-icon-c-scale-to-original bottom-toolbar-item" @click="$emit('scale', 1)" />
          </el-tooltip>
          <el-popover
            placement="top"
            trigger="click"
            v-model:visible="menu.scale.visible"
          >
            <template #reference>
              <i class="el-icon-zoom-in bottom-toolbar-item" @click="toggleScale" />
            </template>
            <el-slider
              v-model="menu.scale.value"
              :format-tooltip="formatScale"
              :min="0.01"
              :max="2"
              :step="0.01"
              v-on:mouseenter="showToolBar(true)"
              v-on:mouseleave="showToolBar(false)"/>
          </el-popover>
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
          <i class="el-icon-refresh-left bottom-toolbar-item" @click="$emit('rotate', false)"/>
          </el-tooltip>
          <el-tooltip effect="dark" content="顺时针旋转90°" placement="top">
            <i class="el-icon-refresh-right bottom-toolbar-item" @click="$emit('rotate', true)"/>
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
  name: 'BottomToolBar',
  props: {
    scaleProp: Number,
    config: Object,
    image: Object
  },
  emits: {
    comic: null,
    scale: null,
    pre: null,
    next: null,
    rotate: null,
    delete: null,
    config: null,
    fullscreen: null
  },
  data () {
    return {
      display: false,
      menu: {
        scale: {
          value: 0,
          hover: false,
          visible: false
        }
      },
      timer: null
    }
  },
  computed: {
  },
  watch: {
  },
  mounted () {
  },
  methods: {
    showToolBar (bool) {
      clearTimeout(this.timer)
      if (bool) {
        this.menu.scale.hover = true
        this.display = true
      } else {
        this.menu.scale.hover = false
        const that = this
        this.timer = setTimeout(function () {
          that.display = false
          that.menu.scale.visible = false
        }, 1200)
      }
    },
    toggleScale () {
      this.menu.scale.value = parseFloat(this.scaleProp.toString())
      this.menu.scale.visible = !this.menu.scale.visible
    },
    formatScale () {
      if (this.menu.scale.visible && this.menu.scale.hover) {
        this.$parent.scaleTo(this.menu.scale.value)
      }
      return (this.menu.scale.value * 100).toFixed(0) + '%'
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
  line-height: 45px;
  opacity: 0.8;
  z-index: 1;
}

.bottom-toolbar-item {
  font-size: 20px;
  cursor: pointer;
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

.bottom-toolbar-wrapper {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 45px;
}
</style>
