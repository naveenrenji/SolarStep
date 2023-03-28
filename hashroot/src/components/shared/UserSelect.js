import React, { useState } from "react";
import { components } from "react-select";
import AsyncSelect from "react-select/async";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";

import { searchUsersApi } from "../../api/users";
import { USER_ROLES } from "../../constants";

const CustomOption = (props) => (
  <div ref={props.innerRef} {...props.innerProps}>
    <div style={{ padding: "8px" }}>
      <p style={{ marginBottom: 0 }}>{props.data.email}</p>
      <small style={{ color: "grey" }}>{props.data.label}</small>
    </div>
  </div>
);

const NoOptionsMessage = (props) => {
  return (
    <components.NoOptionsMessage {...props}>
      <Form.Text
        className={
          props?.selectProps?.inputValue?.length >= 3
            ? "text-secondary"
            : "text-muted"
        }
      >
        {props?.selectProps?.inputValue?.length >= 3
          ? "No users"
          : "Type at least 3 characters to search"}
      </Form.Text>
    </components.NoOptionsMessage>
  );
};

const LoadingMessage = (props) => {
  return (
    <div {...props.innerProps} style={props.getStyles("loadingMessage", props)}>
      <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
        variant="light"
      />
      &nbsp;
      {props.children}
    </div>
  );
};

const UserSelect = ({
  roles = Object.values(USER_ROLES),
  onSelect,
  disabled = false,
}) => {
  const [value, setValue] = useState();

  const getUsersBySearch = async (inputString) => {
    try {
      if (inputString.length < 3) {
        return [];
      }
      const users = await searchUsersApi({
        text: inputString,
        roles,
      });

      return users.map((opt) => ({
        label: `${opt.firstName} ${opt.lastName}`,
        email: opt.email,
        value: opt._id,
      }));
    } catch (error) {
      return [];
    }
  };

  return (
    <AsyncSelect
      isClearable
      placeholder="Select a user"
      loadOptions={getUsersBySearch}
      components={{ LoadingMessage, Option: CustomOption, NoOptionsMessage }}
      value={value}
      onChange={(opt) => {
        setValue(opt);
        onSelect && onSelect(opt);
      }}
      isDisabled={disabled}
    />
  );
};

export default UserSelect;
