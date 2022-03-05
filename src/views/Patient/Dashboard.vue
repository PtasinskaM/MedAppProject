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
      Witaj w profilu pacjenta!
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
          link: "/patient/",
          color: '#4F5D75',
          title: 'Sprawdź listę lekarzy',
          card_text: 'Znajdź lekarza',
          my_ico: 'mdi-doctor',

        },
        {
          link: "/patient/",
          color: '#EF8354',
          title: 'Sprawdź historię wizyt',
          card_text: 'Moje wizyty',
          my_ico: 'mdi-view-list-outline',
        },
        {
          link: "/patient/",
          color: '#33658A',
          title: 'Lista ulubionych lekarzy',
          card_text: 'Ulubieni lekarze',
          my_ico: 'mdi-heart-outline',
        },
        {
          link: "/patient/",
          color: '#DE9E36',
          title: 'Wyślij wiadomość lekarzowi',
          card_text: 'Zapytaj lekarza',
          my_ico: 'mdi-forum',
        },
        {
          link: "/patient/",
          color: '#744253',
          title: 'Sprawdź wystawione recepty',
          card_text: 'Recepty',
          my_ico: 'mdi-text-box-outline',
        },
        {
          link: "/patient/",
          color: '#2D3142',
          title: 'Sprawdź przepisane leki',
          card_text: 'Moje leki',
          my_ico: 'mdi-pill',
        },
        {
          link: "/patient/",
          color: '#4C5C68',
          title: 'Edytuj dane konta',
          card_text: 'Ustawienia',
          my_ico: 'mdi-account-cog',
        },
      ],
    }),

};

</script>
