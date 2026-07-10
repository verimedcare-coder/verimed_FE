/**
 * Centralized API Endpoints Dictionary
 * All API route paths should be registered and exported from here.
 */

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/login/",
    LOGOUT: "/logout/",
    FORGOT_PASSWORD: "/forgot-password/",
  },
  APPOINTMENTS: {
    LIST: "/appointments/",
    CREATE: "/appointments/create/",
    MY_APPOINTMENTS: "/my-appointments/",
    DOCTOR_FORM: "/doctor-form/",
  },
  PATIENTS: {
    LIST: "/patients/",
    DETAILS: "/patient-details/",
  },
  CARE_TEAM: {
    LIST: "/care-team/",
    LOVED_ONES: "/my-loved-ones/",
    CARETAKER: "/my-caretaker/",
  },
  ADMIN: {
    USERS: "/users/",
    DEPARTMENTS: "/departments/",
  },
  DASHBOARD: {
    OVERVIEW: "/overview/",
    DAILY_REPORTS: "/daily-reports/",
    HEALTH_MONITORING: "/health-monitoring/",
  },
  BILLING: {
    MEMBERSHIP_PLANS: "/membership-plans/",
    CHECKOUT: "/checkout/",
  },
  MESSAGES: {
    LIST: "/messages/",
    REPORTS: "/my-reports/",
    SUPPORT: "/support/",
  },
};
