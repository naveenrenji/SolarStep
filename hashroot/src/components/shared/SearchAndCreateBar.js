import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Stack from "react-bootstrap/esm/Stack";
import Form from "react-bootstrap/esm/Form";
import { LinkContainer } from "react-router-bootstrap";

const SearchAndCreateBar = ({
  searchPlaceholder,
  createButtonText,
  onSearch,
  onCreate,
  createLink,
}) => {
  const [search, setSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(search);
  };

  return (
    <div className="mt-3 mb-3 d-sm-flex justify-content-sm-between">
      <Form onSubmit={handleSubmit}>
        <Stack direction="horizontal" gap={3}>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
          </Form.Group>
          <Button variant="primary" onClick={handleSubmit}>
            Search
          </Button>
        </Stack>
      </Form>
      {createLink ? (
        <LinkContainer to={createLink}>
          <Button variant="primary">{createButtonText}</Button>
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
