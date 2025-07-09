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

function ReviewsPage({ isAdmin = false }) {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "reviews"), (snapshot) => {
      setReviews(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

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

      {isAdmin && (
        <>
          <button className="toggle-form-button" onClick={toggleForm}>
            {showForm ? "Close Form" : editingReview ? "Edit Review" : "+ Add Review"}
          </button>

          {showForm && (
            <ReviewForm onAddReview={handleAddReview} editingReview={editingReview} />
          )}
        </>
      )}

      <div className="review-gallery">
        {reviews.map((r) => (
          <Link
            to={`/reviews/${r.id}`}
            className="review-link"
            key={r.id}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="review-card">
              <h3 className="review-title">{r.restaurant}</h3>
              <div className="review-rating">{'⭐'.repeat(r.rating)}</div>
              {r.image && (
                <img
                  src={r.image}
                  alt={`Image of ${r.restaurant}`}
                  className="review-image"
                />
              )}

              {isAdmin && (
                <div>
                  <button
                    className="edit-button"
                    onClick={(e) => {
                      e.preventDefault(); 
                      handleEdit(r);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={(e) => {
                      e.preventDefault(); 
                      handleDelete(r.id);
                    }}
                  >
                    Delete
                  </button>
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
