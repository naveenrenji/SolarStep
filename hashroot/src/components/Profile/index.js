import React, { useState } from "react";
import RouteHeader from "../shared/RouteHeader";

const Profile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmNewPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle form submission here
  };

  return (
    <div>
      <RouteHeader headerText="Edit Profile" />
      <br/>
      <br/>
      <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column"}}>
        <label style={{marginBottom: "1rem"}}>
          First Name:
          <input type="text" value={firstName} onChange={handleFirstNameChange} style={{marginLeft: "1rem"}} />
        </label>
        <label style={{marginBottom: "1rem"}}>
          Last Name:
          <input type="text" value={lastName} onChange={handleLastNameChange} style={{marginLeft: "1rem"}} />
        </label>
        <label style={{marginBottom: "1rem"}}>
          Old Password:
          <input type="password" value={oldPassword} onChange={handleOldPasswordChange} style={{marginLeft: "1rem"}} />
        </label>
        <label style={{marginBottom: "1rem"}}>
          New Password:
          <input type="password" value={newPassword} onChange={handleNewPasswordChange} style={{marginLeft: "1rem"}} />
        </label>
        <label style={{marginBottom: "1rem"}}>
          Confirm New Password:
          <input type="password" value={confirmNewPassword} onChange={handleConfirmNewPasswordChange} style={{marginLeft: "1rem"}} />
        </label>
        <button type="submit" style={{marginTop: "1rem"}}>Save Changes</button>
      </form>
    </div>
  );
};

export default Profile;
