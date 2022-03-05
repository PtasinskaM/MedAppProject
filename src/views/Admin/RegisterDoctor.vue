<template>
  <v-container>
    <v-layout row class="justify-center">
      <v-flex cols="12" xs12 sm12 md12 lg8 >
        <v-card 
        light
        color="rgb(33, 131, 162, 0.9)"
        class="mx-auto"
        max-width="1200"
        elevation="2"
        shaped
        tile>
          <v-card-text class="display-1 font-weight-bold, white--text align-end">
            Zarejestruj lekarza
          </v-card-text>
        
            <v-form 
              @submit.prevent="pressed"
              ref="form"
              v-model="valid"
              lazy-validation>
              <v-container>
                <v-layout row>
                  <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    Imię</label>
                    <v-text-field
                    solo
                    single-line
                    height="60"
                    name="first_name"
                    label="Imię"
                    id="first_name"
                    v-model="doctor.first_name"
                    type="text"
                    :rules="firstnameRules"
                    required></v-text-field>
                  </v-flex>
                  </v-col>

                  <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    Nazwisko</label>
                    <v-text-field
                    solo
                    single-line
                    height="60"
                    name="last_name"
                    label="Nazwisko"
                    id="last_name"
                    v-model="doctor.last_name"
                    type="text"
                    :rules="lastnameRules"
                    required></v-text-field>
                  </v-flex>
                  </v-col>
                </v-layout>
                

                <v-layout row>
                  <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    E-mail</label>
                    <v-text-field
                    solo
                    single-line
                    height="60"
                    name="email"
                    label="E-mail"
                    id="email"
                    v-model="doctor.email"
                    type="email"
                    :rules="emailRules"
                    required></v-text-field> 
                  </v-flex>
                  </v-col>

                  <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    Numer telefonu</label>
                    <v-text-field
                    solo
                    single-line
                    height="60"
                    name="mobile"
                    label="Telefon"
                    id="mobile"
                    v-model="doctor.mobile"
                    type="text"
                    required
                    :rules="phoneRules"
                    ></v-text-field>
                  </v-flex>
                  </v-col>
                </v-layout> 


                <v-layout row>
                  <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    PESEL</label>
                    <v-text-field
                    solo
                    single-line
                    height="60"
                    name="pesel"
                    label="PESEL"
                    id="pesel"
                    v-model="doctor.pesel"
                    type="text"
                    :rules="peselRules"
                    required></v-text-field>
                  </v-flex>
                  </v-col>
               
                  <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">Data rozpoczęcia pracy</label>
                    <v-text-field
                    solo
                    single-line
                    height="60"
                    name="date"
                    label="Data rozpoczęcia pracy"
                    id="date"
                    v-model="doctor.employment_start"
                    type="date"
                    :rules="dateRules"
                    required></v-text-field>
                  </v-flex>
                  </v-col>
                </v-layout>

                <v-layout row>
                  <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    Miasto</label>
                    <v-text-field
                    solo
                    single-line
                    height="60"
                    name="city"
                    label="Miasto"
                    id="city"
                    v-model="address.city"
                    type="text"
                    required
                    :rules="cityRules"></v-text-field>
                  </v-flex>
                  </v-col>

                  <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    Ulica</label>
                    <v-text-field
                    solo
                    single-line
                    height="60"
                    name="street"
                    label="Ulica"
                    id="street"
                    v-model="address.street"
                    type="text"
                    :rules="streetRules"
                    required></v-text-field>
                  </v-flex>
                  </v-col>
                </v-layout>

                <v-layout row>
                  <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    Numer budynku</label>
                    <v-text-field
                    solo
                    single-line
                    height="60"
                    name="building_number"
                    label="Numer budynku"
                    id="building_number"
                    v-model="address.building_number"
                    type="text"
                    required
                    :rules="building_numberRules"
                    ></v-text-field>
                  </v-flex>
                  </v-col>
                
                  <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    Numer mieszkania</label>
                    <v-text-field
                    solo
                    single-line
                    height="60"
                    name="apartment"
                    label="Numer mieszkania"
                    id="apartment"
                    v-model="address.apartment"
                    type="text"
                    ></v-text-field>
                  </v-flex>
                  </v-col>
                
                  <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    Kod pocztowy</label>
                    <v-text-field
                    solo
                    single-line
                    height="60"
                    name="postal_code"
                    label="Np. 12-345"
                    id="postal_code"
                    v-model="address.postal_code"
                    type="text"
                    :rules="postalcodeRules"
                    required></v-text-field>
                  </v-flex>
                  </v-col>
                </v-layout>

                  <v-layout row>
                  <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    Stopień naukowy</label>
                    <v-autocomplete
                    solo
                    single-line
                    height="60"
                    name="degree"
                    v-model="doctor.degree"
                    :items="degree"
                    label="Stopień naukowy"
                    required
                    :rules="degreeRules"
                    ></v-autocomplete>
                  </v-flex>
                  </v-col>
                
                  <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    Specjalizacja/cje</label>
                    <v-autocomplete
                    solo
                    single-line
                    height="60"
                    name="specialization_name"
                    v-model="specialization.specialization_id"
                    :items="specializations"
                    item-text="specialization_name"
                    item-value="specialization_id"
                    :rules="specializationRules"
                    label="Specjalizacja"
                    multiple
                    no-data-text="Brak danych"
                    ></v-autocomplete>
                  </v-flex>
                  </v-col>
                </v-layout> 

                <v-layout row>
                  <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    Nazwa przychodni</label>
                    <v-autocomplete
                    solo
                    single-line
                    height="60"
                    name="clinic_name"
                    label="Nazwa przychodni"
                    v-model="clinic.clinic_id"
                    :items="clinics"
                    item-text="clinic_name"
                    item-value="clinic_id"
                    no-data-text="Brak danych"
                    required
                    :rules="clinicRules"></v-autocomplete>
                  </v-flex>
                  </v-col>

                  <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    Cena za wizytę</label>
                    <v-text-field
                    solo
                    single-line
                    height="60"
                    name="appointment_price"
                    label="Cena wizyty"
                    id="appointment_price"
                    v-model="doctor.appointment_price"
                    type="number"
                    min="50" max="500"
                    step="10"
                    required
                    :rules="priceRules"></v-text-field>
                  </v-flex>
                  </v-col>
                </v-layout> 

              <v-layout row>
              <v-col>
              <v-flex xs12 sm12 lg12>
                <label class="headline font-weight-bold, white--text align-end">
                Zdjęcie profilowe</label>
                <v-file-input
                solo
                single-line
                height="60"
                :rules="rules"
                show-size
                name="photo"
                accept="image/png, image/jpeg, image/bmp, image/jpg"
                placeholder="Wybierz zdjęcie profilowe"
                prepend-icon="mdi-camera-outline"
                @change="previewPhoto($event)"
                ></v-file-input>
             
                <v-layout row v-if="image.imageData!=null">
                  <v-flex xs12 sm12 lg12>
                    <v-img  style="margin: 10px"
                           :src="image.img"
                           height="120px" width="120px"
                    ></v-img>
                  </v-flex>
                </v-layout>
               </v-flex>
              </v-col>

                <v-col>
                  <v-flex xs12 sm12 lg12>
                  <label class="headline font-weight-bold, white--text align-end">
                  Informacje o lekarzu</label>
                <v-textarea
                  solo
                  height="60"
                  name="personal_info"
                  label="O lekarzu"
                  id="personal_info"
                  v-model="doctor.personal_info"
                  type="text"
                ></v-textarea>
                </v-flex>
                </v-col>
                </v-layout>

                <v-layout row xs12>
                  <v-flex xs6 pa-1>
                    <v-btn x-large block text color="white"  type="submit">Zarejestruj</v-btn>
                  </v-flex>
                  <v-flex xs6 pa-1>
                    <v-btn x-large block text color="white" @click="reset">Wyczyść formularz</v-btn>
                  </v-flex>
                </v-layout>
            
              </v-container>
              
            </v-form>             
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog
      
                v-model="errorDialog"
                persistent
                max-width="600"
              >
                <v-card 
                align-center
                max-width="596"

                color="rgb(33, 131, 162, 0.9)">
                  <v-card-title class="headline font-weight-bold white--text align-end">Uwaga!</v-card-title>
                  <v-card-text height="60">
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-alert class="headline font-weight-bold">{{message}}</v-alert>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                     <v-layout row xs12>
                      <v-flex xs6 pa-1>
                          <v-btn x-large text color="white" @click="errorDialog=!errorDialog">OK</v-btn>
                      </v-flex>
                     </v-layout>
                  </v-card-actions>
                </v-card>
              </v-dialog>
                
                <v-dialog
                v-model="successDialog"
                persistent
                max-width="600"
              >
                <v-card  
                
                max-width="596" 
                color="rgb(33, 131, 162, 0.9)">
                  <v-card-title class="headline font-weight-bold white--text align-end">Sukces!</v-card-title>
                  <v-card-text height="60">
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-alert class="headline font-weight-bold">{{message}}</v-alert>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-layout row xs12>
                      <v-flex xs6 pa-1>
                          <v-btn  x-large text color="white" @click="successDialog=!successDialog">OK</v-btn>
                      </v-flex>
                    </v-layout>
                  </v-card-actions>
                </v-card>
              </v-dialog>

  </v-container>
