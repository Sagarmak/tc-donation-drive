<template>
  <div class="admin mt-4">
    <div class="location my-2">
      <select
        v-model="location"
        name=""
        id=""
        class="mt-1 block w-80 border border-gray-300 px-3 py-2 rounded-lg appearance-none"
        @change="makeTableData"
      >
        <option :value="null" selected>Please Select the location</option>
        <option v-for="location in locations" :key="location.docId" :value="location.id">
          {{ location.name }}
        </option>
      </select>
    </div>
    <ag-grid-vue
      :columnDefs="cols"
      :rowData="modifiedPredictions"
      style="width: 100%"
      domLayout="autoHeight"
      :autoSizeStrategy="autoSizeStrategy"
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
      location: null,
      cols: [
        { field: 'user' },
        { field: 'location' },
        { field: 'item' },
        { field: 'count' },
        { field: 'date' },
      ],
      rows: [{ make: 'Tesla', model: 'Model Y', price: 64950, electric: true }],
      modifiedPredictions: [],
      autoSizeStrategy: {
        type: 'fitGridWidth',
        defaultMinWidth: 100,
      },
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
      this.modifiedPredictions = this.predictions
        .map((pred) => {
          if (pred?.date?.seconds) console.log(new Date(pred.date?.seconds * 1000))
          return {
            ...pred,
            location: this.locations.find((l) => l.id == pred.locationid)?.name,
            user: this.users.find((u) => u.id == pred.userid)?.name,
            item: this.items.find((i) => i.id == pred.itemid)?.name,
            date: new Date(pred.date?.seconds * 1000),
          }
        })
        .filter((prediction) => {
          if (!this.location) return prediction
          return prediction.locationid == this.location
        })
    },
  },
}
</script>
