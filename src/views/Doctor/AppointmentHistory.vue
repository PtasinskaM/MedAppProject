<template>
  <v-container>
    <v-layout row class="justify-center">
      <v-flex cols="12" xs12 sm12 md12 lg12  >
        <v-card
            color="rgb(33, 131, 162, 0.9)"
            width="800"
            class="mx-auto"
            elevation="2"
            shaped
            tile>

          <v-card-text class="display-1 font-weight-bold, white--text align-end">
            Historia wizyt
          </v-card-text>

          <v-container>
            <v-layout row>
              <v-col>
                <v-flex xs12 sm12 lg12>
                  <label class="headline font-weight-bold, white--text align-end">
                    Pacjent</label>
                  <v-autocomplete
                      solo
                      single-line
                      height="60"
                      name="patient_id"
                      label="Pacjent"
                      v-model="patient_id"
                      :items="patients"
                      :item-text="item => item.first_name +' '+ item.last_name+' - '+item.pesel"
                      item-value="id"
                      no-data-text="Brak danych"
                      @change="getAppointments"
                  ></v-autocomplete>
                </v-flex>
              </v-col>
            </v-layout>
          <v-flex>

        <v-container>
          <v-layout row class="justify-center">
          <v-row>
            <v-col 
            v-for="appointment in appointments" 
            :key="appointment.id" 
           >
            <v-flex xs12 sm12 md12 lg12  >
            <v-card
              v-if="patient_id"
              color="#4c5c68"
              width="700"
              class="mx-auto"
              elevation="2"
              shaped
              tile>
            <v-container>
              <v-layout row>
                <v-col>
                  <v-flex xs12 sm12 md12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                      Lekarz</label>
                    <v-text-field
                        solo
                        single-line
                        height="60"
                        v-model="appointment.doctor"
                        type="text"
                        disabled
                        ></v-text-field>
                  </v-flex>
                </v-col>
              </v-layout>

              <v-layout row>
                <v-col>
                  <v-flex xs12 sm12 md12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                      Data</label>
                    <v-text-field
                        solo
                        single-line
                        height="60"
                        type="datetime-local"
                        v-model="appointment.date"
                        disabled>
                    </v-text-field>
                  </v-flex>
                </v-col>
              </v-layout>

               <v-layout row>
                <v-col>
                  <v-flex xs12 sm12 md12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                      Objawy</label>
                    <v-textarea
                        solo
                        height="120"
                        v-model="appointment.symptoms"
                        value="appointment.symptoms"
                        disabled>
                    </v-textarea>
                  </v-flex>
                </v-col>
              </v-layout>

              <v-layout row>
                <v-col>
                  <v-flex xs12 sm12 md12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                      Leczenie</label>
                    <v-textarea
                        solo
                        height="120"
                        v-model="appointment.treatment"
                        value="appointment.treatment"
                        disabled>
                    </v-textarea>
                  </v-flex>
                </v-col>
              </v-layout>

              <v-layout row>
                <v-col>
                  <v-flex xs12 sm12 md12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                      Zalecenia</label>
                    <v-textarea
                        solo
                        height="120"
                        v-model="appointment.patient_note"
                        value="appointment.patient_note"
                        disabled>
                    </v-textarea>
                  </v-flex>
                </v-col>
              </v-layout>
            </v-container>
         

            </v-card>
            </v-flex>
            </v-col>
          </v-row>
          </v-layout>
        </v-container>
          </v-flex>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import * as firebase from "firebase";
import "firebase/auth";

//import {db} from "@/main";

export default {
  name: "AppointmentHistory",
  methods: {

    returnToSchedule(){
      this.$router.push({name: "doctorDashboard"});
    },

    async getPatients(){
      const db = firebase.firestore();
      const patientRef = db.collection("patient").orderBy("last_name");
      const patients = [];
      patientRef.get().then((querySnapshot) => {
        querySnapshot.forEach(async(doc) => {

          patients.push({
            id: doc.id,
            first_name: doc.data().first_name,
            last_name: doc.data().last_name,
            pesel: doc.data().pesel || doc.data().PESEL,
          });
        })
      }).catch((error) => console.log(error));
      //patients.shift();
      return patients;
    },

    reset () {
      this.$refs.form.reset()
    },
    async getAppointments(){
      const db = firebase.firestore();
      const appointments = [];
      const patientRef = db.collection('patient').doc(this.patient_id);
      const appointmentRef = db.collection('appointment').where('patient_id', '==', patientRef)
          .orderBy("appointment_start", "desc");
      appointmentRef.get().then((querySnapshot) => {
        querySnapshot.forEach(async(doc) => {
          const healthcardRef = doc.data().healthcard_id;
          const doctorRef = doc.data().doctor_id;
          let appointment = {};
          let doctor = await doctorRef.get();
          appointment.doctor = doctor.data().degree+" "+doctor.data().first_name+" "+doctor.data().last_name;
          let healthcard;
          if(healthcardRef) {
            healthcard = await healthcardRef.get();
            appointment.treatment = healthcard.data().treatment;
            appointment.symptoms = healthcard.data().symptoms;
            appointment.patient_note = healthcard.data().patient_note;
          }

          let datetime = new Date(doc.data().appointment_start.toDate());

          let start_day = datetime.getDate();
          if(start_day<10) start_day="0"+start_day;
          let start_month = datetime.getMonth()+1;
          if(start_month<10) start_month="0"+start_month;
          let start_year = datetime.getFullYear();
          let start_hour = datetime.getHours();
          if(start_hour<10) start_hour="0"+start_hour;
          let start_minutes = datetime.getMinutes();
          if(start_minutes<10) start_minutes="0"+start_minutes;
          appointment.date = start_year+"-"+start_month+"-"+start_day+"T"+start_hour+":"+start_minutes;



          appointment.id = doc.id;
          appointments.push(appointment);
        });
      });
      this.appointments = appointments;
    },

  },

  async created(){
    this.patients = await this.getPatients();
  },

  data(){
    return{
      healthcard: {
        symptoms: "",
        treatment: "",
        patient_note: "",
      },
      appointments: [],
      patient_id: -1,
      patients:[{
        id: "",
        first_name: "",
        last_name: "",
        pesel: "",
      }],
      doctors:[{
        id: "",
        degree: "",
        first_name: "",
        last_name: "",
        full_name: "",
      }],
      message: "",


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