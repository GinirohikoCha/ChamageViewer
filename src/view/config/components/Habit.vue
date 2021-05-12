<template>
  <el-form ref="option" :model="option" label-width="100px" size="mini">
    <el-divider content-position="left">鼠标滚轮设置</el-divider>
    <el-form-item label="鼠标滚轮功能">
      <el-tooltip effect="dark" content="按住Ctrl临时切换滚轮功能" placement="bottom">
        <el-switch
          v-model="option.scroll.mode"
          style="margin-left: 20px"
          inactive-text="鼠标滚轮翻页"
          inactive-color="#13ce66"
          :inactive-value="0"
          active-text="鼠标滚轮缩放"
          :active-value="1"
          @change="onChange"/>
      </el-tooltip>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'Habit',
  props: {
    habit: Object
  },
  data () {
    return {
      option: {
        scroll: {
          mode: 0 // 0-翻页:1-缩放
        }
      }
    }
  },
  mounted () {
    this.option = JSON.parse(JSON.stringify(this.habit))
  },
  watch: {
    habit () {
      this.option = JSON.parse(JSON.stringify(this.habit))
    }
  },
  methods: {
    onChange () {
      this.$emit('update', this.option)
    }
  }
}
</script>

<style scoped>
  * {
    text-align: left;
  }

  .el-form-item {
    margin-bottom: 8px;
  }

  /deep/ .el-divider__text {
    font-size: 12px;
  }
</style>
