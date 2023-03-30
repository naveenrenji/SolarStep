import React from "react";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Stack from "react-bootstrap/Stack";

import { USER_ROLES } from "../../constants";

import UserSelect from "./UserSelect";

const SelectUserOptsBody = ({
  selectedUserOpts,
  removeOption,
  onNewOptionAdd,
  roles = Object.values(USER_ROLES),
  canEdit,
}) => {
  const [newOptionOpen, setNewOptionOpen] = React.useState(false);
  return (
    <ListGroup variant="flush">
      {selectedUserOpts.map((userOpt) => (
        <ListGroup.Item key={userOpt.value}>
          <Stack gap={3}>
            <UserSelect value={userOpt} disabled />
            {canEdit && (
              <Button variant="link" onClick={() => removeOption(userOpt)}>
                Remove
              </Button>
            )}
          </Stack>
        </ListGroup.Item>
      ))}
      {canEdit ? (
        newOptionOpen ? (
          <ListGroup.Item>
            <Stack gap={3}>
              <UserSelect
                onSelect={(opt) => {
                  onNewOptionAdd(opt);
                  setNewOptionOpen(false);
                }}
                roles={roles}
              />
              <Button
                className="btn-link"
                variant="link-secondary"
                onClick={() => {
                  setNewOptionOpen(false);
                }}
              >
                Close
              </Button>
            </Stack>
          </ListGroup.Item>
        ) : (
          <Button variant="link" onClick={() => setNewOptionOpen(true)}>
            Add New
          </Button>
        )
      ) : (
        <></>
      )}
    </ListGroup>
  );
};

export default SelectUserOptsBody;
