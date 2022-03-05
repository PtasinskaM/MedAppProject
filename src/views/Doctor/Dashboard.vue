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
      Witaj w panelu lekarskim!
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
      >
      </v-card-text>

    
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
          link: "/doctor/showSchedule",
          color: '#4F5D75',
          title: 'Sprawdź swój grafik',
          card_text: 'Grafik',
          my_ico: 'mdi-calendar-month',
        },
        {
          link: "/doctor/chooseAppointment",
          color: '#EF8354',
          title: 'Wprowadż informacje o wizycie',
          card_text: 'Wizyta',
          my_ico: 'mdi-file-document-edit-outline',
        },
        {
          link: "/doctor/appointmentHistory",
          color: '#33658A',
          title: 'Sprawdź historię wizyt pacjenta',
          card_text: 'Historia wizyt',
          my_ico: 'mdi-table-eye',
        },
      ],
    }),

};

</script>
