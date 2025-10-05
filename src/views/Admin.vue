<template>
  <div class="admin mt-4">
    <div class="location my-2">
      <select
        v-model="location"
        name=""
        id="location"
        class="block w-56 lg:w-80 border border-gray-300 px-3 py-2 rounded-lg appearance-none mr-2"
        @change="updateTableData"
      >
        <option :value="null" selected>Please Select the location</option>
        <option v-for="location in locations" :key="location.docId" :value="location.id">
          {{ location.name }}
        </option>
      </select>
      <select
        v-model="year"
        name=""
        id="year"
        class="block w-52 lg:w-52 border border-gray-300 px-3 py-2 rounded-lg appearance-none"
        @change="updateTableData"
      >
        <option value="2025" selected>Year 2025</option>
        <option value="2024">Year 2024</option>
      </select>
    </div>
    <ag-grid-vue
      v-if="location"
      :columnDefs="itemCols"
      :rowData="itemWiseCountData"
      style="width: 100%"
      domLayout="autoHeight"
      :autoSizeStrategy="autoSizeStrategy"
      class="ag-theme-quartz mb-4"
      :loading="isAdminPageLoading"
    />
    <ag-grid-vue
      :columnDefs="cols"
      :rowData="modifiedPredictions"
      style="width: 100%"
      domLayout="autoHeight"
      :autoSizeStrategy="autoSizeStrategy"
      class="ag-theme-quartz"
      :suppressRowTransform="true"
      :loading="isAdminPageLoading"
    />
    <Notivue v-slot="item">
      <Notification :item="item" />
    </Notivue>
    <button
      type="button"
      class="text-white py-2 px-4 bg-accent rounded-md shadow-sm border border-transparent text-sm font-medium hover:bg-accent transition duration-200 ease-in fixed bottom-0 right-0 m-4"
      @click="redirectToHome"
    >
      Home
    </button>
  </div>
</template>

<script lang="js">
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { AgGridVue } from 'ag-grid-vue3'
import { db } from '@/firebase'
import { deleteDoc, doc } from 'firebase/firestore'
import { Notivue, Notification, push } from 'notivue'
import dbConfig from '../config.js'

export default {
  components: { AgGridVue, Notivue, Notification },
  watch: {
    predictions() {
      this.makeTableData()
    },
  },
  created() {
    this.push = push
    if (this.predictions?.length) this.makeTableData()
  },
  data() {
    return {
      location: null,
      year: 2025,
      itemCols: [{ field: 'item' }, { field: 'count' }],
      cols: [
        { field: 'user' },
        { field: 'location' },
        { field: 'item' },
        { field: 'count' },
        { field: 'date' },
        {
          field: 'action',
          cellRenderer: (params) => {
            const docId = params?.data?.docId
            const eDiv = document.createElement('div')
            eDiv.innerHTML = `<button class="delete-button-${docId} text-white bg-red-500 py-2 px-2 rounded-md shadow-sm border border-transparent text-xs">Delete</button>`
            const button = eDiv.querySelectorAll(`.delete-button-${docId}`)
            button[0].addEventListener('click', this.deletePrediction.bind('null', docId))
            return eDiv
          },
        },
      ],
      modifiedPredictions: [],
      autoSizeStrategy: {
        type: 'fitGridWidth',
        defaultMinWidth: 100,
      },
      itemWiseCountData: [],
      isAdminPageLoading: false,

      push: null,
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

    fetchItemWiseCount() {
      // ex: item 1 has count 3
      return Object.groupBy(this.predictions, (obj) => obj.itemid)
    },
    fetchLocationWiseItemCount() {
      // ex: item 1 has count 3
      return Object.groupBy(this.predictions, (obj) => obj.locationid)
    },
  },
  methods: {
    updateTableData() {
      this.makeTableData()
      this.fetchLocationWiseData()
    },
    makeTableData() {
      this.modifiedPredictions = this.predictions
        .map((pred) => {
          return {
            ...pred,
            location: this.locations.find((l) => l.id == pred.locationid)?.name,
            user: this.users.find((u) => u.id == pred.userid)?.name,
            item: this.items.find((i) => i.id == pred.itemid)?.name,
            date: new Date(pred.date?.seconds * 1000).toString(),
            useridCount: this.predictions.filter((prediction) => prediction.userid == pred.userid)
              ?.length,
          }
        })
        .filter((prediction) => {
          if (!this.location) return prediction
          return prediction.locationid == this.location
        })
        .sort((a, b) => (a.date > b.date ? -1 : b.date > a.date ? 1 : 0))
    },
    fetchLocationWiseData() {
      if (!this.location) return
      const currentLocationData = this.fetchLocationWiseItemCount[this.location]
      const itemWiseData = Object.groupBy(currentLocationData, (obj) => obj.itemid)
      this.itemWiseCountData = Object.keys(itemWiseData).map((i) => {
        return {
          itemId: i,
          item: this.items.find((item) => item.id == i)?.name,
          count: itemWiseData[i].reduce((acc, item) => (acc += item.count), 0),
        }
      })
    },

    deletePrediction(docId) {
      // before deleting the prediction, check if the same prediction's userid has other items
      // if the user has other predictions as well, dont delete the user, else delete the user
      this.isAdminPageLoading = true
      deleteDoc(doc(db, dbConfig.prediction, docId))
        .then(() => {
          push.success('Deleted!')
          this.getPredictions()
        })
        .finally(() => (this.isAdminPageLoading = false))
    },

    getPredictions() {
      this.$store.dispatch('fetchPredictions')
    },

    redirectToHome() {
      this.$router.push({ name: 'home' })
    },
  },
}
</script>
<style>
.cell-span {
  background-color: #ffffff;
}
.admin .location {
  display: flex;
  align-items: center;
}
</style>
