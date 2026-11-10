/**
 * Sponsor Data Isolation Helpers
 * Keeps sponsor profile resolution, storage cleanup, and client-side
 * appointment/patient ownership checks consistent across all screens.
 */

const ROLE_SESSION_KEYS = [
  "sponsorData",
  "sponsorProfileId",
  "sponsorPatientIds",
  "sponsorPatientData",
  "sponsorAppointments",
  "selectedPatientId",
  "selectedPatientData",
  "selectedPatientAppointments",
  "selectedPatientDetails",
  "selectedPatientSource",
  "careTakerPatients",
  "careTakerData",
  "doctorData",
];

export const toValidId = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value === "object") {
    return toValidId(value.id ?? value.sponsorid ?? value.sponsor_id ?? null);
  }
  const str = String(value).trim();
  if (
    !str ||
    str === "null" ||
    str === "undefined" ||
    str === "0" ||
    str === "NaN"
  ) {
    return null;
  }
  const num = Number(str);
  return Number.isFinite(num) && num > 0 ? num : null;
};

export const getStoredSponsorProfileId = () => {
  try {
    const rawId = toValidId(localStorage.getItem("sponsorProfileId"));
    if (rawId) return rawId;

    const sponsorDataRaw = localStorage.getItem("sponsorData");
    if (
      sponsorDataRaw &&
      sponsorDataRaw !== "undefined" &&
      sponsorDataRaw !== "null"
    ) {
      const parsed = JSON.parse(sponsorDataRaw);
      return toValidId(parsed?.id);
    }
  } catch (error) {
    console.error("Error reading stored sponsor profile ID:", error);
  }
  return null;
};

export const getStoredSponsorPatientIds = () => {
  const ids = new Set();
  try {
    const rawIds = localStorage.getItem("sponsorPatientIds");
    if (rawIds && rawIds !== "undefined" && rawIds !== "null") {
      const parsed = JSON.parse(rawIds);
      if (Array.isArray(parsed)) {
        parsed.forEach((id) => {
          const valid = toValidId(id);
          if (valid) ids.add(valid);
        });
      }
    }

    const rawPatients = localStorage.getItem("sponsorPatientData");
    if (rawPatients && rawPatients !== "undefined" && rawPatients !== "null") {
      const parsedPatients = JSON.parse(rawPatients);
      if (Array.isArray(parsedPatients)) {
        parsedPatients.forEach((patient) => {
          const valid = toValidId(patient?.id);
          if (valid) ids.add(valid);
        });
      }
    }
  } catch (error) {
    console.error("Error reading stored sponsor patient IDs:", error);
  }
  return Array.from(ids);
};

export const resolveSponsorProfileFromList = (sponsorsList, user) => {
  if (!Array.isArray(sponsorsList) || !user) return null;
  const userId = toValidId(user.id);
  const username = user.username ? String(user.username).trim() : null;

  return (
    sponsorsList.find(
      (sponsor) =>
        (userId && toValidId(sponsor?.user?.id ?? sponsor?.user) === userId) ||
        (username && sponsor?.user?.username === username),
    ) || null
  );
};

export const persistSponsorProfile = (sponsorProfile) => {
  const id = toValidId(sponsorProfile?.id);
  if (!id) return null;
  try {
    localStorage.setItem("sponsorData", JSON.stringify(sponsorProfile));
    localStorage.setItem("sponsorProfileId", String(id));
  } catch (error) {
    console.error("Error persisting sponsor profile:", error);
  }
  return id;
};

export const isPatientOwnedBySponsor = (
  patient,
  sponsorProfileId,
  allowMissingSponsorField = false,
) => {
  const validSponsorId = toValidId(sponsorProfileId);
  if (!validSponsorId || !patient) return false;

  const patientSponsorId = toValidId(
    patient?.sponsor?.id ??
      patient?.sponsor ??
      patient?.sponsorid ??
      patient?.sponsor_id,
  );

  if (patientSponsorId !== null) {
    return patientSponsorId === validSponsorId;
  }

  return Boolean(allowMissingSponsorField);
};

export const filterSponsorPatients = (
  patients,
  sponsorProfileId,
  allowMissingSponsorField = false,
) => {
  const validSponsorId = toValidId(sponsorProfileId);
  if (!validSponsorId || !Array.isArray(patients)) return [];
  return patients.filter((patient) =>
    isPatientOwnedBySponsor(patient, validSponsorId, allowMissingSponsorField),
  );
};

export const isSponsorAppointment = (
  appt,
  sponsorProfileId,
  ownedPatientIds = [],
) => {
  const validSponsorId = toValidId(sponsorProfileId);
  if (!validSponsorId || !appt) return false;

  const apptSponsorId = toValidId(
    appt?.sponsor?.id ??
      appt?.sponsor ??
      appt?.sponsorid ??
      appt?.sponsor_id,
  );
  const patientSponsorId = toValidId(
    appt?.patient?.sponsor?.id ??
      appt?.patient?.sponsor ??
      appt?.patient?.sponsorid ??
      appt?.patient?.sponsor_id,
  );
  const patientId = toValidId(appt?.patient?.id ?? appt?.patient);

  const ownedSet = new Set(
    (Array.isArray(ownedPatientIds) ? ownedPatientIds : [])
      .map((id) => toValidId(id))
      .filter(Boolean),
  );

  // If the patient record has an explicit sponsor link, that sponsor must match.
  if (patientSponsorId !== null) {
    return patientSponsorId === validSponsorId;
  }

  // If the patient belongs to the sponsor's owned patient list, allow.
  if (patientId !== null && ownedSet.size > 0 && ownedSet.has(patientId)) {
    return true;
  }

  // Fallback to the appointment's direct sponsor FK when patient.sponsor is absent.
  if (apptSponsorId !== null) {
    return apptSponsorId === validSponsorId;
  }

  return false;
};

export const filterSponsorAppointments = (
  appointments,
  sponsorProfileId,
  ownedPatientIds = [],
) => {
  const validSponsorId = toValidId(sponsorProfileId);
  if (!validSponsorId || !Array.isArray(appointments)) return [];
  return appointments.filter((appt) =>
    isSponsorAppointment(appt, validSponsorId, ownedPatientIds),
  );
};

export const clearRoleSessionStorage = () => {
  try {
    ROLE_SESSION_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error("Error clearing role session storage:", error);
  }
};

