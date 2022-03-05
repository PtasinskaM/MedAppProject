<template>
  <v-footer
    dark
    padless
    
  >
    <v-card
    width="100%"
      flat
      tile
      class=" white--text text-center"
      color="#023047"
      
    >
      <v-card-text>
        
      </v-card-text>

      <v-card-text class="white--text pt-0">
        Centrum medyczne
      </v-card-text>

      <v-divider></v-divider>

      <v-card-text class="white--text">
        {{ new Date().getFullYear() }}
      </v-card-text>
    </v-card>
  </v-footer>
</template>