import React, { useState } from "react";
import { components } from "react-select";
import AsyncSelect from "react-select/async";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";

import { PROJECT_STATUSES } from "../../constants";
import { getPaginatedProjectsApi } from "../../api/projects";

const CustomOption = (props) => (
  <div ref={props.innerRef} {...props.innerProps}>
    <div style={{ padding: "8px" }}>
      <p style={{ marginBottom: 0 }}>{props.data.label}</p>
      {props.data.projectName ? (
        <small style={{ color: "grey" }}>{props.data.projectName}</small>
      ) : (
        <></>
      )}
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

const ProjectSelect = ({
  value: currentValue,
  statuses = [PROJECT_STATUSES.COMPLETED],
  onSelect,
  disabled = false,
}) => {
  const [value, setValue] = useState(currentValue || undefined);

  const getProjectsBySearch = async (inputString) => {
    try {
      if (inputString.length < 3) {
        return [];
      }
      const { projects } = await getPaginatedProjectsApi({
        page: 1,
        search: inputString,
        statuses,
      });

      return projects.map((opt) => ({
        label: opt.projectName || opt._id,
        projectName: opt.projectName,
        value: opt._id,
      }));
    } catch (error) {
      return [];
    }
  };

  return (
    <AsyncSelect
      isClearable
      placeholder="Select a project"
      loadOptions={getProjectsBySearch}
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

export default ProjectSelect;
