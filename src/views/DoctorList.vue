<template>
  <v-container>
  <v-card class="mx-auto mt-5" max-width="1000" min-height="220" max-height="280"
          v-for="doctorCard in doctorCards"
          :key="doctorCard.id" >
    <v-container fluid >
      <v-row dense >

        <v-col cols="6" lg="2" md="3" sm="6" >
          <v-card flat tile min-height="120px" min-width="120px">
            <v-img style="margin: 10px"
                src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                height="120px" width="120px"
            ></v-img>
          </v-card>
        </v-col>

        <v-col cols="6" lg="4" md="5" sm="6" >
          <v-card tile flat min-height="120px">
            <v-card-text class="headline black--text">
              {{ doctorCard.degree }} {{ doctorCard.first_name }} {{ doctorCard.last_name }}
            </v-card-text>

            <v-card-text class="title">
              {{ doctorCard.specializations }}
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="3" lg="3" md="4">
          <v-card class=" hidden-sm-and-down" text flat min-height="120px" >
            <v-card-text class="title black--text text-center">
              {{ doctorCard.clinic.clinic_name }}
            </v-card-text>

            <v-card-text class="title text-center">
              {{ doctorCard.clinic.address.city }}, {{ doctorCard.clinic.address.street }}
              {{ doctorCard.clinic.address.building_number }}
            </v-card-text>

          </v-card>
        </v-col>

        <v-col cols="3" lg="3">
          <v-card tile flat min-height="120px"
              class="mx-auto mr-3  hidden-md-and-down"
              width="300"
              height="120"
          >
            <v-card-text>
              <v-row
                  align="center"
                  class="mx-0"
              >
                <v-rating
                    :value="4.5"
                    color="amber"
                    dense
                    half-increments
                    readonly
                    size="30"
                ></v-rating>

                <div class="grey--text ml-4">
                  4.5 (413)
                </div>
              </v-row>
            </v-card-text>
            <v-card-text class="subtitle-1 text-center">
              $ • Konsultacja: {{ doctorCard.appointment_price }}zł
            </v-card-text>

          </v-card>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <v-divider class="mx-4"></v-divider>
          <v-card-actions>
              <v-btn text color="deep-purple lighten-2">5:30PM</v-btn>

              <v-btn text color="deep-purple lighten-2">7:30PM</v-btn>

              <v-btn text color="deep-purple lighten-2">8:00PM</v-btn>

              <v-btn text color="deep-purple lighten-2">9:00PM</v-btn>

          </v-card-actions>
        </v-col>
      </v-row>

    </v-container>


  </v-card>
  </v-container>
</template>

