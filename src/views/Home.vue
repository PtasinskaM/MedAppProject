  <template>
  <v-container grid-list-md>
  <v-card 
    light
    class="mx-auto"
    max-width="800"
    elevation="2"
    color="rgb(33, 131, 162, 0.8)"
    shaped
    tile>

  <v-card-text class="headline font-weight-bold, white--text align-end">
      Znajdź lekarza jakiego potrzebujesz i umów się na wizytę
  </v-card-text>

  <v-form
      @submit.prevent="searchDoctors"
      >
    <v-container>
      <v-layout  wrap>       

        <v-flex xs12 sm12 lg12 >       
          <v-autocomplete 
            v-model="city.name"
            :items="cities"
            item-text="name"
            item-value="name"
            height="60"
            placeholder="Miasto"
            single-line
            solo>
          </v-autocomplete>
        </v-flex>

        <v-flex xs12 sm12 lg12>
          <v-autocomplete 
            v-model="specialization.specialization_id"
            :items="specializations"
            item-text="specialization_name"
            item-value="specialization_id"
            height="60"
            placeholder="Specjalizacja"
            single-line
            solo>
          </v-autocomplete>
        </v-flex>
        <v-flex xs12 sm12 lg12 v-if="error">
          <v-alert>
            {{ message }}
          </v-alert>
        </v-flex>

      </v-layout>
  
       <v-card-actions class="justify-center">      
            <v-btn type="submit" width="150" elevation="10" x-large>Szukaj</v-btn>
       </v-card-actions>
    </v-container>

  </v-form>
  </v-card>


  </v-container>
</template>

<script>
import * as firebase from "firebase";
import "firebase/auth";

export default {
  name: 'Home',
  methods: {
    getSpecializations(){
      const db = firebase.firestore();
      const specializationRef = db.collection("specialization");
      const specializations = [];
      specializationRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          specializations.push({
            specialization_id: doc.id,
            specialization_name: doc.data().specialization_name,
          });
        })
      }).catch((error) => console.log(error));
      specializations.shift();
      return specializations;

    }, 
    getClinicAddress(){
      const db = firebase.firestore();
      const clinicRef = db.collection("clinic");
      const clinics = [];
      clinicRef.get().then((querySnapshot) => {
        querySnapshot.forEach(async(doc) => {
          clinics.push({
            id: doc.id,
            address: {
              ref: doc.data().address_id.path
            },
          });
          //znajdź adres ostatnio dodanej kliniki
          const addressRef = clinics[clinics.length-1].address.ref;
          const address = await db.doc(addressRef).get();
          this.cities.push({name: address.data().city});
          console.log("addressRefCity: "+this.cities[this.cities.length-1].name);

        })
      }).catch((error) => console.log(error));
      this.cities.shift();

      return clinics;

    },
    searchDoctors(){
      if(this.city.name || this.specialization.specialization_id){
        this.error=false;
        if(this.city.name && this.specialization.specialization_id)
          this.$router.push("/doctorList?city="+this.city.name+"&specialization_id="+this.specialization.specialization_id);
        else if(this.city.name && !this.specialization.specialization_id)
          this.$router.push("/doctorList?city="+this.city.name);
        else if(!this.city.name && this.specialization.specialization_id)
          this.$router.push("/doctorList?specialization_id="+this.specialization.specialization_id);
      }
      else{
        this.message="Podaj parametr wyszukiwania";
        this.error=true;
      }
    },
  },
  async created(){
      console.log("created");
      this.specializations = await this.getSpecializations();
      this.clinics = await this.getClinicAddress();
      console.log("Clinics: "+this.clinics);
      this.cities.sort();

      /*
      const addressRef = await db.collection("address")
          .doc(clinics.indexOf(clinics.length-1).address.id).get();
          clinics.indexOf(clinics.length-1).address.city = addressRef.data().city;
      */
    },
  data(){
    return{
      error: false,
      message: "",
      specialization: {
        specialization_id: "",
      },
      city: {
        name: "",
      },
      
      specializations: [{
        specialization_id: "",
        specialization_name: "",
      }],
      clinics: [{
        id: "",
        address: {
          ref: "",
          city: "",
        },
      }],
      cities: [{
        name: ""
      }],
      
    }
  }
}
</script>


<style lang="scss">
  .v-text-field input {
    font-size: 1.6em;
  }
  
</style>
