import React, { forwardRef } from "react";

const contact = forwardRef(({ contact }, ref) => {
  const { id, phone, country } = contact;
  return (
    <li ref={ref} className="list-group-item">
      <b>ID: {id} </b> Number: {phone}
      <br />
      <small>{country.name}</small>
    </li>
  );
});

export default contact;