<script>
import firebase from "firebase";
    export default {
      data(){
        return {
            doctorCards: [{
              id: "",
              degree: "",
              first_name: "",
              last_name: "",
              appointment_price: "",
              specializations: "",
              clinic: {
                clinic_name: "",
                clinic_phone: "",
                clinic_email: "",
                address: {
                  apartment: "",
                  building_number: "",
                  city: "",
                  postal_code: "",
                  street: "",
                },
              },
            }],
            specializations: [{
              specialization_id: "",
              specialization_name: ""
            }],
            doctorSpecializations: [{
              specialization_id: "",
              doctor_id: ""
            }],
            searchedSpecialization: "",
            searchedCity: "",

        }
      },
      created() {
        //this.$route.query do filtrowania wyników
        //this.$route.params do pobierania ogólnie z API
        this.searchedCity = this.$route.query.city;
        this.searchedSpecialization = this.$route.query.specialization_id;
        console.log("Searched Spec: "+this.searchedSpecialization);
        console.log("Searched city: "+this.searchedCity);
        if(this.searchedCity && this.searchedSpecialization){
          console.log("Po mieście i specjalizacji");
          this.getDoctorData(true, true);

        }
        else if(this.searchedCity && !this.searchedSpecialization){
          console.log("Po mieście");
          this.getDoctorData(true, false);
        }

        else if(!this.searchedCity && this.searchedSpecialization){
          console.log("Po specjalizacji");
          this.getDoctorData(false, true);
        }
        else{
          this.getDoctorData(false, false);
        }



      },
      methods: {
        async getDoctorData(isCitySet, isSpecializationSet){
          const db = firebase.firestore();
          //referencja do kolekcji doctor -> sprawdzanie id lekarza w kolekcji doctor_has_specialization
          const doctorRef = db.collection("doctor");

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

          //pobranie danych z kolekcji doctor_has_specialization
          const doctorSpecializationRef = db.collection("doctor_has_specialization");
            doctorSpecializationRef.get().then((querySnapshot) => {
              querySnapshot.forEach(async(doc) => {
                this.doctorSpecializations.push({
                  specialization_id: doc.data().specialization_id,
                  doctor_id: doc.data().doctor_id,
                })
              });

            }).catch((error) => console.log(error));


          this.doctorSpecializations.shift();


          //pobranie listy lekarzy
          doctorRef.get().then((querySnapshot) => {
            querySnapshot.forEach(async(doc) => {
              //pobranie referencji do dokumentu kliniki z dokumentu lekarza
              const clinicRef = await doc.data().clinic_id.get();
              //analogicznie dla adresu kliniki
              const clinicAddrRef = await clinicRef.data().address_id.get();
              //jeśli podano miasto w wyszukiwaniu, należy filtrować po mieście
              let meetsCityFiltering = false;
              if(isCitySet){
                if(this.searchedCity == clinicAddrRef.data().city){
                  meetsCityFiltering = true;
                }
                else meetsCityFiltering = false;
              }

              let docSpecId = [];
              //dla danego lekarza należy sprawdzić, czy jego id znajduje się w kolekcji
              //doctor_has_specialization, a jeśli tak, dodać id specjalizacji do tablicy

              this.doctorSpecializations.forEach(element => {
                if("doctor/"+doc.id.toString() == element.doctor_id.path.toString())
                  docSpecId.push(element.specialization_id.path);
              });
              //ponadto należy sprawdzić, czy w jego specjalizacjach znajduje się
              //szukana specjalizacja, jeśli została podana
              let meetsSpecFiltering = false;
              if(isSpecializationSet){
                meetsSpecFiltering = docSpecId.includes("specialization/"+this.searchedSpecialization);
                console.log("docSpecId includes searchedSpec: "+docSpecId.includes(this.searchedSpecialization));
              }
              let docSpec = [];
              //dla każdego elementu tablicy docSpecId sprawdzamy, czy jest w nim dana specjalizacja,
              //a jeśli tak, dodajemy jej nazwę do tablicy docSpec, która reprezentuje specjalizacje
              //danego lekarza
              //MAŁO WYDAJNE ROZWIĄZANIE

              docSpecId.forEach( el => {
                this.specializations.forEach(element => {
                  if(el == "specialization/"+element.specialization_id){
                    docSpec.push(element.specialization_name);
                  }
                });
              });
              //połączenie specjalizacji w jeden String
              const doctorSpecializationsStringified = docSpec.join(", ");
              //dodawanie lekarza, jego kliniki i specjalizacji do modelu
              if((isCitySet && isSpecializationSet) && (meetsSpecFiltering && meetsCityFiltering)){
                this.doctorCardPush(doc, clinicRef, clinicAddrRef, doctorSpecializationsStringified);
              }
              else if((isCitySet && !isSpecializationSet) && meetsCityFiltering){
                this.doctorCardPush(doc, clinicRef, clinicAddrRef, doctorSpecializationsStringified);
              }
              else if((!isCitySet && isSpecializationSet) && meetsSpecFiltering){
                this.doctorCardPush(doc, clinicRef, clinicAddrRef, doctorSpecializationsStringified);

              }


            })
            //koniec dodawania pojedynczego lekarza
          }).catch((error) => console.log(error));
          //usunięcie pierwszego elementu (czyli pustego wiersza)
          this.doctorCards.shift();
        },
        doctorCardPush(doctor, clinicRef, clinicAddrRef, specs){
          this.doctorCards.push({
            id: doctor.id,
            degree: doctor.data().degree,
            first_name: doctor.data().first_name,
            last_name: doctor.data().last_name,
            appointment_price: doctor.data().appointment_price,
            specializations: specs,
            clinic: {
              clinic_name: clinicRef.data().clinic_name,
              clinic_phone: clinicRef.data().clinic_phone,
              clinic_email: clinicRef.data().clinic_email,
              address: {
                apartment: clinicAddrRef.data().apartment,
                building_number: clinicAddrRef.data().building_number,
                city: clinicAddrRef.data().city,
                postal_code: clinicAddrRef.data().postal_code,
                street: clinicAddrRef.data().street,
              }
            },
          });
        },
        /*
        async getDoctorData(){
          const db = firebase.firestore();
          //referencja do kolekcji doctor -> sprawdzanie id lekarza w kolekcji doctor_has_specialization
          const doctorRef = db.collection("doctor");

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

          //pobranie danych z kolekcji doctor_has_specialization
          const doctorSpecializationRef = db.collection("doctor_has_specialization");
          doctorSpecializationRef.get().then((querySnapshot) => {
            querySnapshot.forEach(async(doc) => {
              this.doctorSpecializations.push({
                specialization_id: doc.data().specialization_id,
                doctor_id: doc.data().doctor_id,
              })
            });

          }).catch((error) => console.log(error));
          this.doctorSpecializations.shift();


          //pobranie listy lekarzy
          doctorRef.get().then((querySnapshot) => {
            querySnapshot.forEach(async(doc) => {
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

              docSpecId.forEach( el => {
                this.specializations.forEach(element => {
                  if(el == "specialization/"+element.specialization_id){
                    docSpec.push(element.specialization_name);
                  }
                });
              });
              //połączenie specjalizacji w jeden String
              const doctorSpecializationsStringified = docSpec.join(", ");
              //dodawanie lekarza, jego kliniki i specjalizacji do modelu
              this.doctorCards.push({
                id: doc.id,
                degree: doc.data().degree,
                first_name: doc.data().first_name,
                last_name: doc.data().last_name,
                appointment_price: doc.data().appointment_price,
                specializations: doctorSpecializationsStringified,
                clinic: {
                  clinic_name: clinicRef.data().clinic_name,
                  clinic_phone: clinicRef.data().clinic_phone,
                  clinic_email: clinicRef.data().clinic_email,
                  address: {
                    apartment: clinicAddrRef.data().apartment,
                    building_number: clinicAddrRef.data().building_number,
                    city: clinicAddrRef.data().city,
                    postal_code: clinicAddrRef.data().postal_code,
                    street: clinicAddrRef.data().street,
                  }
                },
              });

            })
            //koniec dodawania pojedynczego lekarza
          }).catch((error) => console.log(error));
          //usunięcie pierwszego elementu (czyli pustego wiersza)
          this.doctorCards.shift();
        },
         */
      },

    }
</script>

<style lang="scss" scoped>
/*
.row {
  margin-bottom: 0;
}

 */

</style>