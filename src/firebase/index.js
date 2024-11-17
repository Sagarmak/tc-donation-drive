import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDlLMv9O13OwTto168Y8qNwVy8MLbEx-NU',
  authDomain: 'tc-donation-drive.firebaseapp.com',
  projectId: 'tc-donation-drive',
  storageBucket: 'tc-donation-drive.firebasestorage.app',
  messagingSenderId: '19666303198',
  appId: '1:19666303198:web:df4e116c02f2e7793f6a4f',
}

// // Initialize Firebase
const app = initializeApp(firebaseConfig)

// // init firebase
const db = getFirestore(app)

export { app, db }
