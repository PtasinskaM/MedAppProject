<template>
  <v-row class="fill-height">
    <v-col>
      <v-dialog v-model="clinicDialog" max-width="500px" persistent>
        <v-card>
          <v-card-title class="headline">Wybierz przychodnię</v-card-title>
          <v-card-text>
            <v-col>

              <v-flex xs12 sm12 lg12>
                <label class="headline font-weight-bold, white--text align-end">
                  Nazwa przychodni</label>
                <v-autocomplete
                    solo
                    single-line
                    height="60"
                    name="clinic_name"
                    label="Nazwa przychodni"
                    v-model="clinic.id"
                    :items="clinics"
                    id="clinic"
                    item-text="clinic_name"
                    item-value="clinic_id"
                    no-data-text="Brak danych"
                    :rules="clinicRules"
                    required>

                </v-autocomplete>
              </v-flex>
              <v-flex xs12 sm12 lg12 v-if="error">
                <v-alert>
                  {{error}}
                </v-alert>
              </v-flex>

            </v-col>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-flex xs6 pa-1>
              <v-btn block text color="#fb8500" @click="getShiftsFromClinic">Zatwierdź</v-btn>
            </v-flex>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-sheet height="64">
        <v-toolbar
            flat
        >
          <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="clinicDialog=!clinicDialog"
          >
            Zmień przychodnię
          </v-btn>
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
            :interval-height="100"
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
              <v-btn icon @click="deleteShift(selectedEvent)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
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
      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title class="headline">Czy chcesz usunąć ten dyżur?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-flex xs6 pa-1>
              <v-btn block text color="#219ebc" @click="closeDelete">Anuluj</v-btn>
            </v-flex>
            <v-flex xs6 pa-1>
              <v-btn block text color="#fb8500" @click="deleteShiftConfirm">Tak</v-btn>
            </v-flex>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="deleteSuccessDialog" max-width="500px">
        <v-card>
          <v-card-title class="headline">Sukces!</v-card-title>
          <v-card-text>Pomyślnie usunięto dyżur!</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-flex xs6 pa-1>
              <v-btn block text color="#fb8500" @click="deleteSuccessDialog=!deleteSuccessDialog">Ok</v-btn>
            </v-flex>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="deleteFailDialog" max-width="500px">
        <v-card>
          <v-card-title class="headline">Błąd!</v-card-title>
          <v-card-text>Wystąpił błąd podczas usuwania dyżuru!</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-flex xs6 pa-1>
              <v-btn block text color="#fb8500" @click="deleteFailDialog=!deleteFailDialog">Ok</v-btn>
            </v-flex>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import * as firebase from "firebase";
