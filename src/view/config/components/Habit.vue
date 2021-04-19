<template>
  <el-form ref="option" :model="option" label-width="100px" size="mini">
    <el-divider content-position="left">鼠标滚轮设置</el-divider>
    <el-form-item label="启用鼠标滚轮">
      <el-switch
        v-model="option.scroll.enable"
        @change="onChange"/>
      <el-radio-group
        style="margin-left: 20px"
        v-model="option.scroll.mode"
        :disabled="!option.scroll.enable"
        @change="onChange">
        <el-radio :label="0">鼠标滚轮缩放</el-radio>
        <el-radio :label="1">鼠标滚轮翻页</el-radio>
      </el-radio-group>
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
          enable: true,
          mode: 0 // 0:缩放-1:翻页
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
