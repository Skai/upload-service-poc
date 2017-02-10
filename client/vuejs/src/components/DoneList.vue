<template>
  <div class="done-list">
    <h3>Done</h3>
    <file
      v-for="file in done"
      class="done"
      v-bind:name="file.name"
      v-bind:type="file.type"
      v-bind:date="file.lastModifiedDate"
      v-bind:size="file.size"
      v-bind:url="file.url"
      v-bind:id="file.id">
    </file>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import File from './File'

export default {
  name: 'done-list',

  components: {
    File
  },

  data () {
    return {
      done: []
    }
  },

  computed: mapGetters({
    done: 'doneUploads'
  })
}
</script>

<style lang="sass" scoped>
.done-list
  margin: 1em 0;
</style>