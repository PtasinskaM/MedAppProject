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
            Dodaj nową klinikę
          </v-card-text>
            <v-form 
              @submit.prevent="addClinic"
              ref="form"
              v-model="valid"
              lazy-validation
              >
              <v-container>  

                <v-layout row>
                  <v-col>
                    <v-flex xs12 sm12 lg12>
                      <label class="headline font-weight-bold, white--text align-end">
                      Nazwa kliniki</label>
                      <v-text-field
                      solo
                      single-line
                      height="60"
                      name="clinic_name"
                      label="Nazwa kliniki"
                      id="clinic_name"
                      v-model="clinic.clinic_name"
                      type="text"
                      required></v-text-field>
                    </v-flex>
                  </v-col>
                </v-layout>
                
                <v-layout row>
                  <v-col>
                    <v-flex xs12 sm12 lg12>
                      <label class="headline font-weight-bold, white--text align-end">
                      Telefon</label>
                      <v-text-field
                      solo
                      single-line
                      height="60"
                      name="clinic_phone"
                      label="Telefon"
                      id="clinic_phone"
                      v-model="clinic.clinic_phone"
                      type="text"
                      :rules="phoneRules"
                      ></v-text-field>
                    </v-flex>
                  </v-col>
                
                  <v-col>
                    <v-flex xs12 sm12 lg12>
                      <label class="headline font-weight-bold, white--text align-end">
                      E-mail</label>
                      <v-text-field
                      solo
                      single-line
                      height="60"
                      name="clinic_email"
                      label="E-mail"
                      id="clinic_email"
                      v-model="clinic.clinic_email"
                      type="email"
                      :rules="emailRules"
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
                      hint="Miasto"
                      :rules="cityRules"
                      required></v-text-field>
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
                    Numer lokalu</label>
                    <v-text-field
                    solo
                    single-line
                    height="60"
                    name="apartment"
                    label="Numer lokalu"
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
                    <v-btn x-large block text color="white"  type="submit">Dodaj klinikę</v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>

              <v-layout class="mt-5" row v-if="(showMessage && success)">
                  <v-flex xs12>
                    <v-alert text type="success">{{ message }}</v-alert>
                  </v-flex>
                </v-layout>

                 <v-layout row v-else-if="(showMessage && !success)">
                  <v-flex xs12>
                    <v-alert text type="error">{{ message }}</v-alert>
                  </v-flex>
                </v-layout>

          
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import * as firebase from "firebase/app";
import "firebase/auth";

//import {db} from "@/main";


    export default {
        methods: {
            async addClinic(){
                //uchwyt do bazy
                const db = firebase.firestore();
                //referencja do kolekcji (tabeli)
                var clinicRef = db.collection("clinic");
                var addressRef = db.collection("address");
                try{
                    const docRef = await addressRef.add(this.address);
                    this.clinic.address_id = docRef;
                    await clinicRef.add(this.clinic);
                    this.showMessage=true;
                    this.success=true;
                    this.message="Dodano przychodnię";
                    this.$refs.form.reset();

                }
                catch(error){
                    this.showMessage=true;
                    this.success=false;
                    this.message="Błąd przy dodawaniu przychodni";
                    console.log("Błąd przy dodawaniu przychodni: "+error) 
                    }
            },
        },
        data(){
            return{
                message: "",
                showMessage: false,
                success: false,
                address: {
                    city: "",
                    street: "",
                    building_number: "",
                    apartment: "",
                    postal_code: ""
                },

                clinic: {
                    clinic_name: "",
                    clinic_email: "",
                    clinic_phone: "",
                    address_id: ""
                },
                error: '',
                valid: true,
                emailRules: [
                    v => !!v || 'Uzupełnij e-mail!',
                    v => /.+@.+\..+/.test(v) || 'Nieprawidłowy e-mail!',
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
                building_numberRules: [
                    v => !!v || 'Uzupełnij numer domu!',
                    v => /^\d{1,4}([a-z]?)$/.test(v) || 'Nieprawidłowy format!',
                ],
                postalcodeRules: [
                    v => !!v || 'Uzupełnij kod pocztowy!',
                    v => /^\d{2}[-]{1}\d{3}$/.test(v) || 'Nieprawidłowy format!',
                ],

            }
        }
    }
</script>
