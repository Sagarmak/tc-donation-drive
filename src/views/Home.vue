<template>
  <div>
    <div class="body mt-4">
      <div class="text-color-text text-xl text-center">Please fill in the details</div>
      <div class="form flex justify-center items-center">
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
      <div class="items flex justify-evenly items-center">
        <div
          class="item rounded-md bg-white w-52 shadow-2xl"
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
</template>

<script lang="js">
import { db } from '@/firebase'
import {
  collection,
  query,
  orderBy,
  getDocs,
  where,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from 'firebase/firestore'
import { Notivue, Notification, push } from 'notivue'

export default {
  components: { Notivue, Notification },
  data() {
    return {
      name: '',
      location: null,
      locations: [],
      items: [],
      users: [],
      user: {},
      push: null,
    }
  },
  created() {
    this.getAndSetLocations()
    this.getUsers()
    this.getAllItems()
    this.getPredictions()
    this.push = push
  },
  computed: {
    lightTheme() {
      return this.$store.getters.lightTheme
    },

    itemsArePresent() {
      return this.items.some((i) => i.count)
    },
    itemsWithCount() {
      return this.items.filter((i) => i.count)
    },
  },
  methods: {
    async getAndSetLocations() {
      const locationRef = query(collection(db, 'location'), orderBy('id'))
      const locationSnapshot = await getDocs(locationRef)
      this.locations = locationSnapshot.docs.map((doc) => {
        return {
          docId: doc.id,
          ...doc.data(),
        }
      })
      this.$store.dispatch('fetchLocations', this.locations)
    },
    async getAllItems() {
      const itemRef = query(collection(db, 'items'), orderBy('id'))
      const itemSnapshot = await getDocs(itemRef)
      const items = itemSnapshot.docs.map((doc) => {
        return {
          docId: doc.id,
          ...doc.data(),
          count: 0,
        }
      })
      this.$store.dispatch('fetchItems', items)
    },
    async getAndSetItems() {
      if (!this.location) return
      const location = this.locations.find((l) => l.id == this.location)
      const itemRef = query(collection(db, 'items'), where('locationid', '==', this.location))
      const itemSnapshot = await getDocs(itemRef)
      this.items = itemSnapshot.docs.map((doc) => {
        return {
          docId: doc.id,
          ...doc.data(),
          location,
          count: 0,
        }
      })
    },

    getItemImage(item) {
      return `/${item.location.acronym}/${item.acronym}.jpeg`
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

    async getUsers() {
      const userRef = query(collection(db, 'users'))
      const userSnapshot = await getDocs(userRef)
      this.users = userSnapshot.docs.map((doc) => {
        return {
          docId: doc.id,
          ...doc.data(),
        }
      })
      this.$store.dispatch('fetchUsers', this.users)
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
        // reset the form
        setTimeout(() => {
          this.location = null
          this.name = ''
          this.user = {}
        }, 2000)
      }
    },

    async getPredictions() {
      const predRef = query(collection(db, 'prediction'))
      const predSnapshot = await getDocs(predRef)
      const predictions = predSnapshot.docs.map((doc) => {
        return {
          docId: doc.id,
          ...doc.data(),
        }
      })
      this.$store.dispatch('fetchPredictions', predictions)
    },
  },
}
</script>