</template>

<script>
import * as firebase from "firebase";
import "firebase/auth";

    export default {
        methods: {
          
            async pressed(){
                if(this.$refs.form.validate()){
                  this.doctor.password=this.generatePassword(20);
                  if(this.image.img) this.doctor.photo_url=this.image.img;
                  else this.doctor.photo_url="https://firebasestorage.googleapis.com/v0/b/centrum-medyczne-8367d.appspot.com/o/doctors%2F1606218227891.png?alt=media&token=73b5f128-40c4-4ff2-9179-4145c9daab39";
                  var data = {
                    address: this.address,
                    doctor: this.doctor,
                    specialization: this.specialization,
                    clinic: this.clinic
                    
                  };
                  console.log(JSON.stringify(this.doctor.email));
                  console.log(this.doctor.email.toString());
                  var addMessage = firebase.functions().httpsCallable("createDoctorWithRole");
                  //const data = {this.employee, this.address};
                  
                  addMessage(data)
                    .then((result) => {
                    console.log(result);
                    this.error=false;
                    this.message="Pomyślnie dodano lekarza";
                    this.successDialog=true;
                    this.$refs.form.reset();
                    })
                    .catch((err) => {
                      console.log(err);
                      this.error=true;
                      this.message="Konto o podanym adresie e-mail już istnieje! Podaj inny e-mail.";
                      this.errorDialog=true;
                    });
                  
                  //created=true;
                  //await this.$router.push({name: "adminDashboard"});
                }
            },
            reset () {
              this.$refs.form.reset()
            },
            generatePassword(pLength){
                var keyListAlpha = "abcdefghijklmnoprstuvwxyz",
                    keyListInt="1234567890",
                    keyListSpec="!@#_",
                    password="";
                var len=Math.ceil(pLength/2);
                len=len-1;
                var lenSpec=pLength-2*len;
                var i=0;
                for(i=0;i<len;i++){
                    password+=keyListAlpha.charAt(Math.floor(Math.random()*keyListAlpha.length));
                    password+=keyListInt.charAt(Math.floor(Math.random()*keyListInt.length));   
                }
                for(i=0;i<lenSpec;i++){
                    password+=keyListSpec.charAt(Math.floor(Math.random()*keyListSpec.length));
                }
                password=password.split('').sort(function(){return 0.5-Math.random()}).join('');

                return password;
            },
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
            getClinics(){
              const db = firebase.firestore();
              const clinicRef = db.collection("clinic");
              const clinics = [];
              clinicRef.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  clinics.push({
                    clinic_id: doc.id,
                    clinic_name: doc.data().clinic_name,
                  });
                })
              }).catch((error) => console.log(error));
              clinics.shift();
              return clinics;
            },
            previewPhoto(file){
                //zdjęcie od razu jest wrzucane na serwer i wyświetlany jest podgląd
                if(file){
                  console.log(file);
                  console.log(Date.now());
                  this.image.uploadValue=0;
                  this.image.img = null;
                  this.image.imageData = file;
                  //zmiana nazwy pliku
                  const fileExtension = this.getFileExtension(file.name);
                  const filename = Date.now()+"."+fileExtension;
                  this.uploadPhoto(filename);
                }
                //zniknij podgląd, jeśli nie załadowano zdjęcia
                else this.image.imageData = null;
            },
            getFileExtension(filename){
                return filename.split('.').pop();
            },
            uploadPhoto(filename){
                this.image.img = null;
                const storageRef = firebase.storage().ref("doctors/"+`${filename}`)
                .put(this.image.imageData);
                storageRef.on(`state_changed`, snapshot => {
                  this.image.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
                },
                    error => {console.log("Upload error: "+error.message)},
                    () => {
                      this.image.uploadValue=100;
                      storageRef.snapshot.ref.getDownloadURL().then((url) => {
                        this.image.img = url;
                        console.log("URL: "+this.image.img);
                      });
                    }
                );
            },

        },
            async created(){
                this.specializations = await this.getSpecializations();
                this.clinics = await this.getClinics();

            },
            data(){
                return{
                  error: false,
                  message: "",
                  successDialog: false,
                  errorDialog: false,
                  valid: true,
                  firstnameRules: [
                    v => !!v || 'Uzupełnij imię!',
                    v => /[A-ZĄĆĘŃŁÓŚŻŹ]{1}[a-ząćęńłóśżź]{1,20}/.test(v) || 'Nieprawidłowe imię!',
                  ],
                  lastnameRules: [
                    v => !!v || 'Uzupełnij nazwisko!',
                    v => /[A-ZĄĆĘŃŁÓŚŻŹ][a-ząćęńłóśżź]{1,20}(-[A-ZĄĆĘŃŁÓŚŻŹ][a-ząćęńłóśżź]{1,20})?/.test(v) || 'Nieprawidłowe nazwisko!',
                  ],
                  emailRules: [
                    v => !!v || 'Uzupełnij e-mail!',
                    v => /.+@.+\..+/.test(v) || 'Nieprawidłowy e-mail!',
                  ],
                  dateRules: [
                    v => !!v || 'Uzupełnij datę!',
                  ],
                  streetRules: [
                    v => !!v || 'Wpisz ulicę!',
                  ],
                  cityRules: [
                    v => !!v || 'Wpisz miasto!',
                  ],
                  phoneRules: [
                    v => !!v || 'Uzupełnij numer telefonu!',
                    v => /^\d{9}$/.test(v) || 'Nieprawidłowy telefon!',
                  ],
                  peselRules: [
                    v => !!v || 'Uzupełniij PESEL!',
                    v => /^\d{11}$/.test(v) || 'Nieprawidłowy PESEL!',
                  ],
                  building_numberRules: [
                    v => !!v || 'Uzupełnij numer domu!',
                    v => /^\d{1,4}([a-z]?)$/.test(v) || 'Nieprawidłowy format!',
                  ],
                  postalcodeRules: [
                    v => !!v || 'Uzupełnij kod pocztowy!',
                    v => /^\d{2}[-]{1}\d{3}$/.test(v) || 'Nieprawidłowy format!',
                  ],
                  priceRules: [
                    v => !!v || 'Uzupełnij cenę!',
                  ],
                  clinicRules: [
                    v => !!v || 'Uzupełnij przychodnię!',
                  ],
                  degreeRules: [
                    v => !!v || 'Wybierz stopień!',
                  ],

                  //zdjęcie
                  image: {
                    uploadValue: 0,
                    imageData: null,
                    img: null,
                  },

                  rules: [
                    value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
                  ],
                  specializationRules: [
                      v => !!(v && v.length) || "Wybierz specjalizację!",
                  ],
                    clinic: {
                      clinic_id: "",
                    },

                    address: {
                        city: "",
                        street: "",
                        building_number: "",
                        apartment: "",
                        postal_code: ""
                    },
                    specialization: {
                        specialization_id: "",
                    },

                    doctor: {
                        first_name: "",
                        last_name: "",
                        email: "",
                        mobile: "",
                        pesel: "",
                        employment_start: "",
                        address_id:"",
                        clinic_id: "",
                        degree:"",
                        appointment_price:"",
                        personal_info: "",               
                        password: '',
                        is_active: true,  //tmp?
                        photo_url: "",
                    },
                    degree: ["lek.", "dr", "dr n. med.", "dr hab. n. med.", "prof. dr hab. n. med."],
                    specializations: [{
                      specialization_id: "",
                      specialization_name: "",
                    }],
                    clinics: [{
                      clinic_id: "",
                      clinic_name: "",
                    }],
                    

                    
                    
                }
              
            },
          
        
}
    
</script>
<style>


 /* .v-messages__message{
    min-height: 60px;
    margin-top: 6px;
    font-size: 1.6em;
    
  }
  .v-text-field__details{
    min-height: 60px;
    margin-top: 6px;
     
  }
  .v-select__selections{
    font-size: 1.2em;
  }
.v-input__control{
   font-size: 1.2em;
}
.v-select__slot{
  font-size: 0.7em;
}
*/
.v-input{
   font-size: 0.7em;
}

</style>