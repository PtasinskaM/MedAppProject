<template>
  <v-container>
    <v-layout row class="justify-center">
      <v-flex cols="12" xs12 sm12 md12 lg8  >
        <v-card 
          color="rgb(33, 131, 162, 0.9)"
          width="600"
          class="mx-auto"
          elevation="2"
          shaped
          tile>

          <v-card-text class="display-1 font-weight-bold, white--text align-end">
            Dodaj nowy dyżur
          </v-card-text>

            <v-container>
              <v-form @submit.prevent="pressed" ref="form">

               <v-layout row>
                 <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    Lekarz</label>
                    <v-autocomplete
                    solo
                    single-line
                    height="60"
                    name=""
                    label="Lekarz"
                    v-model="doctorHasShift.doctor_id"
                    :items="doctors"
                    item-text="full_name"
                    item-value="id"
                    no-data-text="Brak danych"
                    required
                    @change="selectClinic"
                    ></v-autocomplete>            
                  </v-flex>
                </v-col>
                </v-layout> 

                <v-layout row>
                   <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    Przychodnia</label>
                    <v-autocomplete
                    solo
                    single-line
                    height="60"
                    name="clinic_name"
                    label="Nazwa przychodni"
                    v-model="clinic_id"
                    :items="clinics"
                    item-text="clinic_name"
                    item-value="clinic_id"
                    no-data-text="Brak danych"
                    required disabled
                    ></v-autocomplete>
                  </v-flex>
                   </v-col>
                </v-layout> 

                <v-layout row>
                   <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    Początek dyżuru</label>
                    <v-text-field
                    solo
                    single-line
                    height="60"
                    name="date_start"
                    label="Początek dyżuru"
                    id="date_start"
                    type="datetime-local"
                    v-model="date_start"
                    required>
                    </v-text-field>
                  </v-flex>
                   </v-col>

                </v-layout>

                <v-layout row>
                   <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    Koniec dyżuru</label>
                    <v-text-field
                    solo
                    single-line
                    height="60"
                    name="date_end"
                    label="Koniec dyżuru"
                    id="date_end"
                    type="datetime-local"
                    v-model="date_end"
                    required>
                    </v-text-field>
                  </v-flex>
                   </v-col>
                </v-layout>
 
  
                <v-layout row xs12>
                  <v-flex xs6 pa-1>
                    <v-btn x-large block text color="white"  type="submit">Zatwierdź</v-btn>
                  </v-flex>
                  <v-flex xs6 pa-1>
                    <v-btn x-large block text color="white" @click="reset">Wyczyść formularz</v-btn>
                  </v-flex>
                </v-layout>


              </v-form>
            </v-container>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog
        v-model="successDialog"
        persistent
        max-width="600"
    >
      <v-card

          max-width="596"
          color="rgb(33, 131, 162, 0.9)">
        <v-card-title class="headline font-weight-bold white--text align-end">Sukces!</v-card-title>
        <v-card-text height="60">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-alert class="headline font-weight-bold">{{message}}</v-alert>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-layout row xs12>
            <v-flex xs6 pa-1>
              <v-btn  x-large text color="white" @click="successDialog=!successDialog">OK</v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog

        v-model="errorDialog"
        persistent
        max-width="600"
    >
      <v-card
          align-center
          max-width="596"

          color="rgb(33, 131, 162, 0.9)">
        <v-card-title class="headline font-weight-bold white--text align-end">Błąd!</v-card-title>
        <v-card-text height="60">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-alert class="headline font-weight-bold">{{message}}</v-alert>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-layout row xs12>
            <v-flex xs6 pa-1>
              <v-btn x-large text color="white" @click="errorDialog=!errorDialog">OK</v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import * as firebase from "firebase";
import "firebase/auth";

//import {db} from "@/main";

    export default {
        methods: {
          async pressed(){

            if((this.date_start && this.date_end) && this.doctorHasShift.doctor_id){
              let startDate = new Date(this.date_start);
              let endDate = new Date(this.date_end);
              if(+startDate<+endDate){
                const db = firebase.firestore();
                const shiftRef = db.collection("shift");
                this.shift.date_start = startDate;
                this.shift.date_end = endDate;
                await shiftRef.add(this.shift).then(async(doc) => {
                  this.doctorHasShift.shift_id = doc;
                  const doctorRef = db.collection("doctor").doc(this.doctorHasShift.doctor_id);
                  this.doctorHasShift.doctor_id = doctorRef;
                  const doctorHasShiftRef = db.collection("doctor_has_shift");
                  doctorHasShiftRef.add(this.doctorHasShift).then(() => {
                    this.message="Dodano dyżur!";
                    this.successDialog=true;
                    this.$refs.form.reset();
                  });
                  
                }).catch((error) => {
                  console.log(error);
                  this.message="Błędne dane!";
                  this.errorDialog=true;
                  this.$refs.form.reset();
                });
              }
              else{
                this.message="Koniec dyżuru nie może być wcześniej niż początek!";
                this.errorDialog=true;
                this.$refs.form.reset();
              }

            }
            else{
              this.message="Uzupełnij wszytskie pola!";
              this.errorDialog=true;
              this.$refs.form.reset();
            }



          },

          async getDoctorData(){
          const db = firebase.firestore();
          const doctorRef = db.collection("doctor");
          const doctors = [];
          doctorRef.get().then((querySnapshot) => {
            querySnapshot.forEach(async(doc) => {
              
              doctors.push({
                id: doc.id,
                degree: doc.data().degree,
                first_name: doc.data().first_name,
                last_name: doc.data().last_name,
                full_name: doc.data().degree+" "+doc.data().first_name+" "+doc.data().last_name,
              });
          })
          }).catch((error) => console.log(error));
          doctors.shift();
          return doctors;
               },

                getClinics(){
                    const db = firebase.firestore();
                    const clinicRef = db.collection("clinic");
                    const clinics = [];
                    clinicRef.get().then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                        clinics.push({
                            clinic_id: doc.id,
                            clinic_name: doc.data().clinic_name,
                        });
                        })
                    }).catch((error) => console.log(error));
                    clinics.shift();
                    return clinics;
                },
          async selectClinic(){
            const db = firebase.firestore();
            const doctor = await db.collection("doctor").doc(this.doctorHasShift.doctor_id).get();
            const clinicRef = doctor.data().clinic_id;
            this.clinic_id = clinicRef.id;
          },
                reset () {
                  this.$refs.form.reset()
                },
        },
       
        async created(){
                this.doctors = await this.getDoctorData();
                this.clinics = await this.getClinics();

            },
         
            data(){
                return{
                  errorDialog: false,
                  successDialog: false,
                  message: "",
                  valid: false,
                  date_start: "",
                  date_end: "",
                  doctorHasShift: {
                    shift_id: "",
                    doctor_id: "",
                  },
                  shift: {
                    date_start: "",
                    date_end: "",
                  },
                  doctors:[{
                    id: "",
                    degree: "",
                    first_name: "",
                    last_name: "",
                    full_name: "",
                  }],
                  clinics: [{
                      clinic_id: "",
                      clinic_name: "",
                  }],
                  clinic_id: "",
                  repeat: ["codziennie", "co tydzień", "co miesiąc"],
                    error: ''
                    
                }
              
            },
        
}
    
</script>
<style >
  .v-label{
    font-size: 1.1em;
  }
  .v-input{
    font-size: 1.1em;
  }
  .v-autocomplete {
    font-size: 1.4em;
  }

</style>