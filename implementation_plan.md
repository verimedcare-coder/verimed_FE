# Dashboard Enhancement & Fixes Plan

This implementation plan addresses the comprehensive list of improvements across User Management, Patient Enrollment, Appointment Management, Banner Aesthetics, and Doctor Reports.

## User Review Required

> [!IMPORTANT]
> **User Management Deactivation/Activation Toggle**: We are replacing the single "Deactivate Account" button with an interactive status radio/switch so administrators and Practice Managers (Dr. Foy) can both **Activate** and **Deactivate** user accounts seamlessly.
> **Delete Account Confirmation**: Adding a "Delete Account" action for Admin/Dr. Foy with a confirmation popconfirm to prevent accidental deletions.

## Proposed Changes

---

### User Management & CRUD

#### [MODIFY] [UserManagement.jsx](file:///c:/Users/suhai/OneDrive/Documents/GitHub/verimed-dashboard/src/screens/UserManagement.jsx)
- **Patients Tab**: Add `{ key: "patients", label: "Patients" }` into `tabItems` so that the Patients tab is visible and accessible in User Management.
- **Activate / Deactivate Radio Button**: Replace the standalone "Deactivate Account" button in the detailed view drawer with an interactive `Radio.Group` or `Switch` for account status (`Active` vs `Inactive`). When toggled, it will trigger an update to `is_active_state: true` or `false`.
- **Delete Users**: Add a "Delete Account" button with an Ant Design `<Popconfirm>` for Admin and Practice Manager (Dr. Foy) roles. When confirmed, it will call the user/profile removal endpoint and remove the record from the local list.

---

### Patient Enrollment Optimization & Feedback

#### [MODIFY] [Header.jsx](file:///c:/Users/suhai/OneDrive/Documents/GitHub/verimed-dashboard/src/components/Header.jsx)
- **Cancer History Boolean / Option**: Update the `medical_his_cancer` form field from a plain text input to a `<Select>` dropdown (or Radio group) with options: `Yes`, `No`, and `Not Known at time of enrolment`.
- **Loading Spinner & Error/Success Modal**:
  - Add loading state indication (`Spin` / button loading) during patient enrollment/update submission.
  - Implement clean modal/popup feedback that displays clear error messages if submission fails or confirmation when enrollment succeeds.
- **Form Optimization**: Streamline form layout and ensure all required fields are validated cleanly.

---

### Banner Aesthetics & Doctor Count

#### [MODIFY] [Banner.jsx](file:///c:/Users/suhai/OneDrive/Documents/GitHub/verimed-dashboard/src/components/Banner.jsx)
- **Doctor Count Display**: Update the doctor count text from `+100 doctors` to `+10 doctors` as requested.
- **Banner Image Replacement**: Generate a premium, stunning healthcare telemedicine illustration using `generate_image` and replace the current static banner image to wow users at first glance.

---

### Appointment Management

#### [MODIFY] [Appointments.jsx](file:///c:/Users/suhai/OneDrive/Documents/GitHub/verimed-dashboard/src/screens/Appointments.jsx)
- **Admin / Caretaker Time Rescheduling**:
  - Allow Admin and Caretaker roles to open appointment details and modify the appointment date and time.
  - Add date and time pickers inside the appointment details modal/drawer with a "Save Changes" button that sends a PATCH request to `/verimed_bookappoinment_create_update/` with `update_appoinmentid`.

---

### Doctor Reports & Testing

#### [MODIFY] [DoctorForm.jsx](file:///c:/Users/suhai/OneDrive/Documents/GitHub/verimed-dashboard/src/screens/DoctorForm.jsx)
- **Remove Hardcoded Fallbacks**: Remove the hardcoded fallback `caretaker: appointmentData?.caretaker?.id || 4`, replacing it with dynamic fallback resolution so report submissions never fail with invalid foreign key errors during doctor report testing.

## Verification Plan

### Automated Tests
- Verify syntax and linting across modified files.
- Test frontend build/compilation using `npm run build` or local verification if applicable.

### Manual Verification
- **User Management**:
  - Open User Management and verify that the "Patients" tab is visible and displays patient records.
  - Open a user profile drawer and test toggling the Active/Inactive radio button.
  - Verify the Delete Account button appears for Admin/Dr. Foy and triggers the confirmation popup.
- **Enrol Patient Form**:
  - Open the "Enrol Patient" modal from the header.
  - Check that "Cancer History" has the "Not Known at time of enrolment" option.
  - Submit the form and verify loading state and success/error popup modal appear.
- **Banner**:
  - Check the Overview page banner to confirm "+10 doctors" and the new banner aesthetic.
- **Appointments**:
  - Log in as Admin or Caretaker, click an appointment card, and test changing the date/time.
- **Doctor Reports**:
  - Open Doctor Form and verify report submission executes cleanly without hardcoded ID errors.
