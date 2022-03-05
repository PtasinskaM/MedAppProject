<template>
  <v-app light>
    <myheader></myheader>
      <v-img
        src="@/assets/images/bg_3.jpg"
        gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)">
          <v-main > 
            <v-container fluid >
              <router-view></router-view>
            </v-container>  

             
          </v-main>
        
      </v-img>
     <myfooter></myfooter> 
  </v-app> 
</template>

<script>
import MyHeader from "@/components/VHeader";
import MyFooter from "@/components/VFooter";

import * as firebase from "firebase/app";
import "firebase/auth";
export default {
  name: 'App',
  

  components: {
    "myheader": MyHeader,
    "myfooter": MyFooter
  },
  created() {
    this.initApp();
  },
 
  methods: {
    initApp(){
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.$store.dispatch('setUser', user)
        } else {
          // User is signed out.
          this.$store.dispatch('setUser', null)
        }
      }, (error) => {
        console.log(error)
      })
    }
  },
  computed: {
    user() {
      return this.$store.state.currentUser
    }
  },



  data: () => ({
      
  }),
  
};
</script>

