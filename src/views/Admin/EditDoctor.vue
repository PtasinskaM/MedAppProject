<template>
  <v-container>
    <v-layout row class="justify-center">
      <v-flex cols="12" xs12 sm12 md12 lg8  >
        <v-card 
        light
        color="rgb(33, 131, 162, 0.9)"
        class="mx-auto"
        max-width="1200"
        elevation="2"
        shaped
        tile>
          <v-card-text class="display-1 font-weight-bold, white--text align-end">
            Edycja danych lekarza
          </v-card-text>
            <v-container>
              <v-form
              @submit.prevent="pressed" 
              ref="form"
              v-model="valid"
              lazy-validation>
              
                <v-layout row>
                  <v-col>
                  <v-flex xs12>
                    <v-checkbox
                    class="headline font-weight-bold, white--text align-end"
                    v-model="checkbox"
                    :label="`Aktywne`"
                    ></v-checkbox>
                  </v-flex>
                  </v-col>
                </v-layout>

                <v-layout row>
                  <v-col>
                  <v-flex xs12>
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
                    hint="Imię"
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
                    hint="Nazwisko"
                    :rules="lastnameRules"
                    required></v-text-field>
                  </v-flex>
                  </v-col>
                </v-layout>

                <v-layout row>
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
                    :rules="phoneRules"
                    ></v-text-field>
                  </v-flex>
                  </v-col>
                
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
                    hint="PESEL"
                    :rules="peselRules"
                    required></v-text-field>
                  </v-flex>
                  </v-col>
                </v-layout>

                <v-layout row>
                  <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">Data rozpoczęcia pracy</label>
                    <v-text-field
                    solo
                    single-line
                    height="60"
                        name="start_date"
                        label="Data rozpoczęcia pracy"
                        id="start_date"
                        v-model="doctor.employment_start"
                        type="date"
                        hint="Data rozpoczęcia pracy"
                        :rules="dateRules"
                        required></v-text-field>
                  </v-flex>
                  </v-col>
                
                  <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    Przewidywana data zakończenia pracy</label>
                    <v-text-field
                    solo
                    single-line
                    height="60"
                        name="end_date"
                        label="Przewidywana data zakończenia pracy"
                        id="end_date"
                        v-model="doctor.employment_ends"
                        type="date"
                        hint="Przewidywana data zakończenia pracy"
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
                    hint="Miasto"
                     :rules="cityRules"
                    required></v-text-field>
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
                    hint="Ulica"
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
                    hint="Numer budynku"
                    :rules="building_numberRules"
                    required></v-text-field>
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
                    hint="Numer mieszkania"
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
                    label="Kod pocztowy"
                    id="postal_code"
                    v-model="address.postal_code"
                    type="text"
                    hint="Kod pocztowy"
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
                    <v-select
                    solo
                    single-line
                    height="60"
                    name="degree"
                    v-model="doctor.degree"
                    :items="degree"
                    label="Stopień naukowy"
                    required
                    :rules="degreeRules"
                    ></v-select>
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
                    v-model="specialization"
                    :items="specializations"
                    ref="specializations"
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
                    id="clinic"
                    item-text="clinic_name"
                    item-value="clinic_id"
                    no-data-text="Brak danych"
                     :rules="clinicRules"
                    required>

                    </v-autocomplete>
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
                    :rules="priceRules"
                    required></v-text-field>
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
                prepend-icon="mdi-camera"
                @change="previewPhoto($event)"
              ></v-file-input>


                <v-layout row >
                  <v-flex xs12>
                    <v-img  style="margin: 10px" id="photo"
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
                    <v-btn x-large block text color="white" type="submit">Zapisz</v-btn>
                  </v-flex>
                  <v-flex xs6 pa-1>
                    <v-btn x-large block text color="white" @click="returnToList">Anuluj</v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-container>
        </v-card>
      </v-flex>
    </v-layout>

    <v-dialog
                v-model="errorDialog"
                persistent
                max-width="600"
              >
                <v-card  align-center
                max-width="596"
                color="rgb(33, 131, 162, 0.9)">
                  <v-card-title class="headline font-weight-bold white--text align-end">Błąd!</v-card-title>
                  <v-card-text  height="60">
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
                <v-card  align-center
                max-width="596"
                color="rgb(33, 131, 162, 0.9)">
                  <v-card-title class="headline font-weight-bold white--text align-end">Sukces!</v-card-title>
                  <v-card-text  height="60">
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
                          <v-btn  x-large text color="white" @click="returnToList">OK</v-btn>
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
            returnToList(){
              this.successDialog=false;
              this.$router.push({name: "doctorListAdmin"});
            },
            async pressed(){
              if(this.$refs.form.validate()){
              if(this.image.img!="") this.doctor.photo_url=this.image.img;
              else this.doctor.photo_url="https://firebasestorage.googleapis.com/v0/b/centrum-medyczne-8367d.appspot.com/o/doctors%2F1606218227891.png?alt=media&token=73b5f128-40c4-4ff2-9179-4145c9daab39";
              if(this.doctor.employment_ends<this.doctor.employment_start){
                this.doctor.employment_ends="";
                alert("niepoprawna data");
              }
              this.doctor.is_active = this.checkbox;
              var data = {
                address: this.address,
                doctor: this.doctor,
                specialization: this.specialization,
                clinic: this.clinic
              };

                var addMessage = firebase.functions().httpsCallable("editDoctor");
                addMessage(data)
                  .then((result) => {
                  console.log(result);
                  this.message="Pomyślnie zmieniono dane lekarza";
                  this.successDialog=true;
                  this.$refs.form.reset();
                  })
                  .catch((err) => {
                    console.log(err);
                    this.message="Podane dane są niepoprawne!";
                    this.errorDialog=true;
                  });
              }
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
          async getDoctor(){
            console.log("Id: "+this.$route.query.doctor_id);

            const db = firebase.firestore();
            const doctor_id = this.$route.query.doctor_id;
            if(doctor_id){
              const doctorRef = await db.collection("doctor").doc(doctor_id);
              doctorRef.get().then(async(doc) => {
                if(doc.exists){
                  /*
                  this.doctor = doc.data();
                  this.doctor.id = doc.id;
                  */
                  this.doctor = {};
                  this.doctor.id = doc.id;
                  this.doctor.first_name= doc.data().first_name;
                  this.doctor.last_name= doc.data().last_name;
                  //this.doctor.email= doc.data().email;
                  this.doctor.mobile= doc.data().mobile;
                  this.doctor.pesel= doc.data().pesel;
                  this.doctor.employment_start= doc.data().employment_start;
                  this.doctor.employment_ends= doc.data().employment_ends;
                  this.doctor.address_id= doc.data().address_id;
                  this.doctor.clinic_id= doc.data().clinic_id;
                  this.doctor.degree= doc.data().degree;
                  this.doctor.appointment_price= doc.data().appointment_price;
                  this.doctor.personal_info= doc.data().personal_info;
                  this.doctor.is_active= doc.data().is_active;
                  this.doctor.photo_url= doc.data().photo_url;

                  const clinicRef = this.doctor.clinic_id;
                  const clinicDoc = await clinicRef.get();
                  this.clinic.clinic_id = clinicDoc.id;
                  const addressDoc = await doc.data().address_id.get();
                  this.address = addressDoc.data();
                  this.address.id = addressDoc.id;
                  //console.log(addressDoc.ref.path+"=="+doc.data().address_id.path);
                  //console.log("Equal: "+(this.address.id==doc.data().address_id.id)); //true
                  //console.log("Equal2: "+(addressDoc.ref.path==doc.data().address_id.path)); //true
                  
                  this.checkbox = this.doctor.is_active;
                  //czyszczenie pól pomocniczych, aby zapobiec zapętleniu
                  this.doctor.address_id= "";
                  this.doctor.clinic_id= "";

                  //pobranie specjalizacji:
                  await this.getDoctorSpecializations(doctorRef);

                  //pobranie zdjęcia:
                  this.image.img = this.doctor.photo_url;
                  const storageRef = firebase.storage().refFromURL(this.doctor.photo_url);
                  const url = await storageRef.getDownloadURL();
                  const photo = document.getElementById("photo");
                  photo.src = url;

                }
                else console.log("Nie ma takiego lekarza!");
              }).catch((error) => console.log(error));
            }

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

          async getDoctorSpecializations(doctorRef) {
            const db = firebase.firestore();
            //const specializationRef = db.collection("specialization");
            const doctorSpecRef = db.collection("doctor_has_specialization")
                .where("doctor_id", "==", doctorRef);
            doctorSpecRef.get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                //specialization_id - referencja do dokumentu specialization, id - id tego dokumentu
                this.specialization.push(doc.data().specialization_id.id)
              })

            }).catch((error) => console.log(error));

          },
        },
      async created(){
          this.specializations = await this.getSpecializations();
          this.specialization.shift();
          this.clinics = await this.getClinics();
          this.doctor = await this.getDoctor();


      },
      data(){
            return{
              successDialog: false,
              errorDialog: false,
              message: "",
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
                  v => !!(v && v.length) || "Musisz wybrać przynajmniej jedną specializację!",
              ],
                clinic: {
                  clinic_id: "",
                },

                address: {
                    id: "",
                    city: "",
                    street: "",
                    building_number: "",
                    apartment: "",
                    postal_code: ""
                },
                specialization: [{
                    specialization_id: "",
                }],

                doctor: {
                  id: "",
                  first_name: "",
                  last_name: "",
                  email: "",
                  mobile: "",
                  pesel: "",
                  employment_start: "",
                  employment_ends: "",
                  address_id:"",
                  clinic_id: "",
                  degree:"",
                  appointment_price:0,
                  personal_info: "",
                  is_active: false,  //tmp?
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
                error: '',
                checkbox: false,

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


                
                
            }
          
        },
        
}
    
</script>
