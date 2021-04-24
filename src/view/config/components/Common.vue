<template>
  <el-form ref="commonTemp" :model="commonTemp" label-width="125px" size="mini">
    <el-divider content-position="left">界面设置</el-divider>
    <el-row>
      <el-col :span="12">
        <el-form-item label="启用两侧换页按钮">
          <el-switch
            v-model="commonTemp.interface.enableChangePageBtn"
            @change="onChange"/>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="启用缩放比例提示">
          <el-switch
            v-model="commonTemp.interface.enableScaleInfo"
            @change="onChange"/>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: 'Common',
  props: {
    common: Object
  },
  data () {
    return {
      commonTemp: {
        interface: {
          enableChangePageBtn: true,
          enableScaleInfo: true
        }
      }
    }
  },
  mounted () {
    this.option = JSON.parse(JSON.stringify(this.commonTemp))
  },
  watch: {
    common () {
      this.option = JSON.parse(JSON.stringify(this.commonTemp))
    }
  },
  methods: {
    onChange () {
      this.$emit('update', this.commonTemp)
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
