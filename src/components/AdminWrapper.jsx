import { useState } from "react";
import RecipePage from "../pages/RecipePage";
import useAdminAuth from "../components/useAdminAuth";

function AdminWrapper() {
  const [passcode, setPasscode] = useState("");
  const { authorized, login, logout } = useAdminAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(passcode);
    if (!success) alert("Incorrect passcode");
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

  return (
    <div>
      <button onClick={logout} className="logout-button">Logout</button>
      <RecipePage isAdmin={true} />
    </div>
  );
}

export default AdminWrapper;
