<template>
  <div class="w-100 px-20 py-10">
    <div class="header flex items-center justify-between">
      <div>
        <AppLogo :light-theme="lightTheme" />
        <div class="text-color-text text-2xl italic mt-2">Donation Drive</div>
      </div>
      <div class="theme cursor-pointer">
        <LightTheme v-if="!lightTheme" @click="changeTheme(true)" />
        <DarkTheme v-if="lightTheme" @click="changeTheme(false)" />
      </div>
    </div>
    <div class="body mt-4">
      <div class="text-color-text text-xl text-center">Please fill in the details</div>
      <div class="form flex flex-col items-center">
        <div class="name my-2">
          <label for="name block text-sm font-medium text-gray-700">Full Name</label>
          <input
            v-model="name"
            type="text"
            name=""
            id=""
            class="mt-1 block w-80 border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:border-primary"
          />
        </div>
        <div class="office my-2">
          <label for="office block text-sm font-medium text-gray-700">Office</label>
          <select
            v-model="location"
            name=""
            id=""
            class="mt-1 block w-80 border border-gray-300 px-3 py-2 rounded-lg appearance-none"
            @change="getAndSetItems"
          >
            <option value="" selected>Please Select</option>
            <option v-for="location in locations" :key="location.docId" :value="location.id">
              {{ location.name }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div v-if="!location" class="text-color-text text-xl text-center mt-4">
      Please select the location to continue
    </div>
    <div v-if="location" class="select-item mt-4">
      <div class="text-color-text text-xl text-center">
        Please select the items of donation with quantity
      </div>
      <div class="items flex justify-evenly items-center">
        <div
          class="item rounded-md bg-white w-44 mt-4 shadow-2xl"
          v-for="item in items"
          :key="item.docId"
        >
          <div class="item-image pt-2">
            <img
              class="mx-auto h-40 w-40 rounded-md object-cover"
              :src="getItemImage(item)"
              alt="therabands"
            />
            <div class="text text-center py-2 px-1 min-h-20 flex items-center justify-center">
              {{ item.name }}
            </div>
            <hr />
            <div class="counter flex justify-evenly items-center text-center min-h-8">
              <div
                class="subtract cursor-pointer w-10 hover:bg-slate-200 transition duration-200 ease-in rounded-full"
              >
                -
              </div>
              <div class="score w-10">0</div>
              <div
                class="addition cursor-pointer w-10 hover:bg-slate-200 transition duration-200 ease-in rounded-full"
              >
                +
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="name && location" class="submit mt-8 text-center">
      <button
        type="submit"
        class="text-white bg-primary py-2 px-4 rounded-md shadow-sm border border-transparent text-sm font-medium hover:bg-accent transition duration-200 ease-in"
      >
        Submit
      </button>
    </div>
  </div>
</template>

<script lang="js">
import AppLogo from '../components/AppLogo.vue'
import LightTheme from '../components/LightTheme.vue'
import DarkTheme from '../components/DarkTheme.vue'
import { db } from '@/firebase'
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore'

export default {
  components: { AppLogo, LightTheme, DarkTheme },
  data() {
    return {
      name: '',
      location: null,
      locations: [],
      items: [],
    }
  },
  created() {
    this.getAndSetLocations()
  },
  computed: {
    lightTheme() {
      return this.$store.getters.lightTheme
    },
  },
  methods: {
    changeTheme(theme) {
      this.$store.dispatch('changeTheme', theme).then(() => {
        console.log('done')
      })
    },

    async getAndSetLocations() {
      const matchesRef = query(collection(db, 'location'), orderBy('id'))
      const matchesSnapshot = await getDocs(matchesRef)
      this.locations = matchesSnapshot.docs.map((doc) => {
        return {
          docId: doc.id,
          ...doc.data(),
        }
      })
    },
    async getAndSetItems() {
      console.log(this.location)
      if (!this.location) return
      const location = this.locations.find((l) => l.id == this.location)
      const matchesRef = query(collection(db, 'items'), where('locationid', '==', this.location))
      const matchesSnapshot = await getDocs(matchesRef)
      this.items = matchesSnapshot.docs.map((doc) => {
        return {
          docId: doc.id,
          ...doc.data(),
          location,
        }
      })
    },

    getItemImage(item) {
      return `/${item.location.acronym}/${item.acronym}.jpeg`
    },
  },
}
</script>
