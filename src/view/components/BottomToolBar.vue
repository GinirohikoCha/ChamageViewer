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
    toggle: Boolean,
    scaleProp: Number
  },
  data () {
    return {
      menu: {
        scale: {
          value: 0,
          hover: false,
          visible: false
        }
      },
      show: false,
      timer: null
    }
  },
  watch: {
    toggle (newValue) {
      this.showToolBar(newValue)
    }
  },
  methods: {
    showToolBar (bool) {
      clearTimeout(this.timer)
      if (bool) {
        this.menu.scale.hover = true
        this.show = true
      } else {
        this.menu.scale.hover = false
        const that = this
        this.timer = setTimeout(function () {
          that.show = false
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
