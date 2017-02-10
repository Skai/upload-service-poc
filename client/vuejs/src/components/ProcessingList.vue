<template>
  <div class="processing-list">
    <h3>Processing</h3>
    <file
      v-for="file in processing"
      class="processing"
      v-bind:hasProgress="true"
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
  name: 'processing-list',

  components: {
    File
  },

  data () {
    return {
      processing: []
    }
  },

  computed: mapGetters({
    processing: 'processingUploads'
  })
}
</script>

<style lang="sass" scoped>
.processing-list
  margin: 1em 0;
</style>