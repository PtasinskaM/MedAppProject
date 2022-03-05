<template>
  <v-container>
    <v-layout row class="justify-center">
      <v-flex cols="12" xs12 sm12 md12 lg8 >
        <v-card 
        light
        color="rgb(33, 131, 162, 0.9)"
        class="mx-auto"
        max-width="1200"
        elevation="2"
        shaped
        tile>
          <v-card-text class="display-1 font-weight-bold, white--text align-end">
            Zarejestruj pacjenta
          </v-card-text>
            
              <v-form 
                @submit.prevent="pressed"
                ref="form"
                v-model="valid"
                lazy-validation>
                <v-container>     

                <v-layout row>
                  <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    Imię</label>
                    <v-text-field
                      solo
                      single-line
                      height="60"
                      name="first_name"
                      label="Imię"
                      id="first_name"
                      v-model="patient.first_name"
                      type="text"      
                      :rules="nameRules"
                      required>
                    </v-text-field>
                  </v-flex>
                </v-col>

                <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    Nazwisko</label>
                    <v-text-field
                      solo
                      single-line
                      height="60"
                      name="last_name"
                      label="Nazwisko"
                      id="last_name"
                      v-model="patient.last_name"
                      type="text"            
                      :rules="nameRules"
                      required>
                    </v-text-field>
                  </v-flex>
                </v-col>
              </v-layout>

              <v-layout row>
                <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    E-mail</label>
                    <v-text-field
                    solo
                    single-line
                    height="60"
                    name="email"
                    label="E-mail"
                    id="email"
                    v-model="patient.email"
                    type="email"
                    :rules="emailRules"
                    required></v-text-field> 
                  </v-flex>
                </v-col>

                <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    Numer telefonu</label>
                    <v-text-field
                    solo
                    single-line
                    height="60"
                    name="mobile"
                    label="Telefon"
                    id="mobile"
                    v-model="patient.mobile"
                    type="text"
                    required
                    :rules="phoneRules"
                    ></v-text-field>
                  </v-flex>
                </v-col>
              </v-layout> 

              
              <v-layout row>
                <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    PESEL</label>
                    <v-text-field
                    solo
                    single-line
                    height="60"
                    name="pesel"
                    label="PESEL"
                    id="pesel"
                    v-model="patient.pesel"
                    type="text"
                    :rules="peselRules"
                    required></v-text-field>
                  </v-flex>
                </v-col>
               
                <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                      Data urodzenia</label>
                    <v-text-field
                      solo
                      single-line
                      height="60"
                      name="date"
                      label="Data urodzenia"
                      id="date"
                      v-model="patient.date_of_birth"
                      type="date"          
                      required></v-text-field>
                  </v-flex>
                </v-col>  
              </v-layout>

              <v-layout row>
                <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    Miasto</label>
                    <v-text-field
                    solo
                    single-line
                    height="60"
                    name="city"
                    label="Miasto"
                    id="city"
                    v-model="address.city"
                    type="text"
                    required
                    :rules="cityRules"></v-text-field>
                  </v-flex>
                </v-col>

                <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    Ulica</label>
                    <v-text-field
                    solo
                    single-line
                    height="60"
                    name="street"
                    label="Ulica"
                    id="street"
                    v-model="address.street"
                    type="text"
                    :rules="streetRules"
                    required></v-text-field>
                  </v-flex>
                </v-col>
              </v-layout>

              <v-layout row>
                <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    Numer budynku</label>
                    <v-text-field
                    solo
                    single-line
                    height="60"
                    name="building_number"
                    label="Numer budynku"
                    id="building_number"
                    v-model="address.building_number"
                    type="text"
                    required
                    :rules="building_numberRules"
                    ></v-text-field>
                  </v-flex>
                </v-col>
                
                <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    Numer mieszkania</label>
                    <v-text-field
                    solo
                    single-line
                    height="60"
                    name="apartment"
                    label="Numer mieszkania"
                    id="apartment"
                    v-model="address.apartment"
                    type="text"
                    ></v-text-field>
                  </v-flex>
                </v-col>

                <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    Kod pocztowy</label>
                    <v-text-field
                    solo
                    single-line
                    height="60"
                    name="postal_code"
                    label="Np. 12-345"
                    id="postal_code"
                    v-model="address.postal_code"
                    type="text"
                    :rules="postalcodeRules"
                    required></v-text-field>
                  </v-flex>
                </v-col>
              </v-layout>

                  <v-layout row xs12>
                    <v-flex xs6 pa-1>
                      <v-btn x-large block text color="white" type="submit">Zarejestruj</v-btn>
                    </v-flex>
                    <v-flex xs6 pa-1>
                      <v-btn x-large block text color="white" @click="reset">Wyczyść formularz</v-btn>
                    </v-flex>
                  </v-layout>

              </v-container>
            </v-form>          
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";

    export default {
        methods: {
            async pressed(){
                if(this.$refs.form.validate()){
                  this.patient.password=this.generatePassword(20);
                  var data = {
                    address: this.address,
                    patient: this.patient
                  };

                  console.log(this.patient.email.toString());

                  var addMessage = firebase.functions().httpsCallable("createPatientWithRole");
                  addMessage(data)
                  .then(function(result){
                      console.log(result);
                  })
                  .catch(function(error){
                    console.log(error);
                    this.message="Konto o podanym adresie e-mail już istnieje!";
                    this.error=true;
                  });

                  this.$router.replace({name: "home"});
                  
                  alert('submited')
                }
            },
            reset () {
              this.$refs.form.reset()
            },
            generatePassword(pLength){
                var keyListAlpha = "abcdefghijklmnoprstuvwxyz",
                    keyListInt="1234567890",
                    keyListSpec="!@#_",
                    password="";
                var len=Math.ceil(pLength/2);
                len=len-1;
                var lenSpec=pLength-2*len;
                var i=0;
                for(i=0;i<len;i++){
                    password+=keyListAlpha.charAt(Math.floor(Math.random()*keyListAlpha.length));
                    password+=keyListInt.charAt(Math.floor(Math.random()*keyListInt.length));   
                }
                for(i=0;i<lenSpec;i++){
                    password+=keyListSpec.charAt(Math.floor(Math.random()*keyListSpec.length));
                }
                password=password.split('').sort(function(){return 0.5-Math.random()}).join('');

                return password;
            }
        },
        data(){
            return{
              valid: true,
              firstnameRules: [
                    v => !!v || 'Uzupełnij imię!',
                    v => /[A-ZĄĆĘŃŁÓŚŻŹ]{1}[a-ząćęńłóśżź]{1,20}/.test(v) || 'Nieprawidłowe imię!',
                  ],
                  lastnameRules: [
                    v => !!v || 'Uzupełnij nazwisko!',
                    v => /[A-ZĄĆĘŃŁÓŚŻŹ][a-ząćęńłóśżź]{1,20}(-[A-ZĄĆĘŃŁÓŚŻŹ][a-ząćęńłóśżź]{1,20})?/.test(v) || 'Nieprawidłowe nazwisko!',
                  ],
                  emailRules: [
                    v => !!v || 'Uzupełnij e-mail!',
                    v => /.+@.+\..+/.test(v) || 'Nieprawidłowy e-mail!',
                  ],
                  dateRules: [
                    v => !!v || 'Uzupełnij datę!',
                  ],
                  streetRules: [
                    v => !!v || 'Wpisz ulicę!',
                  ],
                  cityRules: [
                    v => !!v || 'Wpisz miasto!',
                  ],
                  phoneRules: [
                    v => !!v || 'Uzupełnij numer telefonu!',
                    v => /^\d{9}$/.test(v) || 'Nieprawidłowy telefon!',
                  ],
                  peselRules: [
                    v => !!v || 'Uzupełniij PESEL!',
                    v => /^\d{11}$/.test(v) || 'Nieprawidłowy PESEL!',
                  ],
                  building_numberRules: [
                    v => !!v || 'Uzupełnij numer domu!',
                    v => /^\d{1,4}([a-z]?)$/.test(v) || 'Nieprawidłowy format!',
                  ],
                  postalcodeRules: [
                    v => !!v || 'Uzupełnij kod pocztowy!',
                    v => /^\d{2}[-]{1}\d{3}$/.test(v) || 'Nieprawidłowy format!',
                  ],

                address: {
                    city: "",
                    street: "",
                    building_number: "",
                    apartment: "",
                    postal_code: ""
                },

                patient: {
                    first_name: "",
                    last_name: "",
                    pesel: "",
                    date_of_birth: "",
                    address_id:"",
                    mobile: "",
                    email: "",
                    password: '',
                    is_active: true,
                    

                },
                error: ''
                
            }
        }
    }
</script>
