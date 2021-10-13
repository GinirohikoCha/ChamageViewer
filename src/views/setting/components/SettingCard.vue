<template>
  <el-switch
    v-model="switchStatus"
    :active-text="title"
    @change="$emit('change', switchStatus)"/>
</template>

<script>
export default {
  name: 'SettingCard',
  props: {
    title: String,
    status: Boolean
  },
  emits: {
    change: null
  },
  data () {
    return {
      switchStatus: false
    }
  },
  watch: {
    status (newValue) {
      this.switchStatus = newValue
    }
  },
  mounted () {
    this.switchStatus = this.status
  }
}
</script>

<style scoped>
</style>
