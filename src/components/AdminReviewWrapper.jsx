import { useState } from "react";
import ReviewsPage from "../pages/ReviewsPage";

const ADMIN_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE;

function AdminReviewWrapper() {
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
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <label>
          Enter Admin Passcode:
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

  return <ReviewsPage isAdmin={true} />;
}

export default AdminReviewWrapper;
