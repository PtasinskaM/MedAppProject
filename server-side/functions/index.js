const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();


exports.createEmployeeWithRole = functions.https.onCall( async (data, context) => {
  //konwersja obiektów
  const address = {
    city: data.address.city.toString(),
    street: data.address.street.toString(),
    building_number: data.address.building_number.toString(),
    apartment: data.address.apartment.toString(),
    postal_code: data.address.postal_code.toString()
  };

  const employee= {
    first_name: data.employee.first_name.toString(),
    last_name: data.employee.last_name.toString(),
    pesel: data.employee.pesel.toString(),
    date_of_birth: data.employee.date_of_birth.toString(),
    address_id: "",
    mobile: data.employee.mobile.toString(),
    email: data.employee.email.toString(),
    role: data.employee.role.toString(),
    is_active: true,  

  };
  const password = data.employee.password.toString();

  const userRecord = await admin.auth().createUser({
    email: employee.email,
    password: password,
    });
  if(userRecord){
    console.log('Successfully created new employee: '+userRecord.uid);
    const docRef = await admin.firestore().collection('address').add(address);
    employee.address_id=docRef;

    let customClaims = {};
    if(employee.role=="recepcjonista/ka"){
      customClaims = {
        employee: true,
      };
    }
    else if(employee.role=="admin"){
      customClaims = {
        admin: true,
      };
    }
    await admin.firestore().collection("employee")
        .doc(userRecord.uid).set(employee);

    console.log("Użytkownik: "+userRecord.email+" uid: "+userRecord.uid);
    await assignRole(userRecord.uid, customClaims);
    console.log("Dodano użytkownika: "+userRecord.email);
    sendPasswordMail(employee.email, password);
  }
  else{
    console.log('Error creating new user');
  }




  //tylko admin moze zmieniac role
  //if (!context.auth.token.admin) return

});


exports.createPatientWithRole = functions.https.onCall( async (data, context) => {

  const address = {
    city: data.address.city,
    street: data.address.street,
    building_number: data.address.building_number,
    apartment: data.address.apartment,
    postal_code: data.address.postal_code
  };

  const patient= {
    first_name: data.patient.first_name,
    last_name: data.patient.last_name,
    pesel: data.patient.pesel,
    date_of_birth: data.patient.date_of_birth,
    address_id: "",
    mobile: data.patient.mobile,
    email: data.patient.email,
    is_active: true,
  };
  const password = data.patient.password;
  const userRecord = await admin.auth().createUser({
    email: patient.email,
    password: password,
    });
  if(userRecord) {
      console.log('Successfully created new patient: '+userRecord.uid);
      const docRef = await admin.firestore().collection('address').add(address);
      patient.address_id=docRef;

      let customClaims = {};
      customClaims = {
        patient: true,
      };

      await admin.firestore().collection("patient").doc(userRecord.uid).set(patient);

      console.log("Użytkownik: "+userRecord.email+" uid: "+userRecord.uid);
      await assignRole(userRecord.uid, customClaims);
      console.log("Dodano użytkownika: "+userRecord.email);
      sendPasswordMail(patient.email, password);
  }
  else console.log('Error creating new user');



});



