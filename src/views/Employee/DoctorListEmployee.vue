<template>
  <v-data-table
    :headers="headers"
    :items="doctors"
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
        
      </v-toolbar>

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
        //{ text: 'Akcje', sortable: false, value: 'actions' },
      ],
      doctors: [
        {
          id: "",
          degree: "",
          first_name: "",
          last_name: "",
          specializations: "",
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


    created () {
      this.initialize()
    },

    methods: {
      async initialize () {
        const db = firebase.firestore();


        //pobranie wszystkich specjalizacji i zapisanie do tablicy
        const specializationRef = db.collection("specialization");
        specializationRef.get().then((querySnapshot) => {
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

        //pobranie danych z kolekcji doctor_has_specialization
        const doctorSpecRef = db.collection("doctor_has_specialization");
        doctorSpecRef.get().then((querySnapshot) => {
          querySnapshot.forEach(async (doc) => {
            this.doctorSpecializations.push({
              specialization_id: doc.data().specialization_id,
              doctor_id: doc.data().doctor_id,
            })
          })
        }).catch((error) => console.log(error));
        this.doctorSpecializations.shift();

        //pobranie listy lekarzy
        doctorRef.get().then((querySnapshot) => {
          querySnapshot.forEach(async (doc) => {
            //pobranie referencji do dokumentu kliniki z dokumentu lekarza
            const clinicRef = await doc.data().clinic_id.get();
            //analogicznie dla adresu kliniki
            const clinicAddrRef = await clinicRef.data().address_id.get();

            let docSpecId = [];
            //dla danego lekarza należy sprawdzić, czy jego id znajduje się w kolekcji
            //doctor_has_specialization, a jeśli tak, dodać id specjalizacji do tablicy
            this.doctorSpecializations.forEach(element => {
              if("doctor/"+doc.id.toString() == element.doctor_id.path.toString())
                docSpecId.push(element.specialization_id.path);
            });

            let docSpec = [];
            //dla każdego elementu tablicy docSpecId sprawdzamy, czy jest w nim dana specjalizacja,
            //a jeśli tak, dodajemy jej nazwę do tablicy docSpec, która reprezentuje specjalizacje
            //danego lekarza
            //MAŁO WYDAJNE ROZWIĄZANIE
            docSpecId.forEach(el => {
              this.specializations.forEach(element => {
                if(el == "specialization/"+element.specialization_id)
                  docSpec.push(element.specialization_name);
              });
            });

            //połączenie specjalizacji w jeden String
            const doctorSpecStringified = docSpec.join(", ");

            //dodawanie lekarza, jego kliniki i specjalizacji do modelu
            this.doctors.push({
              id: doc.id,
              degree: doc.data().degree,
              first_name: doc.data().first_name,
              last_name: doc.data().last_name,
              specializations: doctorSpecStringified,
              clinic: {
                clinic_name: clinicRef.data().clinic_name,
                address: {
                  city: clinicAddrRef.data().city,
                },
              },

            });

          })
          //koniec dodawania pojedynczego lekarza
        }).catch((error) => console.log(error));

        this.doctors.shift();
      },

    },
  }
</script>