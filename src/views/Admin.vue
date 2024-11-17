<template>
  <div class="admin mt-4">
    <pre>
      {{ predictions }}
    </pre>
    <ag-grid-vue
      :rowData="rows"
      :columnDefs="cols"
      style="height: 500px; width: 100%"
      class="ag-theme-quartz"
    />
  </div>
</template>

<script lang="js">
import 'ag-grid-community/styles/ag-grid.css' // Mandatory CSS required by the Data Grid
import 'ag-grid-community/styles/ag-theme-quartz.css' // Optional Theme applied to the Data Grid
import { AgGridVue } from 'ag-grid-vue3'

export default {
  components: { AgGridVue },
  data() {
    return {
      // users, location, item, count
      cols: [{ field: 'make' }, { field: 'model' }, { field: 'price' }, { field: 'electric' }],
      rows: [
        { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
        { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
        { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
      ],
    }
  },
  computed: {
    predictions() {
      return this.$store.getters.predictions
    },
  },
}
</script>
