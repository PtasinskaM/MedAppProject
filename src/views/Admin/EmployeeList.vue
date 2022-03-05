<template>
  <v-data-table
    :headers="headers"
    :items="employees"
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
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
              text 
              color="#219ebc"
              :to="{ path: '/admin/registerEmployee'}"
            >
              Dodaj pracownika
            </v-btn>
          </template>

        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Czy chcesz usunąć tego pracownika?</v-card-title>
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
          text: 'Rola',
          align: 'start',
          value: 'role',
        },
        {
          text: 'Nazwisko',
          value: 'last_name',
        },
        { text: 'Imię', value: 'first_name' },
        { text: 'Miasto', value: 'address.city' },
        { text: 'Status konta', value: 'is_active' },
        { text: 'Akcje', sortable: false, value: 'actions' },
      ],
      employees: [
        {
          id: "",
          role: "",
          first_name: "",
          last_name: "",
          is_active: false,
          address: {
            city: "",
          },
        },
      ],
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
      this.initialize()
    },

    methods: {
      async initialize () {
        const db = firebase.firestore();

        const employeeRef = db.collection("employee");

        //pobranie listy pracownikow
        employeeRef.get().then((querySnapshot) => {
          this.employees = [];
          querySnapshot.forEach(async (doc) => {
            //pobranie referencji do dokumentu kliniki z dokumentu pracownika

            let active = "";
            if(doc.data().is_active) active = "aktywne";
            else active = "nieaktywne";
    
            //dodawanie pracownika, jego kliniki do modelu
            this.employees.push({
              id: doc.id,
              role: doc.data().role,
              first_name: doc.data().first_name,
              last_name: doc.data().last_name,
              is_active: active,
              address: {
                city: "",
              },




            });
            const currentEmployee = this.employees.find(employee => employee.id == doc.id);
            const addressRef = await doc.data().address_id.get();
            currentEmployee.address.city = addressRef.data().city;

          })
          //koniec dodawania pojedynczego pracownika
        }).catch((error) => console.log(error));

        //this.employees.shift();
      },

      editItem (item) {
        this.editedIndex = this.employees.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.$router.push({path: "editEmployee", query: { employee_id: this.editedItem.id } });
        //this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.employees.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.employees.splice(this.editedIndex, 1)
        this.closeDelete()
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
          Object.assign(this.employees[this.editedIndex], this.editedItem)
        } else {
          this.employees.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>