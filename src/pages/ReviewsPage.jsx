import { useEffect, useState } from "react";
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
      if (editingReview) {
        // Update existing review
        const docRef = doc(db, "reviews", editingReview.id);
        await updateDoc(docRef, newReview);
        setEditingReview(null);
      } else {
        // Add new review
        await addDoc(collection(db, "reviews"), newReview);
      }
      setShowForm(false);
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

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    if (showForm) setEditingReview(null); 
  };

  const handleEditClick = (review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setShowForm(false);
  };

  return (
    <div className="reviews-page">
      <h1 className="reviews-heading">Restaurant Reviews</h1>
      <p className="reviews-subheading">Where we've eaten around the world ✈️</p>

      {isAdmin && (
        <>
          <button className="toggle-form-button" onClick={toggleForm}>
            {showForm ? "Close Form" : (editingReview ? "Edit Review" : "+ Add Review")}
          </button>

          {showForm && (
            <ReviewForm
              onAddReview={handleAddReview}
              editingReview={editingReview}
              onCancel={handleCancelEdit}
            />
          )}
        </>
      )}

      <div className="review-gallery">
        {reviews.map((r) => (
          <div key={r.id} className="review-card">
            <h3 className="review-title">{r.restaurant}</h3>
            <p className="review-country">Country: {r.country}</p>
            <div className="review-rating">{'⭐'.repeat(r.rating)}</div>

            {r.image && (
              <img
                src={r.image}
                alt={`Image of ${r.restaurant}`}
                className="review-image"
              />
            )}

            <p className="review-text">{r.review}</p>

            {isAdmin && (
              <div>
                <button
                  className="edit-button"
                  onClick={() => handleEditClick(r)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(r.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewsPage;
