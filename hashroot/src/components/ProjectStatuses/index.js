import React from "react";
import { PROJECT_STATUSES } from "../../constants";

import Created from "./Created";
import useProject from "../../hooks/useProject";
import ReadyToBeAssignedToGC from "./ReadyToBeAssignedToGC";
import AssignedToGC from "./AssignedToGC";
import GCAccepted from "./GCAccepted";
import OnSiteInspectionScheduled from "./OnSiteInspectionScheduled";
import OnSiteInspectionInProgress from "./OnSiteInspectionInProgress";
import ReadyForInstallation from "./ReadyForInstallation";
import InstallationStarted from "./InstallationStarted";
import ValidatingPermits from "./ValidatingPermits";
import ClosingOut from "./ClosingOut";
import Completed from "./Completed";
import UpdatingProposal from "./UpdatingProposal";
import ReviewingProposal from "./ReviewingProposal";

const ProjectStatuses = () => {
  const { project } = useProject();

  switch (project.status) {
    case PROJECT_STATUSES.CREATED:
      return <Created />;
    case PROJECT_STATUSES.READY_TO_BE_ASSIGNED_TO_GC:
      return <ReadyToBeAssignedToGC />;
    case PROJECT_STATUSES.ASSIGNED_TO_GC:
      return <AssignedToGC />;
    case PROJECT_STATUSES.GC_ACCEPTED:
      return <GCAccepted />;
    case PROJECT_STATUSES.ON_SITE_INSPECTION_SCHEDULED:
      return <OnSiteInspectionScheduled />;
    case PROJECT_STATUSES.ON_SITE_INSPECTION_IN_PROGRESS:
      return <OnSiteInspectionInProgress />;
    case PROJECT_STATUSES.UPDATING_PROPOSAL:
      return <UpdatingProposal />;
    case PROJECT_STATUSES.REVIEWING_PROPOSAL:
      return <ReviewingProposal />;
    case PROJECT_STATUSES.READY_FOR_INSTALLATION:
      return <ReadyForInstallation />;
    case PROJECT_STATUSES.INSTALLATION_STARTED:
      return <InstallationStarted />;
    case PROJECT_STATUSES.VALIDATING_PERMITS:
      return <ValidatingPermits />;
    case PROJECT_STATUSES.CLOSING_OUT:
      return <ClosingOut />;
    case PROJECT_STATUSES.COMPLETED:
      return <Completed />;

    default:
      return <div>Status Not Defined</div>;
  }
};

export default ProjectStatuses;