exports.createDoctorWithRole = functions.https.onCall( async (data, context) => {

  //konwersja obiektów
  const address = {
    city: data.address.city.toString(),
    street: data.address.street.toString(),
    building_number: data.address.building_number.toString(),
    apartment: data.address.apartment.toString(),
    postal_code: data.address.postal_code.toString()
  };
  const clinic = {
    clinic_id: data.clinic.clinic_id.toString()
  };
  const specializations= {
    specialization_id: data.specialization.specialization_id,
  };
  const doctor= {
    first_name: data.doctor.first_name.toString(),
    last_name: data.doctor.last_name.toString(),
    pesel: data.doctor.pesel.toString(),
    address_id: "",
    clinic_id: "",
    mobile: data.doctor.mobile.toString(),
    email: data.doctor.email.toString(),
    employment_start: data.doctor.employment_start,
    degree: data.doctor.degree.toString(),
    appointment_price: Number.parseInt(data.doctor.appointment_price),
    personal_info: data.doctor.personal_info.toString(),
    is_active: true,
    photo_url: data.doctor.photo_url.toString(),

  };
  const password = data.doctor.password;


  console.log("Received data: "+doctor.toString()+"\n"+JSON.stringify(address));
  
  console.log("Test of getting field plain: "+doctor.email);

    const userRecord = await admin.auth().createUser({
      email: doctor.email,
      password: password,
    });
    if(userRecord){
      console.log('Successfully created new doctor: '+userRecord);
        const addrRef = await admin.firestore().collection('address').add(address);
        doctor.address_id=addrRef;

        let customClaims = {
          doctor: true,
        };
        //dodanie referencji kliniki
        const clinicRef = await admin.firestore().collection("clinic").doc(clinic.clinic_id);
        doctor.clinic_id=clinicRef;

        //dodanie dokumentu lekarza
        await admin.firestore().collection("doctor").doc(userRecord.uid).set(doctor);
        const doctorRef = await admin.firestore().collection("doctor").doc(userRecord.uid);

        //dodanie wpisów to kolekcji pośredniczącej
        console.log(specializations.specialization_id);
        for (const element of specializations.specialization_id) {
          //dla każdej specjalizacji z tablicy należy dodać dokument do kolekcji doctor_has_specialization
          const specRef = await admin.firestore().collection("specialization").doc(element);
          console.log("Spec id: "+element);
          const doctorSpecialization = {
            specialization_id: specRef,
            doctor_id: doctorRef,
          }
          await admin.firestore().collection("doctor_has_specialization").add(doctorSpecialization);
        }
        console.log("Lekarz: "+userRecord.email+" uid: "+userRecord.uid);
        await assignRole(userRecord.uid, customClaims);
        console.log("Dodano lekarza: "+userRecord.email);
        sendPasswordMail(doctor.email, password);
    }else console.log("Error creating user");




  //tylko admin moze zmieniac role
  //if (!context.auth.token.admin) return

});

//edycja kont

exports.editDoctor = functions.https.onCall( async (data, context) => {

  if (!(context.auth.token.admin || context.auth.token.employee)) return

  const address = data.address;
  const clinic = data.clinic;
  const specializations = data.specialization;
  const doctor = data.doctor;
  const price = Number.parseInt(doctor.appointment_price);
  doctor.appointment_price = price;

  let exists = false;
  let userRecord = await admin.auth().getUser(doctor.id)
  if(userRecord) exists = true;
  if(!doctor.is_active && !userRecord.disabled){
    console.log("Wyłączanie konta: "+doctor.id);
    await admin.auth().updateUser(userRecord.uid, {
      disabled: true
    });
  }
  else if(doctor.is_active && userRecord.disabled){
    console.log("Włączenie konta: "+doctor.id);
    await admin.auth().updateUser(userRecord.uid, {
      disabled: false
    });
  }

  if(exists) try{
    const addrRef = await admin.firestore().collection('address').doc(address.id);
    doctor.address_id=addrRef;

    const clinicRef = await admin.firestore().collection("clinic").doc(clinic.clinic_id);
    doctor.clinic_id=clinicRef;


    const doctorRef = await admin.firestore().collection("doctor").doc(doctor.id);
    await doctorRef.set(doctor);

    const doctorHasSpecRef = await admin.firestore().collection("doctor_has_specialization")
    .where("doctor_id", "==", doctorRef);
    doctorHasSpecRef.get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              doc.ref.delete().then(() => {
                console.log("Usunięto specjalizację");
              })
                  .catch((error) => console.log(error));
          })
        }).catch((error) => console.log(error));

    for (const element of specializations) {
      const specRef = await admin.firestore().collection("specialization").doc(element);
      const doctorSpecialization = {
        specialization_id: specRef,
        doctor_id: doctorRef,
      }
      await admin.firestore().collection("doctor_has_specialization").add(doctorSpecialization);
    }

    console.log("Lekarz: "+userRecord.email+" uid: "+userRecord.uid);
    console.log("Edytowano lekarza: "+userRecord.email);

  }

  catch(error) {
    console.log('Błąd podczas edycji lekarza:', error);

  }
  else console.log("Użytkownik o podanym id nie istnieje!");


});

