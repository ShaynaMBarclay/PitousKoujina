import { useState } from "react";
import RecipePage from "../pages/RecipePage"; 

const ADMIN_PASSCODE = "ILoveMyWife";

function AdminWrapper() {
  const [passcode, setPasscode] = useState("");
  const [authorized, setAuthorized] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      setAuthorized(true);
    } else {
      alert("Incorrect passcode");
    }
  };

  if (!authorized) {
    return (
      <form onSubmit={handleSubmit} className="admin-login-form">
        <label>
          Enter Admin Passcode:{" "}
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
          />
        </label>
        <button type="submit">Enter</button>
      </form>
    );
  }

  return <RecipePage isAdmin={true} />;
}

export default AdminWrapper;
