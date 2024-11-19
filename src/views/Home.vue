<template>
  <div>
    <div class="body mt-4">
      <div class="text-color-text text-xl text-center">Please fill in the details</div>
      <div class="form flex flex-col items-center lg:justify-center">
        <div class="name my-2 mr-2">
          <label for="name" class="text-center block text-sm font-medium text-color-text">
            Full Name
          </label>
          <input
            v-model="name"
            type="text"
            name=""
            id=""
            class="mt-1 block w-80 border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:border-primary"
          />
        </div>
        <div class="office my-2">
          <label for="office" class="text-center block text-sm font-medium text-color-text">
            Office
          </label>
          <select
            v-model="location"
            name=""
            id=""
            class="mt-1 block w-80 border border-gray-300 px-3 py-2 rounded-lg appearance-none"
            @change="getAndSetItems"
          >
            <option :value="null" selected>Please Select</option>
            <option v-for="location in locations" :key="location.docId" :value="location.id">
              {{ location.name }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div v-if="location" class="select-item mt-4">
      <div class="text-color-text text-xl text-center mb-4">
        Please select the items of donation with quantity
      </div>
      <div v-if="isLoading" class="flex justify-center items-center">
        <div
          class="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600"
        />
      </div>
      <div v-else class="items flex flex-col items-center lg:flex-row lg:justify-evenly">
        <div
          class="item rounded-md bg-white w-52 shadow-2xl mb-6 lg:mb-0"
          v-for="item in items"
          :key="item.docId"
        >
          <div class="item-image pt-2">
            <img
              class="mx-auto h-48 w-48 rounded-md object-cover"
              :src="getItemImage(item)"
              alt="therabands"
            />
          </div>
          <div class="text text-center py-2 px-2 min-h-20 flex items-center justify-center">
            {{ item.name }}
          </div>
          <hr />
          <div class="counter flex justify-evenly items-center text-center min-h-8">
            <div
              class="subtract cursor-pointer w-10 hover:bg-slate-200 transition duration-200 ease-in rounded-full"
              @click="addValue(item, 'remove', 1)"
            >
              -
            </div>
            <div class="score w-10">{{ item.count }}</div>
            <div
              class="addition cursor-pointer w-10 hover:bg-slate-200 transition duration-200 ease-in rounded-full"
              @click="addValue(item, 'add', 1)"
            >
              +
            </div>
          </div>
          <hr />
          <div class="donations p-2 text-center">Donations: {{ item.itemWiseCount }}</div>
        </div>
      </div>
    </div>
    <div class="submit mt-8 text-center">
      <button
        type="submit"
        class="text-white py-2 px-4 rounded-md shadow-sm border border-transparent text-sm font-medium hover:bg-accent transition duration-200 ease-in"
        :class="itemsArePresent ? 'bg-primary' : 'bg-gray-400'"
        @click="submitForm"
      >
        Submit
      </button>
      <Notivue v-slot="item">
        <Notification :item="item" />
      </Notivue>
    </div>
  </div>
  <button
    type="button"
    class="text-white py-2 px-4 bg-accent rounded-md shadow-sm border border-transparent text-sm font-medium hover:bg-accent transition duration-200 ease-in fixed bottom-0 right-0 m-4"
    @click="redirectToAdmin"
  >
    Admin
  </button>
</template>

<script lang="js">
import { db } from '@/firebase'
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore'
import { Notivue, Notification, push } from 'notivue'

export default {
  components: { Notivue, Notification },
  data() {
    return {
      name: '',
      location: null,
      items: [],
      user: {},
      push: null,

      isLoading: false,
    }
  },
  created() {
    this.push = push
  },
  computed: {
    lightTheme() {
      return this.$store.getters.lightTheme
    },

    locations() {
      return this.$store.getters.locations
    },
    users() {
      return this.$store.getters.users
    },
    predictions() {
      return this.$store.getters.predictions
    },

    itemsArePresent() {
      return this.items.some((i) => i.count)
    },
    itemsWithCount() {
      return this.items.filter((i) => i.count)
    },

    fetchItemWiseCount() {
      // ex: item 1 has count 3
      return Object.groupBy(this.predictions, (obj) => obj.itemid)
    },
  },
  methods: {
    getItemImage(item) {
      if (!item) return
      return `/${item.location?.acronym}/${item?.acronym}.jpeg`
    },

    async getAndSetItems() {
      this.isLoading = true
      if (!this.location) return
      const location = this.locations.find((l) => l.id == this.location)
      const itemRef = query(collection(db, 'items'), where('locationid', '==', this.location))
      const itemSnapshot = await getDocs(itemRef)
      this.items = itemSnapshot.docs.map((doc) => {
        const itemWiseCount = this.fetchItemWiseCount[doc.data()?.id]?.reduce(
          (acc, item) => (acc += item.count),
          0,
        )
        return {
          docId: doc.id,
          ...doc.data(),
          location,
          count: 0,
          itemWiseCount: itemWiseCount || 0,
        }
      })
      this.isLoading = false
    },

    addValue(item, action, count) {
      if (action == 'add') {
        item.count += count
      }
      if (action == 'remove') {
        if (item.count == 0) return
        item.count -= count
      }
    },

    submitForm() {
      if (!this.name) return push.error('Please enter your name!')
      if (!this.location) return push.error('Please select the location!')
      if (!this.itemsArePresent) return push.error('Please add the items before saving!')
      this.addUser()
    },

    async addUser() {
      const formData = {
        id: this.users.length + 1,
        name: this.name,
      }
      const docRef = await addDoc(collection(db, 'users'), formData)
      const userRef = doc(db, 'users', docRef.id)
      if (docRef.id) {
        getDoc(userRef).then((doc) => {
          this.user = doc.data()
          this.addPrediction()
        })
      }
    },

    async addPrediction() {
      let results = await Promise.all(
        this.itemsWithCount.map((iwc) => {
          const formData = {
            count: iwc.count,
            itemid: iwc.id,
            userid: this.user.id,
            locationid: this.location,
            date: serverTimestamp(),
          }
          return addDoc(collection(db, 'prediction'), formData)
        }),
      )
      if (results.length) {
        push.success('Saved!')
        this.getUsers()
        this.getPredictions()
        // reset the form
        setTimeout(() => {
          this.location = null
          this.name = ''
          this.user = {}
        }, 2000)
      }
    },

    getPredictions() {
      this.$store.dispatch('fetchPredictions')
    },
    getUsers() {
      this.$store.dispatch('fetchUsers')
    },
    redirectToAdmin() {
      this.$router.push({ name: 'admin' })
    },
  },
}
</script>
