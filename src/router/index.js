import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'
//import Home from '@/views/Home.vue'
import Login from '@/views/Auth/Login.vue'
import DoctorList from '@/views/DoctorList.vue'

import RegisterDoctor from '@/views/Admin/RegisterDoctor.vue'
import RegisterPatient from '@/views/Employee/RegisterPatient.vue'
import RegisterEmployee from '@/views/Admin/RegisterEmployee.vue'
import Logout from '@/views/Auth/Logout.vue'
import AdminDashboard from '@/views/Admin/Dashboard.vue'
import DoctorDashboard from '@/views/Doctor/Dashboard.vue'
import PatientDashboard from '@/views/Patient/Dashboard.vue'
import EmployeeDashboard from '@/views/Employee/Dashboard.vue'

import Appointment from '@/views/Doctor/Appointment.vue'
import ChooseAppointment from '@/views/Doctor/ChooseAppointment.vue'
import AppointmentHistory from '@/views/Doctor/AppointmentHistory.vue'
import EmployeeAppointmentHistory from '@/views/Employee/AppointmentHistory.vue'
import ShowSchedule from '@/views/Doctor/ShowSchedule.vue'



import DoctorListAdmin from '@/views/Admin/DoctorListAdmin.vue'
import EmployeeList from '@/views/Admin/EmployeeList.vue'
import PatientList from '@/views/Admin/PatientList.vue'
import AddClinic from '@/views/Admin/AddClinic.vue'
import AddShift from '@/views/Admin/AddShift.vue'

import * as firebase from "firebase/app";
import "firebase/auth";
import Account from "@/views/Account";
import EditDoctor from "@/views/Admin/EditDoctor";
import EditEmployee from "@/views/Admin/EditEmployee";

import DoctorListEmployee from "@/views/Employee/DoctorListEmployee";
import AdminSchedule from "@/views/Admin/Schedule";
import EmployeeSchedule from "@/views/Employee/Schedule";
import EmployeeAddAppointment from '@/views/Employee/AddAppointment';

