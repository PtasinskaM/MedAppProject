<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar
            flat
        >
          <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="setToday"
          >
            Dzisiaj
          </v-btn>
          <v-btn
              fab
              text
              small
              color="grey darken-2"
              @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
              fab
              text
              small
              color="grey darken-2"
              @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu
              bottom
              right
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  outlined
                  color="grey darken-2"
                  v-bind="attrs"
                  v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Dzień</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Tydzień</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Miesiąc</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 dni</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :type="type"
            :interval-height="150"
            :weekdays="weekdays"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
        ></v-calendar>
        <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
        >
          <v-card
              color="grey lighten-4"
              min-width="350px"
              flat
          >
            <v-toolbar
                :color="selectedEvent.color"
                dark
            >
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn
                  text
                  color="secondary"
                  @click="selectedOpen = false"
              >
                Anuluj
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import * as firebase from "firebase";
import "firebase/auth";
export default {
  data: () => ({
    doctorOnShift: -1,
    weekdays: [1,2,3,4,5],
    valid: false,
    error: "",

    focus: '',
    type: 'month',
    typeToLabel: {
      month: 'Miesiąc',
      week: 'Tydzień',
      day: 'Dzień',
      '4day': '4 Dni',
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [{
      name: "Test event",
      details: "Test event",
      start: new Date("2019"),
      end: new Date("2019"),
      color: 'red',
    }],
    message: "",
    editedIndex: -1,
    editedItem: {
      id: "",
    },
    defaultItem: {
      id: "",
    },
  }),
  mounted () {
    this.$refs.calendar.checkChange();
  },
  async created() {
    this.doctorOnShift = this.$store.state.currentUser.uid;
    this.getAppointments();
  },
  methods: {
    viewDay ({ date }) {
      this.focus = date
      this.type = 'day'
    },
    getEventColor (event) {
      return event.color
    },
    setToday () {
      this.focus = ''
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => {
          this.selectedOpen = true
        }, 10)
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },

    async getAppointments(){

      let events = [];
      const db = firebase.firestore();
      const doctorRef = db.collection("doctor").doc(this.doctorOnShift);
      doctorRef.get().then((doc) => {
        //const clinicId = doc.data().clinic_id.id;
        //const clinicRef = db.collection("clinic").doc(clinicId);
        const doctorShiftRef = db.collection("doctor_has_shift").where("doctor_id", "==", doc.ref);
        doctorShiftRef.onSnapshot((doctorShiftSnapshot) => {
              doctorShiftSnapshot.forEach((doctorShiftDoc) => {
                const shiftRef = db.collection("shift").doc(doctorShiftDoc.data().shift_id.id);
                shiftRef.get().then(async(shiftDoc) => {
                  let diff=15;
                  //wolne terminy wstawiamy tylko od obecnej daty
                  //poprzednie dyżury oznaczamy kolorem żółtym
                  let shiftColor = '';
                  let shiftDetails = "";
                  let currentDay = new Date();
                  currentDay.setHours(0);
                  currentDay.setMinutes(0);
                  if(+shiftDoc.data().date_start.toDate()>+currentDay) {
                    shiftColor = 'green';
                    shiftDetails = "Wolny termin";
                  }
                  else {
                    shiftColor = 'blue';
                    shiftDetails = "Niewykorzystany termin";
                  }
                    for (let i = new Date(shiftDoc.data().date_start.toDate());
                         i < shiftDoc.data().date_end.toDate(); i = new Date(i.getTime() + diff * 60000)) {
                      let startDate = i;
                      let endDate = new Date(startDate.getTime() + diff * 60000);
                      events.push({
                        name: doc.data().degree + " " + doc.data().first_name + " " + doc.data().last_name,
                        start: firebase.firestore.Timestamp.fromDate(startDate).toDate(),
                        end: firebase.firestore.Timestamp.fromDate(endDate).toDate(),
                        details: shiftDetails,
                        doctorRef: doctorShiftDoc.data().doctor_id,
                        clinicRef: doc.data().clinic_id,
                        color: shiftColor,
                        timed: true,
                      });

                    }


                  const appointmentRef = db.collection("appointment").where("doctor_id", "==", doc.ref)
                      .orderBy("appointment_start");
                  appointmentRef.get().then((appointmentSnapshot) => {
                    appointmentSnapshot.forEach((appDoc) => {
                      const condition = (time, doctorId) => {
                        if((+time === +appDoc.data().appointment_start.toDate()) && (doctorId === doctorShiftDoc.data().doctor_id.id)){
                          return true;
                        }
                        else return false;
                      }

                      let appointmentExists = events.includes(element => {
                        return condition(element.start.getTime(), element.doctorRef.id);
                      });
                      if(!appointmentExists){
                        //usuwanie wolnego terminu, jeśli w bazie jest umówiona wizyta

                        const existingEvent = events.find(element => {
                          if((+element.start.getTime()=== +appDoc.data().appointment_start.toDate())
                              && (element.doctorRef.id === doctorShiftDoc.data().doctor_id.id)){
                            return element;
                          }
                        });
                        let index = events.indexOf(existingEvent);
                        //events.splice(index,1);
                        //określenie statusu umówionej wizyty
                        let statusColor = "";
                        let details = "";
                        //wizyta ukończona - pacjent obecny
                        if((appDoc.data().completed) && !(appDoc.data().patient_absent)) {
                          statusColor = "cyan";
                          details = "Wizyta zakończona, pacjent - ";
                        }
                        //wizyta zaplanowana
                        else if(!(appDoc.data().completed) && (appDoc.data().booked) && !(appDoc.data().doctor_absent)) {
                          details = "Wizyta zaplanowana, pacjent - ";
                          statusColor = "orange";
                        }
                        //wizyta ukończona - pacjent nieobecny
                        else if((appDoc.data().completed) && (appDoc.data().patient_absent)) {
                          details = "Pacjent nieobecny - ";
                          statusColor = "red";
                        }
                        //dyżur lekarza został usunięty - doctor_absent=true, todo: powiadomienie
                        else if(appDoc.data().doctor_absent) {
                          statusColor = "purple";
                          details = "Lekarz nieobecny, pacjent: ";
                        }
                        //pozostałe przypadki
                        else {
                          details = "Wizyta, pacjent: ";
                          statusColor="red";
                        }
                        if(index >=0){
                          existingEvent.id = appDoc.id;
                          existingEvent.name = doc.data().degree+" "+doc.data().first_name+" "+doc.data().last_name;
                          existingEvent.start = appDoc.data().appointment_start.toDate();
                          existingEvent.end = appDoc.data().appointment_stop.toDate();
                          existingEvent.details = "Umówiona wizyta";
                          existingEvent.doctorRef = appDoc.data().doctor_id;
                          existingEvent.patientRef = appDoc.data().patient_id;
                          existingEvent.clinicRef = appDoc.data().clinic_id;
                          existingEvent.color = statusColor;
                          existingEvent.timed = true;
                          const patientRef = db.collection("patient").doc(existingEvent.patientRef.id);
                          patientRef.get().then((patientDoc) => {
                            existingEvent.details = details+patientDoc.data().first_name+" "+patientDoc.data().last_name;
                          });
                        }
                        //wstawianie wizyt poza dyżurem
                        else{
                          let patientDetails="Umówiona wizyta";
                          const patientRef = db.collection("patient").doc(appDoc.data().patient_id.id);
                          patientRef.get().then((patientDoc) => {
                            details = "Wizyta poza dyżurem, pacjent: ";
                            patientDetails = details+patientDoc.data().first_name+" "+patientDoc.data().last_name;
                          })
                          events.push({
                            id: appDoc.id,
                            name: doc.data().degree+" "+doc.data().first_name+" "+doc.data().last_name,
                            start: appDoc.data().appointment_start.toDate(),
                            end: appDoc.data().appointment_stop.toDate(),
                            details: patientDetails,
                            doctorRef: appDoc.data().doctor_id,
                            patientRef: appDoc.data().patient_id,
                            clinicRef: appDoc.data().clinic_id,
                            color: statusColor,
                            timed: true,
                          });
                        }
                      }

                    });
                  });


                });
              });
        });
        events.shift();
        this.events = events;
      }).catch((error) => console.log(error));

    },
    goToAddAppointment(event){
      this.$router.push({name: "employeeAddAppointment", params: { data: event }});
    },
    deleteAppointment (event) {
      this.editedIndex = this.events.indexOf(event)
      this.editedItem = Object.assign({}, event)
      this.dialogDelete = true
    },

    async deleteAppointmentConfirm () {
      this.events.splice(this.editedIndex, 1);

      const db = firebase.firestore();
      db.collection('appointment').doc(this.editedItem.id).delete()
          .then((result) => {
            console.log("Deleted appointment!");
            console.log(result);
            this.deleteSuccessDialog = true;
            this.getClinicAppointments();
          }).catch((error) => {
        console.log("Deleting error: ");
        console.log(error);
        this.deleteFailDialog = true;
      });
      console.log("Deleted appointment id: "+this.editedItem.id);

      this.closeDelete();
    },
    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
  },
}
</script>