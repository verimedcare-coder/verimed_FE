/**
 * Centralized API Endpoints Dictionary
 * Matches backend routes in verimed/urls.py (under /verimed prefix via apiClient baseURL).
 */

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/user_login/",
    LOGOUT: "/user_logout/",
    SIGNUP: "/user-signup/",
    VERIFY_EMAIL: "/verify-email/",
    FORGOT_PASSWORD: "/user_update_user/",
    USER_CHOICES: "/user_choices/",
  },
  APPOINTMENTS: {
    LIST: "/verimed_bookappoinment_create_update/",
    CREATE_UPDATE: "/verimed_bookappoinment_create_update/",
    STATUS_CHOICES: "/appoinmentstatus_choices/",
    PATIENT_APPOINTMENTS: "/vb_patientappoinment_list/",
    DOCTOR_APPOINTMENTS: "/vb_doctorappoinment_list/",
    SPONSOR_APPOINTMENTS: "/vb_sponsorappoinment_list/",
    DOCTOR_REPORTS: "/doctor_reports_curd/",
  },
  PATIENTS: {
    LIST: "/patientprofile_list/",
    CREATE_UPDATE: "/patientprofile_create_update/",
    SPONSOR_PATIENTS: "/sponsorid_patientprofile_list/",
    DELETE_PATIENT: "/sponsorid_patientprofile_delete/",
  },
  CARE_TEAM: {
    DOCTORS: "/doctorprofile_list/",
    DOCTOR_UPDATE: "/doctorprofile_update/",
    CARETAKERS: "/caretakerprofile_list/",
    CARETAKER_UPDATE: "/caretakerprofile_update/",
    SPONSORS: "/sponsorprofile_list/",
    SPONSOR_UPDATE: "/sponsorprofile_update/",
  },
  ADMIN: {
    USERS: "/user_view/",
    USER_CREATE: "/user_create/",
    USER_UPDATE: "/user_update/",
    USER_DELETE: "/user_delete/",
    DEPARTMENTS: "/verimed_department_create_update/",
    COUNTRY_CODES: "/verimed_countrycode/",
  },
  BILLING: {
    PAYMENT: "/payment/",
    CHECKOUT: "/create-checkout-session/",
  },
  CONTACT: {
    CREATE: "/contactus_c/",
    LIST_DELETE: "/contactus_rd/",
  },
};
