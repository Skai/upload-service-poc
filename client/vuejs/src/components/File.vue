<template>
  <div class="card">
    <div class="id">{{ id }}</div>
    <h4 class="name">{{ name }}</h4>
    <div class="meta">
      <span class="type">{{ type }}</span>
      <span class="size">({{ size | humanSize }})</span>
    </div>
    <div class="date"> {{ date | humanDate }}</div>
    <table>
      <tr v-for="(chunk, i) in chunks">
        <td v-for="c in cellsBefore(i)"></td>
        <td :style="{ width: chunkWidth(chunk) }">
          <progress-bar v-bind:id="chunk.id"></progress-bar>
        </td>
        <td v-for="c in cellsAfter(i)"></td>
      </tr>
    </table>
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
    // 'chunks'
  ],

  methods: {
    hasUrl () {
      return typeof this.url !== 'undefined' && this.url !== ''
    },

    chunkWidth (chunk) {
      let p = (parseInt(chunk.end) - parseInt(chunk.start)) / parseInt(this.size)
      return (Math.round(p * 100)).toString() + '%'
    },

    cellsBefore (index) {
      return index
    },

    cellsAfter (index) {
      return (this.chunks.length - ++index)
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

table {
  width: 100%;
  border: 0;
  border-spacing: 0;
  border-collapse: collapse;
  margin: 0;
  padding: 0;
}
</style>
