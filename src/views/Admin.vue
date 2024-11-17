<template>
  <div class="admin mt-4">
    <ag-grid-vue
      :columnDefs="cols"
      :rowData="modifiedPredictions"
      style="height: 500px; width: 100%"
      class="ag-theme-quartz"
    />
  </div>
</template>

<script lang="js">
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { AgGridVue } from 'ag-grid-vue3'

export default {
  components: { AgGridVue },
  watch: {
    predictions() {
      this.makeTableData()
    },
  },
  data() {
    return {
      cols: [
        { field: 'user' },
        { field: 'location' },
        { field: 'item' },
        { field: 'count' },
        { field: 'date' },
      ],
      rows: [{ make: 'Tesla', model: 'Model Y', price: 64950, electric: true }],
      modifiedPredictions: [],
    }
  },
  computed: {
    predictions() {
      return this.$store.getters.predictions
    },
    locations() {
      return this.$store.getters.locations
    },
    users() {
      return this.$store.getters.users
    },
    items() {
      return this.$store.getters.items
    },
  },
  methods: {
    makeTableData() {
      this.modifiedPredictions = this.predictions.map((pred) => {
        return {
          ...pred,
          location: this.locations.find((l) => l.id == pred.locationid)?.name,
          user: this.users.find((u) => u.id == pred.userid)?.name,
          item: this.items.find((i) => i.id == pred.itemid)?.name,
        }
      })
    },
  },
}
</script>
