import { useEffect, useState } from "react";
import { db } from "../Firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc 
} from "firebase/firestore";
import { Link } from "react-router-dom";
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
      const { id, ...rest } = newReview;
      await updateDoc(docRef, rest);
      setEditingReview(null); 
    } else {
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

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const toggleForm = () => {
    if (showForm) {
      setEditingReview(null);
    }
    setShowForm((prev) => !prev);
  };

  return (
    <div className="reviews-page">
      <h1 className="reviews-heading">Restaurant Reviews</h1>
      <p className="reviews-subheading">Where we've eaten around the world ✈️</p>

      {isAdmin && (
  <>
    <button className="toggle-form-button" onClick={toggleForm}>
      {showForm ? "Close Form" : editingReview ? "Cancel Edit" : "+ Add Review"}
    </button>

    {showForm && (
      <ReviewForm
        onAddReview={handleAddReview}
        editingReview={editingReview}
        setEditingReview={setEditingReview}
      />
    )}
  </>
)}

      <div className="review-gallery">
        {reviews.map((r) => (
          <div key={r.id} className="review-card">
            <Link to={`/reviews/${r.id}`} className="review-link">
              {r.image && (
                <img
                  src={r.image}
                  alt={`Image of ${r.restaurant}`}
                  className="review-image"
                />
              )}
              <h3 className="review-title">{r.restaurant}</h3>
              <div className="review-rating">{'⭐'.repeat(r.rating)}</div>
            </Link>

            {isAdmin && (
              <div className="review-buttons">
               <button
               className="edit-button"
               onClick={() => {
               setEditingReview(r);
               setShowForm(true);
               }}
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
