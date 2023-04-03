import React from "react";
import DatePicker from "react-datepicker";
import Form from "react-bootstrap/Form";

const FormControlDatePicker = React.forwardRef(({ value, onClick }, ref) => (
  <Form.Control
    onClick={onClick}
    ref={ref}
    value={value}
    type="input"
    autoComplete="off"
    placeholder="Select Date"
  />
));

const FormDatePicker = ({
  value,
  onChange,
  minDate = undefined,
  placeholderText = "Select a date",
  ...rest
}) => {
  return (
    <DatePicker
      value={value}
      selected={value}
      onChange={(date) => onChange(date)}
      minDate={minDate}
      customInput={<FormControlDatePicker />}
      placeholderText={placeholderText}
      {...rest}
    />
  );
};

export default FormDatePicker;
