<template>
  <v-data-table
    :headers="headers"
    :items="doctors"
    :search="search"
    locale="pl"
    must-sort
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
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
              :to="{ path: '/admin/registerDoctor'}"
            >
              Dodaj lekarza
            </v-btn>
          </template>

        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Czy chcesz usunąć tego lekarza?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-flex xs6 pa-1>
                    <v-btn block text color="#219ebc" @click="closeDelete">Anuluj</v-btn>
                  </v-flex>
                  <v-flex xs6 pa-1>
                    <v-btn block text color="#fb8500" @click="deleteItemConfirm">Tak</v-btn>
                  </v-flex>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>

    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
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
          text: 'Stopień',
          align: 'start',
          value: 'degree',
        },
        {
          text: 'Nazwisko',
          value: 'last_name',
        },
        { text: 'Imię', value: 'first_name' },
        { text: 'Specjalizacje', sortable: false, value: 'specializations' },
        { text: 'Nazwa kliniki', value: 'clinic.clinic_name' },
        { text: 'Miasto', value: 'clinic.address.city' },
        { text: 'Status konta', value: 'is_active' },
        { text: 'Akcje', sortable: false, value: 'actions' },
      ],
      doctors: [
        {
          id: "",
          degree: "",
          first_name: "",
          last_name: "",
          specializations: "",
          is_active: false,
          clinic: {
            clinic_name: "",
            address: {
              city: "",
            },
          },
        },
      ],
      specializations: [{
        specialization_id: "",
        specialization_name: ""
      }],
      doctorSpecializations: [{
        specialization_id: "",
        doctor_id: ""
      }],
      editedIndex: -1,
      editedItem: {
        id: "",
      },
      defaultItem: {
        id: "",
      },
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
      this.initialize();
    },

    methods: {
      async initialize () {
        const db = firebase.firestore();


        //pobranie wszystkich specjalizacji i zapisanie do tablicy
        const specializationRef = db.collection("specialization");
        specializationRef.get().then((querySnapshot) => {
          this.specializations = [];
          querySnapshot.forEach(async(doc) => {
            this.specializations.push({
              specialization_id: doc.id,
              specialization_name: doc.data().specialization_name,
            });
          })
        }).catch((error) => console.log(error));
        this.specializations.shift();

        //referencja do kolekcji doctor -> sprawdzanie id lekarza w kolekcji doctor_has_specialization
        const doctorRef = db.collection("doctor");

        //pobranie listy lekarzy
        let doctorSpecStringify;
        doctorRef.onSnapshot((querySnapshot) => {
          this.doctors = [];
          querySnapshot.forEach(async (doc) => {
            let active = "";
            if(doc.data().is_active) active = "aktywne";
            else active = "nieaktywne";

            this.doctors.push({
              id: doc.id,
              degree: doc.data().degree,
              first_name: doc.data().first_name,
              last_name: doc.data().last_name,
              specializations: "",
              is_active: active,
              clinic: {
                clinic_name: "",
                address: {
                  city: "",
                }
              }
            });
            const currentDoctor = this.doctors.find(doctor => doctor.id == doc.id);
            const doctorSpecRef = db.collection("doctor_has_specialization")
                .where("doctor_id", "==", doc.ref);

            doctorSpecRef.onSnapshot((snapshot) => {
              let docSpec = [];
              doctorSpecStringify = "";
              snapshot.forEach(async (doctorSpecDoc) => {
                const specRef = db.collection("specialization")
                .doc(doctorSpecDoc.data().specialization_id.id);
                const specDoc = await specRef.get();
                const specName = specDoc.data().specialization_name;
                docSpec.push(specName);
                doctorSpecStringify = docSpec.join(", ");
                currentDoctor.specializations = doctorSpecStringify;

              });


            });

            //pobranie referencji do dokumentu kliniki z dokumentu lekarza
            const clinicRef = await doc.data().clinic_id.get();
            //analogicznie dla adresu kliniki
            const clinicAddrRef = await clinicRef.data().address_id.get();

            //doctorSpecStringify = docSpec.join(", ");
            //dodawanie lekarza, jego kliniki i specjalizacji do modelu


            currentDoctor.clinic.clinic_name = clinicRef.data().clinic_name;
            currentDoctor.clinic.address.city = clinicAddrRef.data().city;

          })
          //koniec dodawania pojedynczego lekarza
        });//.catch((error) => console.log(error));

        this.doctors.shift();
      },

      editItem (item) {
        this.editedIndex = this.doctors.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.$router.push({path: "editDoctor", query: { doctor_id: this.editedItem.id } });
        //this.dialog = true
      },
      deleteItem (item) {
        this.editedIndex = this.doctors.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.doctors.splice(this.editedIndex, 1);

        const addMessage = firebase.functions().httpsCallable("deleteDoctor");
        console.log("Deleted doctor id: "+this.editedItem.id);
        addMessage(this.editedItem.id)
            .then(function(result) {
              console.log("Deleted doctor!");
              console.log(result);
            })
            .catch(function(error) {
              console.log("Deleting error: ");
              console.log(error);
            });

        this.closeDelete();
      },

      close () {
        this.dialog = false
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
          Object.assign(this.doctors[this.editedIndex], this.editedItem)
        } else {
          this.doctors.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>