import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Stack from "react-bootstrap/esm/Stack";
import Form from "react-bootstrap/esm/Form";
import Select from "react-select";
import { LinkContainer } from "react-router-bootstrap";

const SearchAndCreateBar = ({
  searchPlaceholder,
  createButtonText,
  onSearch,
  onCreate,
  createLink,
  options,
}) => {
  const [search, setSearch] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(
      search,
      selectedOptions?.length
        ? selectedOptions.map(({ value }) => value)
        : undefined
    );
  };

  const clearFilters = (e) => {
    e.preventDefault();
    setSearch("");
    setSelectedOptions([]);
    onSearch("", undefined);
  };

  return (
    <div className="mt-3 mb-3 d-sm-flex justify-content-sm-between">
      <Form onSubmit={handleSubmit}>
        <Stack direction="horizontal" gap={3}>
          <Form.Group controlId="searchText">
            <Form.Control
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
          </Form.Group>
          {options?.length ? (
            <Form.Group controlId="select">
              <Select
                closeMenuOnSelect={false}
                defaultValue={[]}
                isMulti
                options={options}
                value={selectedOptions}
                onChange={setSelectedOptions}
              />
            </Form.Group>
          ) : (
            <></>
          )}
          <Button variant="primary" onClick={handleSubmit}>
            Search
          </Button>
          <Button variant="link" onClick={clearFilters}>
            Clear filters
          </Button>
        </Stack>
      </Form>
      {createLink ? (
        <LinkContainer to={createLink}>
          <Button variant="link">{createButtonText}</Button>
        </LinkContainer>
      ) : (
        <Button variant="primary" onClick={onCreate}>
          {createButtonText}
        </Button>
      )}
    </div>
  );
};

export default SearchAndCreateBar;
