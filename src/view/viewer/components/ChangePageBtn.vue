<template>
  <div
    class="change-page-btn-left"
    v-on:mouseenter="showBtn(true)"
    v-on:mouseleave="showBtn(false)">
    <transition name="fade">
      <i class="el-icon-arrow-left arrow-left"
         v-show="display"
         @click="$emit('preImage')" />
    </transition>
  </div>

  <div
    class="change-page-btn-right"
    v-on:mouseenter="showBtn(true)"
    v-on:mouseleave="showBtn(false)">
    <transition name="fade">
      <i class="el-icon-arrow-right arrow-right"
         v-show="display"
         @click="$emit('nextImage')" />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'ChangePageBtn',
  emits: {
    preImage: null,
    nextImage: null
  },
  data () {
    return {
      display: false,
      timer: null
    }
  },
  methods: {
    showBtn (bool) {
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
.fade-enter-to,
.fade-leave-from {
  opacity: 0.7 !important;
}

.arrow-left {
  position: absolute;
  left: 0;
  top: 50%;
  border-radius: 50%;
  color: whitesmoke;
  font-size: 70px;
  transform: translate(0, -50%);
  -ms-transform: translate(0, -50%);
  -webkit-transform: translate(0, -50%);
  opacity: 0.7;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  cursor: pointer;
}

.arrow-right {
  position: absolute;
  right: 0;
  top: 50%;
  border-radius: 50%;
  color: whitesmoke;
  font-size: 70px;
  transform: translate(0, -50%);
  -ms-transform: translate(0, -50%);
  -webkit-transform: translate(0, -50%);
  opacity: 0.7;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  cursor: pointer;
}

.change-page-btn-left {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 70px;
}

.change-page-btn-right {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 70px;
}
</style>
