import http from "./http";
import { PROJECT_STATUS_KEYS } from "../constants";

const moveToOnSiteInspectionScheduledApi = async (
  projectId,
  { onSiteInspectionDate }
) => {
  const {
    data: { project },
  } = await http.patch(
    `/projects/${projectId}/status/${PROJECT_STATUS_KEYS.ON_SITE_INSPECTION_SCHEDULED}`,
    {
      onSiteInspectionDate,
    }
  );

  return project;
};

const moveToOnSiteInspectionInProgressApi = async (
  projectId,
  { onSiteInspectionStartedOn }
) => {
  const {
    data: { project },
  } = await http.patch(
    `/projects/${projectId}/status/${PROJECT_STATUS_KEYS.ON_SITE_INSPECTION_IN_PROGRESS}}`,
    {
      onSiteInspectionStartedOn,
    }
  );

  return project;
};

export {
  moveToOnSiteInspectionScheduledApi,
  moveToOnSiteInspectionInProgressApi,
};
