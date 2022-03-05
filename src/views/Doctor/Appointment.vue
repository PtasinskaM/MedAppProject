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
            Wizyta
          </v-card-text>
        
            <v-form 
              @submit.prevent="pressed"
              ref="form"
              v-model="valid"
              lazy-validation
             >
              <v-container>
                <v-layout row>
                  <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    Imię pacjenta</label>
                    <v-text-field
                    solo
                    disabled
                    single-line
                    height="60"
                    name="first_name"
                    id="first_name"
                    v-model="patient.first_name"
                    type="text"
                    ></v-text-field>
                  </v-flex>
                  </v-col>

                  <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    Nazwisko pacjenta</label>
                    <v-text-field
                    solo
                    disabled
                    single-line
                    height="60"
                    name="last_name"
                    id="last_name"
                    v-model="patient.last_name"
                    type="text"
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
                    disabled
                    single-line
                    height="60"
                    name="pesel"
                    label="PESEL"
                    id="pesel"
                    v-model="patient.pesel"
                    type="text"
                    ></v-text-field>
                  </v-flex>
                  </v-col>
               
                  <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, white--text align-end">
                    Czy pacjent jest obecny?</label>
                    <v-radio-group
                    color="white"
                    height="60"
                    id="patient_absent"
                    v-model="appointment.patient_absent"
                    mandatory
                    >
                    <v-radio
                    label="Tak"
                    value="false"
                     ></v-radio>
                    <v-radio
                    label="Nie"
                    value="true"
                     ></v-radio></v-radio-group>
                  </v-flex>
                  </v-col>
                </v-layout>

                
                <v-layout row>
                  <v-col>
                  <v-flex xs12 sm12 lg12>
                  <label class="headline font-weight-bold, white--text align-end">
                  Objawy</label>
                <v-textarea
                  solo
                  height="120"
                  name="symptoms"
                  id="symptoms"
                  v-model="healthcard.symptoms"
                  type="text"
                  :rules="my_rules"
                ></v-textarea>
                </v-flex>
                  </v-col>
              </v-layout>
                

                 <v-layout row>
                  <v-col>
                  <v-flex xs12 sm12 lg12>
                  <label class="headline font-weight-bold, white--text align-end">
                  Leczenie</label>
                <v-textarea
                  solo
                  height="120"
                  name="treatment"
                  id="treatment"
                  v-model="healthcard.treatment"
                  type="text"
                  :rules="my_rules"
                ></v-textarea>
                </v-flex>
                  </v-col>
                </v-layout>

                <v-layout row>
                  <v-col>
                  <v-flex xs12 sm12 lg12>
                  <label class="headline font-weight-bold, white--text align-end">
                  Notatki dla pacjenta</label>
                <v-textarea
                  solo
                  height="120"
                  name="patient_note"
                  id="patient_note"
                  v-model="healthcard.patient_note"
                  type="text"
                  :rules="my_rules"
                ></v-textarea>
                </v-flex>
                  </v-col>
                </v-layout>


                <v-layout row xs12>
                  <v-flex xs6 pa-1 >
                    <v-btn x-large block  text color="white" @click="addPrescription=!addPrescription">WYSTAW RECEPTĘ</v-btn>
                  </v-flex>
               
                  <v-flex xs6 pa-1 >
                    <v-btn x-large block  text color="white"  type="submit" >ZAPISZ WIZYTĘ</v-btn>
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

          <v-dialog v-model="addPrescription" max-width="800px" class="mx-auto">
          <v-card>
            <v-card-title class="display-1 font-weight-bold, black--text align-end">Recepta</v-card-title>
           
              <v-spacer></v-spacer>
              <v-form 
              @submit.prevent="pressed"
              ref="form"
              v-model="valid"
              lazy-validation
             >
              <v-container>
              <v-layout row>
                  <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, black--text align-end">
                    Imię pacjenta</label>
                    <v-text-field
                    solo
                    disabled
                    single-line
                    height="60"
                    name="first_name"
                    id="first_name"
                    v-model="patient.first_name"
                    type="text"
                    ></v-text-field>
                  </v-flex>
                  </v-col>

                  <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, black--text align-end">
                    Nazwisko pacjenta</label>
                    <v-text-field
                    solo
                    disabled
                    single-line
                    height="60"
                    name="last_name"
                    id="last_name"
                    v-model="patient.last_name"
                    type="text"
                    ></v-text-field>
                  </v-flex>
                  </v-col>
                </v-layout>

                <v-layout row>
                  <v-col>
                  <v-flex xs6 sm6 lg6>
                    <label class="headline font-weight-bold, black--text align-end">
                    PESEL</label>
                    <v-text-field
                    solo
                    disabled
                    single-line
                    height="60"
                    name="pesel"
                    id="pesel"
                    v-model="patient.pesel"
                    type="text"
                    ></v-text-field>
                  </v-flex>
                  </v-col>
                </v-layout>

                <v-layout row>
                  <v-col>
                  <v-flex xs12 sm12 lg12>
                    <label class="headline font-weight-bold, black--text align-end">
                    Nazwa leku</label>
                    <v-autocomplete
                    solo
                    single-line
                    height="60"
                    name="trade_name"
                    id="trade_name"
                    v-model="prescriptionHasDrug.drug_id"
                    :items="drugs"
                    :item-text="item => item.trade_name +' - '+ item.active_substance+' - '+ item.dose+' - '+ item.form"
                    item-value="drug_id"
                    type="text"
                    >
                    </v-autocomplete>
                  </v-flex>
                  </v-col>
                </v-layout>

              </v-container>
               <v-card-actions>
              <v-flex xs6 pa-1>
                    <v-btn x-large block text color="#219ebc" @click="addPrescription=!addPrescription">ANULUJ</v-btn>
                  </v-flex>
                  <v-flex xs6 pa-1>
                    <v-btn x-large block text color="#fb8500" @click="addNewPrescription">WYSTAW</v-btn>
                  </v-flex>
              <v-spacer></v-spacer>
            </v-card-actions>
              </v-form>
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
                          <v-btn  x-large text color="white" @click="returnToAppointments">OK</v-btn>
                      </v-flex>
                    </v-layout>
                  </v-card-actions>
            </v-card>
        </v-dialog>
    <v-dialog
        v-model="addedPrescription"
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
              <v-btn  x-large text color="white" @click="addedPrescription=!addedPrescription">OK</v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>

    import firebase from "firebase";
    export default {    
            data(){
                return{
                    addPrescription: false,
                    addedPrescription: false,
                    successDialog: false,
                    errorDialog:false,
                    message: "",
                    valid: true,
                    my_rules:[
                     v => !!v || 'Uzupełnij dane!',
                    ],
                patient: {
                    id: "",
                    first_name: "",
                    last_name: "",
                    pesel: "",
                },
                appointment_id: -1,
                appointment: {},
                 healthcard: {
                     symptoms: "",
                     treatment: "",
                     patient_note: "",
                   time_created: "",
                 }, 
                 drugs: [{
                    drug_id: "",
                    trade_name: "",
                    active_substance: "",
                    dose: "",
                    form: "",
                 }],
                 prescriptionHasDrug: {
                   drug_id: "",
                   prescription_id: "",
                 },
                  prescription: {
                      doctor_id: "",
                      expire_after: "",
                      issue_date: "",
                      patient_id: "",
                  },
                        
                }
              
            },
            methods: {
          
            async pressed(){
                if(this.$refs.form.validate()){
                    this.message="";
                    try{
                        const db = firebase.firestore();
                        const appointment_id = this.$route.query.appointment_id;
                        this.healthcard.time_created = firebase.firestore.Timestamp.fromDate(new Date());
                        //edycja
                        if(this.appointment.healthcard_id){
                          await db.collection("healthcard").doc(this.appointment.healthcard_id.id).set(this.healthcard);
                        }
                        //nowa karta
                        else {
                          const healthcardRef = await db.collection("healthcard").add(this.healthcard);
                          this.appointment.healthcard_id = healthcardRef;
                        }
                        this.appointment.completed=true;
                        this.appointment.doctor_absent=false;
                        this.appointment.patient_absent=this.appointment.patient_absent === "true";
                        this.appointment.rated=false;
                        this.appointment.appointment_stop=firebase.firestore.Timestamp.fromDate(new Date());
                        const appointmentRef = db.collection("appointment")
                        .doc(appointment_id).set(this.appointment);
                        console.log(appointmentRef);
                        this.message="Zapisano wizytę!";
                        this.successDialog=true;
                    }
                    catch(error){
                        this.message = error;
                        this.errorDialog=true;
                    }
                }

            },
            addNewPrescription(){
              if(this.prescriptionHasDrug.drug_id) {
                this.message = "";
                const db = firebase.firestore();
                this.prescription.doctor_id = this.appointment.doctor_id;
                this.prescription.patient_id = this.appointment.patient_id;
                let issueDate = new Date();
                let expireDate = new Date(issueDate);
                expireDate.setDate(issueDate.getDate()+30);
                this.prescription.issue_date = firebase.firestore.Timestamp.fromDate(issueDate);
                this.prescription.expire_after = firebase.firestore.Timestamp.fromDate(expireDate);
                db.collection('prescription').add(this.prescription).then((prescriptionRef) => {
                  this.prescriptionHasDrug.prescription_id = prescriptionRef;
                  const drugRef = db.collection('drug').doc(this.prescriptionHasDrug.drug_id);
                  this.prescriptionHasDrug.drug_id = drugRef;
                  db.collection('prescription_has_drug').add(this.prescriptionHasDrug)
                      .then(() => {
                        console.log("Dodano receptę");
                        this.message = "Dodano receptę";
                        this.addedPrescription = true;
                        this.addPrescription = false;
                      });
                });

              }
            },
              returnToAppointments(){
                this.successDialog = false;
                this.$router.push({name: "chooseAppointment"});
              },
            getDrugs(){
                const db = firebase.firestore();
                const drugRef = db.collection("drug");
                const drugs = [];
                drugRef.get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        drugs.push({
                            drug_id: doc.id,
                            trade_name: doc.data().trade_name,
                            active_substance: doc.data().active_substance,
                            dose: doc.data().dose,
                            form: doc.data().form,
                        });
                    })
                }).catch((error) => console.log(error));
              drugs.shift();
              return drugs;
            },
            getAppointmentData(){
                const db = firebase.firestore();
                const appointment_id = this.$route.query.appointment_id;
                const appointmentRef = db.collection("appointment")
                .doc(appointment_id);
                appointmentRef.get().then(async(doc) => {
                    const patient =await db.collection("patient").doc(doc.data().patient_id.id).get();
                    this.appointment = doc.data();
                    this.patient = patient.data();
                    this.patient.id=patient.id;
                    if(doc.data().healthcard_id){
                      const healthcardRef = await db.collection("healthcard").doc(doc.data().healthcard_id.id);
                      healthcardRef.get().then((healthcardDoc) => {
                        this.healthcard.patient_note = healthcardDoc.data().patient_note;
                        this.healthcard.symptoms = healthcardDoc.data().symptoms;
                        this.healthcard.treatment = healthcardDoc.data().treatment;
                      });
                    }
                }).catch((error) => {console.log(error)});

            },

          
        
},
            created(){
                this.getAppointmentData();
                this.drugs = this.getDrugs();

            },
    }
    
</script>
<style>
    .v-textarea{
    font-size: 1.8em;
    }

</style>