import "firebase/auth";
export default {
  data: () => ({
    weekdays: [1,2,3,4,5],
    error: "",
    clinicDialog: false,
    clinicRules: [
      v => !!v || 'Podaj przychodnię!',
    ],
    clinics: [],
    clinic: {
      id: -1,
      name: "",
    },
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
    colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    dialogDelete: false,
    deleteSuccessDialog: false,
    deleteFailDialog: false,
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
    this.clinics = this.getClinics();
    this.clinicDialog = true;
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
    getClinics(){
      const db = firebase.firestore();
      const clinicRef = db.collection("clinic").orderBy("clinic_name");
      const clinics = [];
      clinicRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          clinics.push({
            clinic_id: doc.id,
            clinic_name: doc.data().clinic_name,
          });
        })
      }).catch((error) => console.log(error));
      //clinics.shift();
      return clinics;
    },

    async getShiftsFromClinic(){
      if(this.clinic.id<0) {
        this.error = "Musisz podać przychodnię!";
        return
      }
      this.error="";

      let events = [];
      const db = firebase.firestore();
      const clinicRef = db.collection("clinic").doc(this.clinic.id);
      const doctorRef = db.collection("doctor").where("clinic_id", "==",clinicRef);
      doctorRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let doctorColor = this.colors[this.rnd(0, this.colors.length -1)];
            const doctorShiftRef = db.collection("doctor_has_shift").where("doctor_id", "==", doc.ref);
            doctorShiftRef.onSnapshot((doctorShiftSnapshot) => {
              doctorShiftSnapshot.forEach((doctorShiftDoc) => {

                console.log("doctor name: "+doc.data().degree+" "+doc.data().first_name+" "+doc.data().last_name);
                const shiftRef = db.collection("shift").doc(doctorShiftDoc.data().shift_id.id);
                shiftRef.get().then(async(shiftDoc) => {

                      events.push({
                        doctorShiftId: doctorShiftDoc.id,
                        shiftId: shiftDoc.id,
                        name: doc.data().degree+" "+doc.data().first_name+" "+doc.data().last_name,
                        start: shiftDoc.data().date_start.toDate(),
                        end: shiftDoc.data().date_end.toDate(),
                        details: "Grafik",
                        doctorRef: doctorShiftDoc.data().doctor_id,
                        color: doctorColor,
                        timed: true,
                      });

                }).catch((error) => console.log(error));


              });
            });


        });
        events.shift();
        this.events = events;
      }).catch((error) => console.log(error));

      this.clinicDialog = false;
    },
    deleteShift (event) {
      this.editedIndex = this.events.indexOf(event)
      this.editedItem = Object.assign({}, event)
      this.dialogDelete = true
    },

    async deleteShiftConfirm () {
      this.events.splice(this.editedIndex, 1);
      /*
      czynności do wykonania:
      1. usunięcie dokumentu z doctor_has_shift
      2. usunięcie dokumentu shift
      3. oznaczenie wszystkich wizyt z danego dyżuru jako doctor_absent=true
       */
      const db = firebase.firestore();
      console.log("Usuwany dyżur: ");
      console.log(this.editedItem.doctorShiftId);
      console.log(this.editedItem.shiftId);
      console.log(this.editedItem.doctorRef.id);

      let doctorHasShiftId = this.editedItem.doctorShiftId;
      let shiftId = this.editedItem.shiftId;
      let start = firebase.firestore.Timestamp.fromDate(this.editedItem.start);
      let end = firebase.firestore.Timestamp.fromDate(this.editedItem.end);
      let doctorRef = this.editedItem.doctorRef;

      db.collection('doctor_has_shift').doc(doctorHasShiftId).delete()
          .then((doctorHasShiftDoc) => {
            console.log("Usunięty dokument doctor_has_shift: ");
            console.log(doctorHasShiftDoc);
            const shiftRef = db.collection("shift").doc(shiftId);
            shiftRef.get().then((doc) => {
              console.log("Dokument shift: "+doc.id);
              const appointmentRef = db.collection("appointment")
                  .where("doctor_id", "==", doctorRef)
                  .where("appointment_start", ">=", start)
                  .where("appointment_start", "<=", end)
                  .orderBy("appointment_start");
              appointmentRef.get().then((appointmentSnapshot) => {
                console.log("Appointment number: "+appointmentSnapshot.size);

                appointmentSnapshot.forEach((appDoc) => {
                    const appData = appDoc.data();
                    appData.doctor_absent = true;
                    db.collection("appointment").doc(appDoc.id).set(appData)
                        .then(() => {console.log("Edytowano wizytę")});

                });
              });
              console.log("Dokument shift prze usuwaniem: "+doc.id);
              doc.ref.delete().then((shiftResult) => {
                console.log("Deleted shift document!");
                console.log(shiftResult);
              }).catch((shiftError) =>{
                console.log("Deleting shift error: ");
                console.log(shiftError);
              });
              this.deleteSuccessDialog = true;
              this.getShiftsFromClinic();
            });
          }).catch((error) => {
            console.log("Deleting doctor_has_shift error: ");
            console.log(error);
            this.deleteFailDialog = true;

      });






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