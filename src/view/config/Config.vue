<template>
  <el-tabs :tab-position="'left'" style="height: 400px;">
    <el-tab-pane label="常规设置">常规设置</el-tab-pane>
    <el-tab-pane label="习惯设置"><Habit :habit="config.habit" @update="updateHabit"/></el-tab-pane>
  </el-tabs>
</template>

<script>
import { ipcRenderer } from 'electron'
import Habit from '@/view/config/components/Habit'

export default {
  name: 'Config',
  components: {
    Habit
  },
  data () {
    return {
      config: {
        version: '0.0.0',
        habit: {
          scroll: {
            enable: true,
            mode: 0 // 0:缩放-1:翻页
          }
        }
      }
    }
  },
  methods: {
    updateHabit (habit) {
      this.config.habit = habit
      ipcRenderer.send('update-config', JSON.parse(JSON.stringify(this.config)))
    }
  }
}
</script>

<style scoped>

</style>
