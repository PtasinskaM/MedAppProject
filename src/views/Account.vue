<template>
  <p>Redirecting site</p>
</template>

<script>
import * as firebase from "firebase/app";
export default {
name: "Account",
  created() {
  try{
    firebase.auth().currentUser.getIdTokenResult(true)
        .then((idTokenResult) => {
          if (idTokenResult.claims.admin) {
            this.$router.push({
              name: "adminDashboard"
            });
          } else if (idTokenResult.claims.doctor) {
            this.$router.push({
              name: "doctorDashboard"
            });
          } else if (idTokenResult.claims.employee) {
            this.$router.push({
              name: "employeeDashboard"
            });
          } else if (idTokenResult.claims.patient) {
            this.$router.push({
              name: "patientDashboard"
            });
          } else {
            this.$router.push({
              name: "home"
            })
          }

        })
        .catch((err) => {
          console.log(err);
        });
  }
  catch(error){
    console.log("Wystąpił błąd: "+error);
    this.$router.push({
      name: "home"
    })
  }

  }
}
</script>

<style scoped>

</style>