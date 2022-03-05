<template>
<v-container grid-list-md>
<v-card
    light
    class="mx-auto"
    max-width="800"
    elevation="2"
    color="rgb(33, 131, 162, 0.8)"
    shaped
    tile>

    <v-card-text class="headline font-weight-bold, white--text align-end">
        Zaloguj się 
    </v-card-text>

    <form @submit.prevent="login">            
        <v-container>
            <v-layout  wrap>                     
                        
                <v-flex xs12 sm12 lg12 >
                    <v-text-field 
                        single-line
                        solo
                        height="60"
                        name="email" 
                        placeholder="E-mail" 
                        id="email" 
                        v-model="email" 
                        type="email" 
                        required>
                    </v-text-field>
                </v-flex>
                          
                <v-flex xs12 sm12 lg12 >
                    <v-text-field 
                        single-line
                        solo
                        height="60"
                        name="password" 
                        placeholder="Hasło" 
                        id="password" 
                        v-model="password"
                        type="password"
                        required>
                    </v-text-field>
                </v-flex>

                <v-flex xs12 sm12 lg12 v-if="error">
                  <v-alert class="title" color="#e56b6f" type="error">
                    {{message}}
                  </v-alert>
                </v-flex>

                <v-flex xs12 sm12 lg12 v-if="sendedMessage">
                  <v-alert class="title" color="#95d5b2" type="info">
                    {{message}}
                  </v-alert>
                </v-flex>

            </v-layout>  

                <v-card-actions class="justify-center">      
                   
                <v-layout row xs12>
                  <v-flex xs6 pa-1>
                    <v-btn block x-large text color="white" type="submit">Zaloguj</v-btn>
                  </v-flex>
                  <v-flex xs6 pa-1>
                    <v-btn block x-large text color="white" @click="resetDialog=true" >Nie pamiętam hasła</v-btn>
                  </v-flex>
                </v-layout>
                </v-card-actions>
       
        </v-container>
    </form>


    <v-dialog
      v-model="resetDialog"
      persistent
      max-width="600px"
    >
      <v-card  color="rgb(33, 131, 162)">
        <v-card-title class="headline font-weight-bold white--text align-end">Odzyskiwanie hasła</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  single-line
                  solo
                  height="60"
                  name="email" 
                  placeholder="E-mail"
                  v-model="resetEmail"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
            <v-flex xs6 pa-1>
                <v-btn color="#fb8500" block x-large text @click="resetDialog = false">Anuluj</v-btn>
            </v-flex>
            <v-flex xs6 pa-1>
                <v-btn block x-large text color="white" @click="reset_password">Wyślij</v-btn>
            </v-flex>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      width="600px"
      persistent
      v-model="messageDialog">
      <v-card v-if="error==false" color="rgb(149, 213, 178, 0.8)" >
        <v-card-text  class="headline font-weight-bold, white--text align-center">
          <v-layout row>
            <v-flex align-center justify-center>
          {{message}}  
            </v-flex>
          </v-layout> 
        </v-card-text>
        <v-card-actions>
            <v-btn block x-large text info color="white" @click="messageDialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else-if="error==true" color="rgb(229, 107, 111, 0.8)">
        <v-card-text  class="headline font-weight-bold, white--text align-end">
           <v-layout row>
            <v-flex align-center justify-center>
          {{message}}  
           </v-flex>
          </v-layout> 
        </v-card-text>
        <v-card-actions>
            <v-btn block x-large text color="white" @click="messageDialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
      
    
    </v-dialog>


</v-card>  
</v-container>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";




export default {
    data() {
        return {
            email: '',
            password: '',
            error: false,
            message: "",
            resetDialog: false,
            resetEmail: "",
            sendedMessage: false,
            messageDialog: false,
        }
    },
    computed: {
      user() {
        return this.$store.state.currentUser
      }
    },
    methods: {
    
        async login() {
            try{
                const user = await firebase.auth()
                .signInWithEmailAndPassword(this.email, this.password);
                this.$store.dispatch('setUser', user);
                await this.$router.push("/account");
            }
            catch(error){
              this.message = "Dane logowania nie są poprawne";
              this.error = true;
            }
        },
        reset_password(){
            var auth = firebase.auth();

            auth.sendPasswordResetEmail(this.resetEmail).then(() => {
            console.log("Wysłano wiadomość na podany adres e-mail");
            this.message = "Wysłano wiadomość na podany adres e-mail";
            this.error = false;
            this.resetDialog=false;
            this.messageDialog=true;
            }).catch((error) => {
                console.log(error);
                this.error = true;
                this.resetDialog=false;
                this.messageDialog=true;
                this.message = "Nie ma konta o podanym adresie e-mail!"
            });
        }

    }
}
</script>

<style lang="scss">
  .v-text-field input {
    font-size: 1.6em;
  }
</style>