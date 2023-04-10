export const USER_LOCAL_STORAGE_KEY = "solar_step_user";

export const USER_ROLES = {
  ADMIN: "Admin",
  CUSTOMER: "Customer",
  SALES_REP: "Sales Rep",
  GENERAL_CONTRACTOR: "General Contractor",
  WORKER: "Worker",
};

export const PROJECT_STATUS_KEYS = {
  CREATED: "CREATED",
  READY_TO_BE_ASSIGNED_TO_GC: "READY_TO_BE_ASSIGNED_TO_GC",
  ASSIGNED_TO_GC: "ASSIGNED_TO_GC",
  GC_ACCEPTED: "GC_ACCEPTED",
  ON_SITE_INSPECTION_SCHEDULED: "ON_SITE_INSPECTION_SCHEDULED",
  ON_SITE_INSPECTION_IN_PROGRESS: "ON_SITE_INSPECTION_IN_PROGRESS",
  UPDATING_PROPOSAL: "UPDATING_PROPOSAL",
  REVIEWING_PROPOSAL: "REVIEWING_PROPOSAL",
  READY_FOR_INSTALLATION: "READY_FOR_INSTALLATION",
  INSTALLATION_STARTED: "INSTALLATION_STARTED",
  VALIDATING_PERMITS: "VALIDATING_PERMITS",
  CLOSING_OUT: "CLOSING_OUT",
  COMPLETED: "COMPLETED",
  REJECTED: "REJECTED",
};

export const PROJECT_STATUSES = {
  CREATED: "Created",
  READY_TO_BE_ASSIGNED_TO_GC: "Ready to be assigned to GC",
  ASSIGNED_TO_GC: "Assigned to GC",
  GC_ACCEPTED: "GC Accepted",
  ON_SITE_INSPECTION_SCHEDULED: "On-site Inspection Scheduled",
  ON_SITE_INSPECTION_IN_PROGRESS: "On-site Inspection In-progress",
  UPDATING_PROPOSAL: "Updating Proposal",
  REVIEWING_PROPOSAL: "Reviewing Proposal",
  READY_FOR_INSTALLATION: "Ready for Installation",
  INSTALLATION_STARTED: "Installation Started",
  VALIDATING_PERMITS: "Validating Permits",
  CLOSING_OUT: "Closing Out",
  COMPLETED: "Completed",
};

export const TASK_STATUSES = {
  TO_DO: "To Do",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

export const PROJECT_UPLOAD_TYPES = {
  contract: "contract",
  permit: "permit",
  inspection: "inspection",
  invoice: "invoice",
  other: "other",
};
