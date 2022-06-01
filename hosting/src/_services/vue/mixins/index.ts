import firebase from 'firebase/app'
import Vue from 'vue'

Vue.mixin({
  methods: {
    isUrgent: function (t: firebase.firestore.Timestamp): boolean {
      return t.toMillis() - 86_400_000 < Date.now() // Less than 1 day
    }
  }
})
