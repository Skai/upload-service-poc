<template>
  <div class="queue-list">
    <h3>Queued</h3>
    <file
      v-for="file in queue"
      class="queued"
      v-bind:name="file.name"
      v-bind:type="file.type"
      v-bind:date="file.lastModifiedDate"
      v-bind:size="file.size"
      v-bind:id="file.id">
    </file>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import File from './File'

export default {
  name: 'queue-list',

  components: {
    File
  },

  data () {
    return {
      queue: []
    }
  },

  computed: mapGetters({
    queue: 'queuedUploads'
  })
}
</script>

<style lang="sass" scoped>
.queue-list
  margin: 1em 0;
</style>