Vue.use(VueRouter)
Vue.use(VueMeta);

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
    meta: {
 
    }
  },
  {
    path: '/doctorList',
    name: 'doctorList',
    component: DoctorList,
    
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      guest: true,
    }
  },
  {
    path: '/logout',
    name: 'logout',
    component: Logout,
    meta: {requiresAuth: true}
  },
  {
    path: '/account',
    name: 'accountRedirect',
    component: Account,
    meta: {requiresAuth: true}
  },

  {
    path: '/employee/dashboard',
    name: 'employeeDashboard',
    component: EmployeeDashboard,
    meta: {requiresAuth: true}
  },
  {
    path: '/employee/schedule',
    name: 'employeeSchedule',
    component: EmployeeSchedule,
    meta: {requiresAuth: true}
  },
  {
    path: '/employee/appointmentHistory',
    name: 'employeeAppointmentHistory',
    component: EmployeeAppointmentHistory,
    meta: {requiresAuth: true}
  },
  {
    path: '/employee/addAppointment',
    name: 'employeeAddAppointment',
    component: EmployeeAddAppointment,
    meta: {requiresAuth: true}
  },
  {
    path: '/admin/schedule',
    name: 'adminSchedule',
    component: AdminSchedule,
    meta: {requiresAuth: true}
  },

  {
    path: '/employee/registerPatient',
    name: 'registerPatient',
    component: RegisterPatient,
    meta: {requiresAuth: true}
  },
  {
    path: '/employee/doctorListEmployee',
    name: 'doctorListEmployee',
    component: DoctorListEmployee,
    meta: {requiresAuth: true}
  },
  {
    path: '/admin/registerEmployee',
    name: 'registerEmployee',
    component: RegisterEmployee,
    meta: {requiresAuth: true}
  },
  {
    path: '/admin/registerDoctor',
    name: 'registerDoctor',
    component: RegisterDoctor,
    meta: {requiresAuth: true}
  },
  {
    path: '/admin/addShift',
    name: 'addShift',
    component: AddShift,
    meta: {requiresAuth: true}
  },
  {
    path: '/admin/editDoctor',
    name: 'editDoctor',
    component: EditDoctor,
    meta: {requiresAuth: true}
  },
  {
    path: '/admin/editEmployee',
    name: 'editEmployee',
    component: EditEmployee,
    meta: {requiresAuth: true}
  },

  {
    path: '/admin/dashboard',
    name: 'adminDashboard',
    component: AdminDashboard,
    meta: {requiresAuth: true}
  },
  {
    path: '/doctor/dashboard',
    name: 'doctorDashboard',
    component: DoctorDashboard,
    meta: {requiresAuth: true}
  },
  {
    path: '/doctor/appointment',
    name: 'appointment',
    component: Appointment,
    meta: {requiresAuth: true}
  },
  {
    path: '/doctor/chooseAppointment',
    name: 'chooseAppointment',
    component: ChooseAppointment,
    meta: {requiresAuth: true}
  },
  {
    path: '/doctor/appointmentHistory',
    name: 'appointmentHistory',
    component: AppointmentHistory,
    meta: {requiresAuth: true}
  },
  {
    path: '/doctor/showSchedule',
    name: 'showSchedule',
    component: ShowSchedule,
    meta: {requiresAuth: true}
  },

  {
    path: '/patient/profile',
    name: 'patientDashboard',
    component: PatientDashboard,
    meta: {requiresAuth: true}
  },
  {
  path: '/admin/doctorListAdmin',
  name: 'doctorListAdmin',
  component: DoctorListAdmin,
  meta: {requiresAuth: true}
  },
  {
    path: '/admin/EmployeeList',
    name: 'EmployeeList',
    component: EmployeeList,
    meta: {requiresAuth: true}
    },
  {
    path: '/admin/PatientList',
    name: 'PatientList',
    component: PatientList,
    meta: {requiresAuth: true}
  },
  {
    path: '/admin/addClinic',
    name: 'addClinic',
    component: AddClinic,
    meta: {requiresAuth: true}
    },

]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});


router.beforeEach((to, from, next) => {
  
  //define paths
  let isEmployeeRoute = to.fullPath.indexOf('/employee/') >-1;
  let isAdminRoute = to.fullPath.indexOf('/admin/') >-1;
  let isDoctorRoute = to.fullPath.indexOf('/doctor/') >-1;
  let isPatientRoute = to.fullPath.indexOf('/patient/') >-1;

  firebase.auth().onAuthStateChanged(userAuth => {

    if (userAuth) {
      firebase.auth().currentUser.getIdTokenResult()
        .then(function ({
          claims
        }) {


          if (claims.employee) {

            if(isEmployeeRoute){
              next();
            }
            else{
              next("/employee/dashboard");
            }


          } 
          else if (claims.doctor) {
            if(isDoctorRoute){
              next();
            }
            else{
              next("/doctor/dashboard");
            }

          }
          else if (claims.admin) {

            if(isAdminRoute){
              next();
            }
            else{
              next("/admin/dashboard");
            }

          } 
          
          else if (claims.patient) {


            if(isPatientRoute){
              next();
            }
            else if(to.path === "/"){
              next();
            }
            else{
              next("/patient/profile");
            }

          }
          else {
              if(isPatientRoute || isEmployeeRoute || isDoctorRoute || isAdminRoute){
                next('login');
              }
              else if(to.path === "/"){
                next();
              }
              else next('login');

          }

        })
    } else {
      if(isPatientRoute || isEmployeeRoute || isDoctorRoute || isAdminRoute){
        next({
          path: '/login',
          query: {
            redirect: to.fullPath
          }
        })
      }
      else if(to.path === "/account") next('/login');
      else {
        next()
      }
    }

  })

  next()

});

export default router
