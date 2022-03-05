import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios";
import firebase from "firebase/app";
import 'firebase/firestore';
import vuetify from './plugins/vuetify';


Vue.prototype.$axios = axios;
Vue.config.productionTip = false

// web app's Firebase configuration



const firebaseConfig = {
  apiKey: "AIzaSyBEXHb3gf5HvWaL8Wd2Jzr5nHkLbcHHbVs",
  authDomain: "centrum-medyczne-8367d.firebaseapp.com",
  databaseURL: "https://centrum-medyczne-8367d.firebaseio.com",
  projectId: "centrum-medyczne-8367d",
  storageBucket: "centrum-medyczne-8367d.appspot.com",
  messagingSenderId: "58122938732",
  appId: "1:58122938732:web:f5c92471d4b367edb1ab49",
  measurementId: "G-4T78ED9YE7"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();

const db = firebase.firestore();
export {db}



    new Vue({
      el: '#app', 
      router,
      store,
      vuetify,
      created(){
        firebase.auth().onAuthStateChanged((user) => {
          //tu wyskakuje błąd - cannot read property auth of undefined
          if(user){
            this.$store.state.user= firebase.auth().currentUser;
          }
          else this.$store.state.user = null;
        })
      },
      render: h => h(App)
    }).$mount('#app')



