<template>
  <v-container>
    <v-layout row class="justify-center">
      <v-flex cols="12" xs12 sm12 md12 lg8  >
        <v-card 
        light
        color="rgb(33, 131, 162, 0.9)"
        class="mx-auto"
        max-width="800"
        elevation="2"
        shaped
        tile>
          <v-card-text class="display-1 font-weight-bold, white--text align-end">
            Dzisiejsze wizyty
          </v-card-text>
       
            <v-row>
              <v-col
               v-for="appoCard in appoCards"
                :key="appoCard.id"
               cols="12"
                sm="12"
                md="12"
                lg="12"
                xl="12">
                <v-card
                  router :to="'Appointment?appointment_id='+appoCard.id"
                  color="#4F5D75"
                  class="mx-auto"
                  dark
                  max-width="300"
                  height="180"                           
                  >
                
                <v-card-title
                class="headline font-weight-light"
                >
                  {{appoCard.first_name}} {{appoCard.last_name}}
                </v-card-title>

                <v-card-text
                class="display-1 font-weight-bold
                      text-center
                      justify-end
                      align-end"
                >
                {{appoCard.appointment_start}}
                </v-card-text>
              </v-card>
            </v-col>
        </v-row>
    
        </v-card>
      
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import firebase from "firebase";
  export default {
    data(){
      return{
       appoCards: [],
      }
    },
    created(){
        this.doctorOnShift = this.$store.state.currentUser.uid;
        this.getAppointments();

    },
    methods: {
       async getAppointments(){
         const db = firebase.firestore();
         const doctorRef = db.collection("doctor").doc(this.doctorOnShift);
         const dayStart = new Date();
         dayStart.setHours(0,0,0,0);
         const dayEnd = new Date();
         dayEnd.setHours(23,59,59,59);
         const appointmentsRef = db.collection("appointment")
         .where("doctor_id", "==", doctorRef)
         .orderBy("appointment_start").startAt(dayStart).endAt(dayEnd);
         appointmentsRef.get().then((querySnapshot) => {
           querySnapshot.forEach(async(doc) => {
             const patient =await db.collection("patient").doc(doc.data().patient_id.id).get();
             let hour = doc.data().appointment_start.toDate().getHours();
             let minutes = doc.data().appointment_start.toDate().getMinutes();
             if(hour<10) hour="0"+doc.data().appointment_start.toDate().getHours();
             if(minutes<10) minutes = "0"+doc.data().appointment_start.toDate().getMinutes();
             this.appoCards.push({
               id: doc.id,
               appointment_start: hour+":"+minutes,
               first_name: patient.data().first_name,
               last_name: patient.data().last_name,
             });
           });
         }).catch((error) => {console.log(error)});
         this.appoCards.shift();
         
       },
       goToAppointment(card){
         this.$router.push({path: "Appointment", query: { appointment_id: card.id }});
       },
    },
  }
</script>
