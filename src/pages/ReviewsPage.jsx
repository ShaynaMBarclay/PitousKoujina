import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../Firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import ReviewForm from "../components/ReviewForm";
import LazyImage from "../components/LazyImage";

function ReviewsPage({ isAdmin = false }) {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [filteredReviews, setFilteredReviews] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "reviews"), (snapshot) => {
      const allReviews = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReviews(allReviews);
      setFilteredReviews(allReviews);
    });
    return () => unsubscribe();
  }, []);

  const countries = [
    "All",
    ...Array.from(
      new Set(
        reviews
          .flatMap((r) => [r.dishCountry, r.originCountry])
          .filter(Boolean)
      )
    ),
  ];

  useEffect(() => {
    if (selectedCountry === "All") {
      setFilteredReviews(reviews);
    } else {
      setFilteredReviews(
        reviews.filter(
          (r) =>
            r.dishCountry === selectedCountry || r.originCountry === selectedCountry
        )
      );
    }
  }, [selectedCountry, reviews]);

  const handleAddReview = async (newReview) => {
    try {
      if (newReview.id) {
        const docRef = doc(db, "reviews", newReview.id);
        await updateDoc(docRef, newReview);
      } else {
        await addDoc(collection(db, "reviews"), newReview);
      }
      setShowForm(false);
      setEditingReview(null);
    } catch (err) {
      console.error("Error adding/updating review:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "reviews", id));
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    if (showForm) setEditingReview(null);
  };

  return (
    <div className="reviews-page">
      <h1 className="reviews-heading">Restaurant Reviews</h1>
      <p className="reviews-subheading">Where we've eaten around the world ✈️</p>

      <div style={{ marginBottom: "1rem", textAlign: "center" }}>
        <label htmlFor="countryFilter" style={{ marginRight: "0.5rem", fontWeight: "600", color: "#2e7a6bfd" }}>
          Filter by Country:
        </label>
        <select
          id="countryFilter"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          style={{ padding: "0.3rem 0.5rem", borderRadius: "5px", border: "1.5px solid #2e7a6bfd" }}
        >
          {countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>

      {isAdmin && (
        <>
          <button className="toggle-form-button" onClick={toggleForm}>
            {showForm ? "Close Form" : editingReview ? "Edit Review" : "+ Add Review"}
          </button>
          {showForm && <ReviewForm onAddReview={handleAddReview} editingReview={editingReview} />}
        </>
      )}

      <div className="review-gallery">
        {filteredReviews.map((r) => (
          <Link
            to={`/reviews/${r.id}`}
            className="review-link"
            key={r.id}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="review-card">
              <h3 className="review-title">{r.restaurant}</h3>
              <p style={{ fontSize: "0.9rem", fontWeight: "600", color: "#f702a9e6", margin: "0.25rem 0" }}>
                Dish eaten in: {r.dishCountry || "Unknown"}
              </p>
              <p style={{ fontSize: "0.9rem", fontWeight: "600", color: "#2e7a6bfd", margin: "0.25rem 0" }}>
                Dish originates from: {r.originCountry || "Unknown"}
              </p>
              <div className="review-rating">{"⭐".repeat(r.rating)}</div>

              {r.image && (
                <LazyImage
                  src={r.image}
                  alt={`Image of ${r.restaurant}`}
                  className="review-image"
                />
              )}

              {isAdmin && (
                <div>
                  <button className="edit-button" onClick={(e) => { e.preventDefault(); handleEdit(r); }}>Edit</button>
                  <button className="delete-button" onClick={(e) => { e.preventDefault(); handleDelete(r.id); }}>Delete</button>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ReviewsPage;
