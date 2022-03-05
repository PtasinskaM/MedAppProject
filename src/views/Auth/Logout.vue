<template>
<v-container>
    <v-layout row>
        <v-flex xs16 sm6 offset-sm3>
            <v-card>
                <v-card-text>

                    <v-container>
                        <v-layout row>
                            <v-flex xs12>

                            </v-flex>
                        </v-layout>
                    </v-container>

                    <v-container>
                        <v-layout row>
                            <v-flex xs12>
                                <v-alert prominent text type="success">
                                    Wylogowano!
                                </v-alert>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</v-container>
</template>

<script>

import * as firebase from "firebase/app";
import "firebase/auth";
export default {
    name: 'Logout',
    computed: {
      user() {
        return this.$store.state.currentUser
      }
    },
    created() {
        firebase
            .auth()
            .signOut()
            .then(() => {
                this.$store.dispatch('setUser', null);
                this.$router.push({
                    name: "login"
                });

            });
    }
}
</script>
