<template>
  <v-data-table
    :headers="headers"
    :items="patients"
    :search="search"
    sort-by="last_name"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Wyszukaj"
        single-line
        hide-details
      ></v-text-field>
       
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >

        </v-dialog>
        <v-dialog v-model="enableConfirm" max-width="500px">
          <v-card>
            <v-card-title class="headline">Czy chcesz aktywować to konto?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-flex xs6 pa-1>
                    <v-btn block text color="#219ebc" @click="closeEnableDialog">Anuluj</v-btn>
                  </v-flex>
                  <v-flex xs6 pa-1>
                    <v-btn block text color="#fb8500" @click="enableAccountConfirm">Tak</v-btn>
                  </v-flex>
            
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="disableConfirm" max-width="500px">
          <v-card>
            <v-card-title class="headline">Czy chcesz wyłączyć to konto?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-flex xs6 pa-1>
                <v-btn block text color="#219ebc" @click="closeDisableDialog">Anuluj</v-btn>
              </v-flex>
              <v-flex xs6 pa-1>
                <v-btn block text color="#fb8500" @click="disableAccountConfirm">Tak</v-btn>
              </v-flex>

              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>

    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon v-if="item.is_active=='aktywne'"
        small
        class="mr-2"
        @click="disableAccount(item)"
      >
        mdi-account-circle
      </v-icon>
      <v-icon v-else
        small
        @click="enableAccount(item)"
      >
        mdi-account-circle-outline
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        block
        text
        color="#fb8500"
        @click="initialize"
      >
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>


<script>
  import firebase from "firebase";
  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      search: '',
      headers: [
        {
          text: 'Nazwisko',
          align: 'start',
          value: 'last_name',
        },
        { text: 'Imię', value: 'first_name' },
        { text: 'PESEL', value: 'pesel' },
        { text: 'Miasto', value: 'address.city' },
        { text: 'Status konta', value: 'is_active' },
        { text: 'Liczba nieobecności', value: 'absents' },
        { text: 'Akcje', sortable: false, value: 'actions' },
      ],
      patients: [
        {
          id: "",
          first_name: "",
          last_name: "",
          pesel: "",
          is_active: false,
          address: {
            city: "",
          },
          absents: -1,
        },
      ],
      editedIndex: -1,
      editedItem: {
        id: "",
      },
      defaultItem: {
        id: "",
      },
      disableConfirm: false,
      enableConfirm: false,
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.initialize()
    },

    methods: {
      async initialize () {
        const db = firebase.firestore();

        const patientRef = db.collection("patient");

        //pobranie listy pracownikow
        patientRef.onSnapshot((querySnapshot) => {
          this.patients = [];
          querySnapshot.forEach(async (doc) => {
            //pobranie referencji do dokumentu kliniki z dokumentu pracownika

            let active = "";
            if(doc.data().is_active) active = "aktywne";
            else active = "nieaktywne";
    
            //dodawanie pracownika, jego kliniki do modelu
            this.patients.push({
              id: doc.id,
              first_name: doc.data().first_name,
              last_name: doc.data().last_name,
              pesel: doc.data().pesel || doc.data().PESEL,
              is_active: active,
              absents: -1,
              address: {
                city: "",
              },




            });
            const currentPatient = this.patients.find(patient => patient.id == doc.id);
            const addressRef = await doc.data().address_id.get();
            currentPatient.address.city = addressRef.data().city;

            let absents = 0;
            const appointmentRef = db.collection("appointment")
                .where("patient_id", "==", doc.ref);
            appointmentRef.get().then((appSnapshot) => {

              appSnapshot.forEach((appDoc) => {
                if(appDoc.data().patient_absent){
                  absents+=1;
                }
              });
              currentPatient.absents = absents;
            });


          })
          //koniec dodawania pojedynczego pacjenta
        });

        //this.patients.shift();
      },

      enableAccount (item) {
        this.editedIndex = this.patients.indexOf(item)
        this.editedItem = Object.assign({}, item)
        //this.$router.push({path: "editPatient", query: { patient_id: this.editedItem.id } });
        //this.dialog = true
        this.enableConfirm=true;
      },
      enableAccountConfirm(){
        const db = firebase.firestore();
        let addMessage = firebase.functions().httpsCallable("enableAccount");
        addMessage(this.editedItem.id)
        .then((result) => {
          console.log(result);
          const patientRef = db.collection('patient').doc(this.editedItem.id);
          let active = true;
          let patientData = null;
          patientRef.get().then((doc) => {
            patientData = doc.data();
            patientData.is_active = active;
            db.collection('patient').doc(doc.id).set(patientData);
          });
          this.enableConfirm=false;
        }).catch((err) => {
          console.log(err);
        });
      },
      disableAccount (item) {
        this.editedIndex = this.patients.indexOf(item)
        this.editedItem = Object.assign({}, item)
        //this.$router.push({path: "editPatient", query: { patient_id: this.editedItem.id } });
        //this.dialog = true
        this.disableConfirm=true;
      },
      disableAccountConfirm(){
        const db = firebase.firestore();
        let addMessage = firebase.functions().httpsCallable("disableAccount");
        addMessage(this.editedItem.id)
            .then((result) => {
              console.log(result);
              const patientRef = db.collection('patient').doc(this.editedItem.id);
              let active = false;
              let patientData = null;
              patientRef.get().then((doc) => {
                patientData = doc.data();
                patientData.is_active = active;
                db.collection('patient').doc(doc.id).set(patientData);
              });
              this.disableConfirm=false;
            }).catch((err) => {
          console.log(err);
        });
      },

      deleteItem (item) {
        this.editedIndex = this.patients.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.patients.splice(this.editedIndex, 1)
        this.closeDelete()
      },

      closeEnableDialog () {
        this.enableConfirm = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      closeDisableDialog () {
        this.disableConfirm = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.patients[this.editedIndex], this.editedItem)
        } else {
          this.patients.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>