//usuwanie kont
exports.deleteDoctor = functions.https.onCall( async (data, context) => {
  //tylko admin lub pracownik recepcji moze usuwać lekarzy
  if (!(context.auth.token.admin || context.auth.token.employee)) return
  const id = data;
  console.log("Recevied id: "+id);
  let exists = false;
  let userRecord = await admin.auth().getUser(id);
  console.log("User record: "+userRecord.email);
  if(userRecord) exists = true;

  console.log("Doctor exists: "+exists);
  if(exists) try{
    let address;
    const doctorRef = await admin.firestore().collection("doctor").doc(id);
    console.log("DoctorRef path: "+doctorRef.path);
    const doctorRecord = await doctorRef.get();
    address = doctorRecord.data().address_id;
    console.log("Address id: "+address.id)
    if(address){
      console.log("Address ref path: "+address.path);
      const addrRef = await admin.firestore().collection("address").doc(address.id);
      addrRef.get().then((doc) => {
        doc.ref.delete().then(() => {
          console.log("Deleted doctor's address doc");
        })
      })
    }


    //usuwamy wszystkie wpisy powiązane z danym lekarzem w kolekcji doctor_has_specialization
    const doctorHasSpecRef = await admin.firestore().collection("doctor_has_specialization")
        .where("doctor_id", "==", doctorRef);
    doctorHasSpecRef.get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete().then(() => {
              console.log("Deleted doctor's spec");
            })
                .catch((error) => console.log(error));


          })
        }).catch((error) => console.log(error));

    //usuwamy wszystkie wpisy powiązane z danym lekarzem w kolekcji favourite
    const favouriteRef = await admin.firestore().collection("favourite")
        .where("doctor_id", "==", doctorRef);
    favouriteRef.get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete().then(() => {
              console.log("Deleted favourite for doctor: "+doctorRef.id);
            })
                .catch((error) => console.log(error));


          })
        }).catch((error) => console.log(error));

    //na koniec usuwamy lekarza
    await doctorRef.get().then((doc) => {
      doc.ref.delete().then(() => {
        console.log("Deleted doctor with id: "+id);
      });
    });
    admin.auth().deleteUser(id).then(r => console.log("Deleted user account, response: "+r))
        .catch(e => console.log("Error on deleting user account, message: "+e));

    console.log("Usunięto konto lekarza: "+userRecord.email);
    }
  catch(error) {
    console.log('Error deleting user:', error);
  }
  else console.log("Deleting user failed - user does not exists");
});

exports.enableAccount = functions.https.onCall( async (data, context) => {
  let uid = data;
  //tylko admin może włączyć lub wyłączyć konto
  if (!(context.auth.token.admin)) return

  let userRecord = await admin.auth().getUser(uid);
  if(userRecord && userRecord.disabled){
    console.log("Włączanie konta: "+userRecord.uid);
    await admin.auth().updateUser(userRecord.uid, {
      disabled: false
    });
  }
  else console.log("Nie ma takiego użytkownika!");


});

exports.disableAccount = functions.https.onCall( async (data, context) => {
  let uid = data;
  //tylko admin może włączyć lub wyłączyć konto
  if (!(context.auth.token.admin)) return

  let userRecord = await admin.auth().getUser(uid);
  if(userRecord && !(userRecord.disabled)){
    console.log("Wyłączanie konta: "+userRecord.uid);
    await admin.auth().updateUser(userRecord.uid, {
      disabled: true
    });
  }
  else console.log("Nie ma takiego użytkownika!");


});

//trasporter do wysyłania wiadomości e-mail
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'centrummedycznexyz@gmail.com',
    pass: 'rtdrnxaxjhnsiqqf\n'
  }
});
function sendPasswordMail(email, password){
  const mailOptions = {
    from: "Centrum Medyczne XYZ <centrummedycznexyz@gmail.com>",
    to: email,
    subject: 'Utworzono konto - Centrum Medyczne XYZ',
    html: `<p>Twoje konto zostało utworzone, teraz możesz się zalogować z użyciem poniższych danych: </p>
            <p>Adres e-mail: ${email}</p><p>Hasło: ${password}</p>`
  };
  return transporter.sendMail(mailOptions, (error, info) => {
    if(error){
      console.log("Wysyłanie maila nie powiodło się: "+error);
    }
    else console.log("Wysłano wiadomośc email z loginem i hasłem: "+info);
  });
}

async function assignRole(uid, claims) {
  try {
    var _ = await admin.auth().setCustomUserClaims(uid, claims)
    console.log("Dodano rolę ")

  } catch (error) {
    console.log(error)
  }
}
