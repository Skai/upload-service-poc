<template>
  {{ id }}
  <div class="progress-bar">
    <div class="bar" :style="{ width: progress }">
      <span class="text">{{ progress }}</span>
    </div>
  </div>
</template>

<script>
import { bus } from './../bus'

export default {
  name: 'progress-bar',

  beforeCreate () {
    bus.on('percentage', (percent, id) => {
      if (id === this.id) {
        this.$set(this, 'progress', parseInt(percent) + '%')
      }
    })
  },

  data () {
    return {
      progress: '0%'
    }
  },

  props: [
    'id'
  ]
}
</script>

<style lang="scss" scoped>

.progress-bar {
  width: 100%;
  background: #e4e4e4;
  height: 16px;
  margin-top: 4px;
  overflow: hidden;

  .bar {
    height: 16px;
    background-color: #8bc34a;
    overflow: hidden;
    box-sizing: border-box;
    padding-right: 5px;
  }

  .text {
    display: block;
    width: 100%;
    padding-right: 1em;
    font-size: 12px;
    font-weight: bold;
    line-height: 16px;
    color: white;
    text-align: right;
  }
}

</style>
