<template>
<v-container>

  <v-row>
<v-col
    cols="12"
    sm="12"
    md="12"
    lg="12"
    xl="12">
   <v-card
    light
    class="mx-auto"
    max-width="800"
    
    color="rgb(0, 0, 0, 0.4)"
    >
    
    <v-card-text class="display-3 font-weight-bold, white--text text-center ">
      <v-flex text-align-center>
      Witaj w panelu administratorskim!
      </v-flex>
    </v-card-text>
    
</v-card>
</v-col>
  </v-row>

  <v-row>
   
   <v-col
    v-for="(item, i) in items"
    :key="i"
    cols="12"
    sm="12"
    md="6"
    lg="4"
    xl="3"
    >
      <v-card
        router :to="item.link"
        :color="item.color"
        class="mx-auto"
        dark
        width="400"
        height="300"
        >
      
      <v-card-title
      class="headline font-weight-light"
      v-text="item.title"
      ></v-card-title>

      <v-card-text
      class="display-1 font-weight-bold
            text-center
            justify-end
            align-end"
      v-text="item.card_text"
      ></v-card-text>

      <v-layout row justify-center align-center>
        <v-icon style="font-size: 150px;">
          {{item.my_ico}}
        </v-icon>
      </v-layout>


    </v-card>
   </v-col>
  </v-row>
</v-container>
</template>


<script>

export default {
  name: 'AdminDashboard',

  computed: {
    user() {
      return this.$store.state.user
    }
  },


     data: () => ({
      items: [
        {
          link: "/admin/registerEmployee",
          color: '#4C5C68',
          title: 'Stwórz konto pracownika',
          card_text: 'Zarejestruj pracownika',
          my_ico: 'mdi-account-plus',
        },
        {
          link: "/admin/registerDoctor",
          color: '#6D6A75',
          title: 'Stwórz konto lekarza',
          card_text: 'Zarejestruj lekarza',
          my_ico: 'mdi-account-plus',
        },
        {
          link: "/admin/addShift",
          color: '#33658A',
          title: 'Stwórz grafik lekarza',
          card_text: 'Dodaj grafik',
          my_ico: 'mdi-calendar-plus',
        },
        {
          link: "/admin/doctorListAdmin",
          color: '#37323E',
          title: 'Edycja kont lekarzy',
          card_text: 'Lista lekarzy',
          my_ico: 'mdi-account-edit',
        },
        {
          link: "/admin/schedule",
          color: '#33658A',
          title: 'Wyświetl grafik lekarzy',
          card_text: 'Pokaż grafik',
          my_ico: 'mdi-calendar',
        },
        {
          link: "/admin/EmployeeList",
          color: '#DE9E36',
          title: 'Edycja kont pracowników',
          card_text: 'Lista pracowników',
          my_ico: 'mdi-account-edit',
        },
        {
          link: "/admin/PatientList",
          color: '#86BBD8',
          title: 'Edycja kont pacjentów',
          card_text: 'Lista pacjentów',
          my_ico: 'mdi-account-edit',
        },
        {
          link: "/admin/addClinic",
          color: '#2F4858',
          title: 'Stwórz nową klinikę w systemie',
          card_text: 'Dodaj klinikę',
          my_ico: 'mdi-hospital-building',
        },
      ],
    }),

};

</script>