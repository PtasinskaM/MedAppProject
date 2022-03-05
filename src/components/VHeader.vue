<template>
<v-container>
    <v-app-bar height="80" color="#023047" fixed app>
        <v-app-bar-nav-icon color="white" x-large @click.native.stop="sideNav = !sideNav" class="hidden-md-and-up">

        </v-app-bar-nav-icon>
        <v-toolbar-title>
            <router-link to="/" tag="span" class="headline font-weight-bold, white--text align-end" style="cursor: pointer">Centrum Medyczne XYZ</router-link>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items color="#023047" class="hidden-sm-and-down">
            <v-list color="#023047" v-if="!user">
                <v-btn-toggle color="#023047" v-model="toggle_exclusive">
                    <v-btn class="white--text" color="#023047"  elevation="10" x-large v-for="(item, i) in guestItems" :key="i" router :to="item.link">
                        <v-icon color="white" large left>{{item.icon}}</v-icon>
                        {{item.title}}
                    </v-btn>
                </v-btn-toggle>

            </v-list>

            <v-list color="#023047" v-if="user">
                <v-btn-toggle color="#023047" v-model="toggle_exclusive">
                    <v-btn class="white--text" color="#023047"  elevation="10" x-large v-for="(item, i) in loginItems" :key="i" router :to="item.link">
                        <v-icon color="white" large left>{{item.icon}}</v-icon>
                        {{item.title}}
                    </v-btn>
                </v-btn-toggle>
            </v-list>


        </v-toolbar-items>

    </v-app-bar>

    <v-navigation-drawer color="white" v-model="sideNav" temporary app>
        <v-list v-if="!user">

            <v-list-item class="headline font-weight-bold, white--text" color="#023047" elevation="10" x-large v-for="(item, i) in guestItems" :key="i" router :to="item.link">
                <v-list-item-icon>
                    <v-icon color="black" large left>{{item.icon}}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{item.title}}</v-list-item-title>
            </v-list-item>

        </v-list>

        <v-list v-else-if="user">

            <v-list-item class="headline font-weight-bold, red--text" color="#023047" elevation="10" x-large v-for="(item, i) in loginItems" :key="i" router :to="item.link">
                <v-list-item-icon>
                    <v-icon color="black" large left>{{item.icon}}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{item.title}}</v-list-item-title>
            </v-list-item>

        </v-list>


    </v-navigation-drawer>
</v-container>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";
export default {
    name: "myheader",
    computed: {
        user() {
          return this.$store.state.currentUser
        }

    },

    mounted() {
        this.setupFirebase();
    },
    methods: {
        setupFirebase() {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {
                    // User is signed in.
                    //this -> user
                    console.log("signed in");
                } else {
                    // No user is signed in.
                    console.log("signed out");
                }
            });
        },

    },


    data: () => ({
        sideNav: false,
        toggle_exclusive: 2,
        //opcje menu
        guestItems: [
            {
                icon: 'mdi-account',
                title: 'Zaloguj',
                link: '/login'
            }
        ],
        loginItems: [
            {
                icon: 'mdi-account',
                title: 'Panel użytkownika',
                link: '/account'
            },
            {
                icon: 'mdi-account-outline',
                title: 'Wyloguj',
                link: '/logout'
            }
        ]
        //
    }),
}
</script>
<style lang="scss">
 .v-list-item:active{
    color:"white"
  }
</style>