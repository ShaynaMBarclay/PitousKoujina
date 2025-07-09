import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";

function ReviewDetailPage() {
  const { id } = useParams();
  const [review, setReview] = useState(null);

  useEffect(() => {
    async function fetchReview() {
      const docRef = doc(db, "reviews", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setReview({ id: docSnap.id, ...docSnap.data() });
      } else {
        setReview(null);
      }
    }
    fetchReview();
  }, [id]);

  if (!review) {
    return <div>Loading review...</div>;
  }

  return (
    <div className="review-detail-page">
      <h1 className="review-title">{review.restaurant}</h1>
      <p className="review-country">Country: {review.country}</p>
      <div className="review-rating">{'⭐'.repeat(review.rating)}</div>
      {review.image && (
        <img
          src={review.image}
          alt={`Image of ${review.restaurant}`}
          className="review-detail-image"
        />
      )}
      <p className="review-text">{review.review}</p>

      <Link to="/reviews" className="back-link">← Back to all reviews</Link>
    </div>
  );
}

export default ReviewDetailPage;
