<template>
  <div class="card">
    <div class="id">{{ id }}</div>
    <h4 class="name">{{ name }}</h4>
    <div class="meta">
      <span class="type">{{ type }}</span>
      <span class="size">({{ size | humanSize }})</span>
    </div>
    <div class="date"> {{ date | humanDate }}</div>
    <progress-bar v-for="chunk in chunks" v-bind:id="chunk.id"></progress-bar>
    <a :href="url" class="url" v-if="hasUrl()">Download</a>
  </div>
</template>

<script>
import moment from 'moment'
import ProgressBar from './ProgressBar'

export default {
  name: 'file',

  components: {
    ProgressBar
  },

  computed: {
    chunks () {
      return this.$store.getters.chunksByUploadId(this.id)
    }
  },

  data () {
    return {
      chunks: [],
      progress: '0%'
    }
  },

  props: [
    'name',
    'type',
    'date',
    'size',
    'url',
    'id'
  ],

  methods: {
    hasChunks () {
      return this.chunks.length > 0
    },

    hasUrl () {
      return typeof this.url !== 'undefined' && this.url !== ''
    }
  },

  filters: {
    humanDate (date) {
      return moment(date).format('lll')
    },

    humanSize (size) {
      let i = -1
      let units = [' KB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB']
      do {
        size = size / 1024
        i++
      } while (size > 1024)
      return Math.max(size, 0.1).toFixed(1) + units[i]
    }
  }
}
</script>

<style lang="scss" scoped>

.card {
  text-align: left;
  margin-bottom: 0.8em;
  padding: 1.25em 1em;
  line-height: 1.5em;
  color: #333;

  &.queued {
    background: rgba(255, 255, 255, 0.15);
    border: 1px dashed #ddd;
  }

  &.processing {
    background: rgba(255, 255, 255, 0.5);
    border: 1px dashed #ddd;
  }

  &.done {
    background: #fff;
    border: 1px solid #ddd;
  }

}

.name {
  margin: 0.2em 0 0;
}

.id {
  font-size: 0.9em;
  color: #aaa;
}

.url {
  font-size: 0.9em;
  text-align: right;
  padding: 0.2em 0.8em;
  line-height: 1.5em;
  background-color: #72aec9;
  color: white;
  text-decoration: none;
  display: inline-block;
  margin-top: 0.5em;
}

.progress-bar {
  width: 100%;
  background: rgba(255, 255, 255, 0.5);
  height: 16px;

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
