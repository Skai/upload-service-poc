<template>
  <div id="app">
    <h1>Feed Me!</h1>
    <creature></creature>

    <div class="Grid Grid--gutters Grid--full">
      <div class="Grid-cell">
        <div class="col">
          <queue-list></queue-list>
        </div>
      </div>
      <div class="Grid-cell">
        <div class="col">
          <processing-list></processing-list>
        </div>
      </div>
      <div class="Grid-cell">
        <div class="col">
          <done-list></done-list>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Creature from './components/Creature'
import DoneList from './components/DoneList'
import QueueList from './components/QueueList'
import ProcessingList from './components/ProcessingList'

export default {
  name: 'app',

  components: {
    Creature,
    DoneList,
    QueueList,
    ProcessingList
  },

  data () {
    return { }
  },

  methods: {
  }
}
</script>

<style lang="scss">

body {
  background: #f3f3f3;
}

#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333;
}

input[type="text"] {
  padding: 3px 4px;
  width: auto;
}

.Grid {
  margin-top: 2em;
  display: flex;
}

.Grid-cell {
  flex: 1;
  background-color: #f3f3f3;
}

.Grid--gutters {
  margin: -1em 0 0 -1em;

  & > .Grid-cell {
    padding: 1em 0 0 1em;
  }
}

.col {
  padding: 1em;

  h3 {
    color: #666;
  }
}
</style>
