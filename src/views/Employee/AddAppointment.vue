<template>
  <v-container>
    <v-layout row class="justify-center">
      <v-flex cols="12" xs12 sm12 md12 lg8  >
        <v-card
            color="rgb(33, 131, 162, 0.9)"
            width="800"
            class="mx-auto"
            elevation="2"
            shaped
            tile>

          <v-card-text class="display-1 font-weight-bold, white--text align-end">
            Dodaj wizytę
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
                        v-model="appointment.doctor_id"
                        :items="doctors"
                        :item-text="item => item.degree +' '+ item.first_name+' '+item.last_name"
                        item-value="id"
                        no-data-text="Brak danych"
                        required
                        disabled
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
                        v-model="appointment.clinic_id"
                        :items="clinics"
                        item-text="clinic_name"
                        item-value="clinic_id"
                        no-data-text="Brak danych"
                        required
                        disabled
                    ></v-autocomplete>
                  </v-flex>
                </v-col>
              </v-layout>

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
                        v-model="appointment.patient_id"
                        :items="patients"
                        :item-text="item => item.first_name +' '+ item.last_name+' - '+item.pesel"
                        item-value="id"
                        no-data-text="Brak danych"
                        required
                    ></v-autocomplete>
                  </v-flex>
                </v-col>
              </v-layout>


              <v-layout row>
                <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                      Godzina rozpoczęcia</label>
                    <v-text-field
                        solo
                        single-line
                        height="60"
                        name="time_start"
                        label="Godzina rozpoczęcia"
                        id="time_start"
                        type="datetime-local"
                        v-model="appointmentStart"
                        required
                        disabled>
                    </v-text-field>
                  </v-flex>
                </v-col>
              
                <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                      Godzina zakończenia</label>
                    <v-text-field
                        solo
                        single-line
                        height="60"
                        name="time_end"
                        label="Godzina zakończenia"
                        id="time_end"
                        type="datetime-local"
                        v-model="appointmentEnd"
                        required
                        disabled>
                    </v-text-field>
                  </v-flex>
                </v-col>
              </v-layout>

              <v-layout row>
                <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                      Cena wizyty</label>
                    <v-text-field
                        solo
                        single-line
                        height="60"
                        name="price"
                        label="Cena wizyty"
                        id="price"
                        type="number"
                        v-model="appointment.price"
                        disabled>
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
              <v-btn  x-large text color="white" @click="returnToSchedule">OK</v-btn>
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
        <v-card-title class="headline font-weight-bold white--text align-end">Uwaga!</v-card-title>
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
              <v-btn x-large text color="white" @click="returnToSchedule">OK</v-btn>
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
  name: "EmployeeAddAppointment",
  methods: {
    async pressed(){
      if(this.$refs.form.validate()){
        this.appointment.booked=true;

        const db = firebase.firestore();
        const patientRef = db.collection("patient").doc(this.appointment.patient_id);
        this.appointment.patient_id = patientRef;
        //const appointmentRef = db.collection("appointment");
        db.collection("appointment").add(this.appointment)
        .then(response => {
          console.log(response);
          this.error=false;
          this.message="Umówiono wizytę!";
          this.successDialog=true;
        }).catch((err) => {
          console.log(err);
          this.error=true;
          this.message="Termin jest już zajęty!";
          this.errorDialog=true;
        });

      }
      else {
        console.log("Wybierz pacjenta!");
      }
    },
    returnToSchedule(){
      this.successDialog = false;
      this.errorDialog = false;
      this.message = "";
      this.$router.push({name: "employeeSchedule"});
    },

    async getDoctorData(){
      const db = firebase.firestore();
      const doctorRef = db.collection("doctor").orderBy("last_name");
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

    getClinics(){
      const db = firebase.firestore();
      const clinicRef = db.collection("clinic");
      const clinics = [];
      clinicRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          clinics.push({
            clinic_id: doc.ref,
            clinic_name: doc.data().clinic_name,
          });
        })
      }).catch((error) => console.log(error));
      clinics.shift();
      return clinics;
    },
    reset () {
      this.$refs.form.reset()
    },
    async setFormData(){
      this.appointment.appointment_start = this.scheduleData.start;
      this.appointment.appointment_stop = this.scheduleData.end;
      this.appointment.price = 0;
      this.appointment.doctor_id = this.scheduleData.doctorRef;
      this.appointment.clinic_id = this.scheduleData.clinicRef;
      this.appointment.booked = false;
      this.appointment.completed = false;
      this.appointment.rated = false;
      this.appointment.doctor_absent = false;
      this.appointment.patient_absent = false;
      this.appointment.notification_sent = false;
      this.appointment.healthcard_id = null;

      let doctorData = await this.appointment.doctor_id.get();
      this.appointment.price = doctorData.data().appointment_price;

      console.log(this.appointment);
      //date formatting

      let datetimeStart = new Date(this.appointment.appointment_start);
      console.log("datetimeStart: ");
      console.log(datetimeStart);
      let start_day = datetimeStart.getDate();
      if(start_day<10) start_day="0"+start_day;
      let start_month = datetimeStart.getMonth()+1;
      if(start_month<10) start_month="0"+start_month;
      let start_year = datetimeStart.getFullYear();
      let start_hour = datetimeStart.getHours();
      if(start_hour<10) start_hour="0"+start_hour;
      let start_minutes = datetimeStart.getMinutes();
      if(start_minutes<10) start_minutes="0"+start_minutes;
      this.appointmentStart=start_year+"-"+start_month+"-"+start_day+"T"+start_hour+":"+start_minutes;
      console.log("DisplayFormStart: ");
      console.log(this.appointmentStart);


      let datetimeEnd = new Date(this.appointment.appointment_stop);
      console.log("datetimeEnd: ");
      console.log(datetimeEnd);
      let end_day = datetimeEnd.getDate();
      if(end_day<10) end_day="0"+end_day;
      let end_month = datetimeEnd.getMonth()+1;
      if(end_month<10) end_month="0"+end_month;
      let end_year = datetimeEnd.getFullYear();
      let end_hour = datetimeEnd.getHours();
      if(end_hour<10) end_hour="0"+end_hour;
      let end_minutes = datetimeEnd.getMinutes();
      if(end_minutes<10) end_minutes="0"+end_minutes;
      this.appointmentEnd=end_year+"-"+end_month+"-"+end_day+"T"+end_hour+":"+end_minutes;
      console.log("DisplayFormEnd: ");
      console.log(this.appointmentEnd);


    },
  },

  async created(){
    this.scheduleData = this.$route.params.data;
    //this.scheduleData = Object.assign({}, this.$route.params.data)
    this.doctors = await this.getDoctorData();
    this.clinics = await this.getClinics();
    this.patients = await this.getPatients();
    await this.setFormData();

  },

  data(){
    return{
      appointment: {
        appointment_start: "",
        appointment_stop: "",
        price: 0,
        doctor_id: null,
        clinic_id: null,
        patient_id: null,
        booked: false,
        completed: false,
        rated: false,
        doctor_absent: false,
        patient_absent: false,
        notification_sent: false,
        healthcard_id: null,
      },
      appointmentStart: "",
      appointmentEnd: "",
      scheduleData: "",
      shift: {
        clinic_id: "",
        doctor_id: "",
        repeat: "",
      },
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
      clinics: [{
        clinic_id: "",
        clinic_name: "",
      }],
      repeat: ["codziennie", "co tydzień", "co miesiąc"],
      message: "",
      successDialog: false,
      errorDialog: false,

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