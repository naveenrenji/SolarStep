import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

import { USER_ROLES } from "../../constants";
import SelectUserOptsBody from "./SelectUserOptsBody";

const UserOptsSelectionModal = ({
  show,
  onClose,
  userOpts,
  onUserOptsChange,
  roles = Object.values(USER_ROLES),
}) => {
  const [selectedUserOpts, setSelectedUserOpts] = React.useState(
    userOpts || []
  );

  const onNewOptionAdd = (opt) => {
    if (!opt) {
      return;
    }
    if (selectedUserOpts.map(({ value }) => value).includes(opt?.value)) {
      toast("User already added", { type: toast.TYPE.INFO });
      return;
    }

    setSelectedUserOpts((prevSelectedUserOpts) => [
      ...prevSelectedUserOpts,
      opt,
    ]);
  };

  const removeOption = (opt) => {
    setSelectedUserOpts((prevSelectedUserOpts) =>
      prevSelectedUserOpts.filter((prevOpt) => prevOpt.value !== opt.value)
    );
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title as="h5">Select Users</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SelectUserOptsBody
          selectedUserOpts={selectedUserOpts}
          removeOption={removeOption}
          onNewOptionAdd={onNewOptionAdd}
          roles={roles}
          canEdit
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => onUserOptsChange(selectedUserOpts)}
        >
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserOptsSelectionModal;
