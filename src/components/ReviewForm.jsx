import { useState, useEffect } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../Firebase";

function ReviewForm({ onAddReview, editingReview }) {
  const [restaurant, setRestaurant] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [dishCountry, setDishCountry] = useState("");
  const [originCountry, setOriginCountry] = useState("");

  useEffect(() => {
    if (editingReview) {
      setRestaurant(editingReview.restaurant || "");
      setReview(editingReview.review || "");
      setRating(editingReview.rating || 0);
      setImageUrl(editingReview.image || "");
      setDishCountry(editingReview.dishCountry || "");
      setOriginCountry(editingReview.originCountry || "");
      setImage(null);
    } else {
      setRestaurant("");
      setReview("");
      setRating(0);
      setImage(null);
      setImageUrl("");
      setDishCountry("");
      setOriginCountry("");
    }
  }, [editingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalImageUrl = imageUrl;

    try {
      if (image) {
        const imageRef = ref(storage, `reviews/${image.name}-${Date.now()}`);
        await uploadBytes(imageRef, image);
        finalImageUrl = await getDownloadURL(imageRef);
      }

      if (!restaurant.trim()) {
        return alert("Please enter a restaurant name");
      }

      if (rating < 1 || rating > 5) {
        return alert("Please provide a rating between 1 and 5");
      }

      const newReview = {
        restaurant,
        review,
        rating,
        image: finalImageUrl,
        dishCountry,
        originCountry,
        ...(editingReview?.id && { id: editingReview.id }),
      };

      onAddReview(newReview);

      // Clear form
      setRestaurant("");
      setReview("");
      setRating(0);
      setImage(null);
      setImageUrl("");
      setDishCountry("");
      setOriginCountry("");
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <label>
        Restaurant:
        <input
          type="text"
          value={restaurant}
          onChange={(e) => setRestaurant(e.target.value)}
          required
          className="review-restaurant-input"
        />
      </label>

      <label>
        Review:
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={4}
        />
      </label>

      <label>
        Rating (1-5):
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          required
          className="review-rating-input"
        />
      </label>

      <label>
        Country where eaten:
        <input
          type="text"
          value={dishCountry}
          onChange={(e) => setDishCountry(e.target.value)}
          placeholder="Where did you eat this dish?"
        />
      </label>

      <label>
        Country of origin:
        <input
          type="text"
          value={originCountry}
          onChange={(e) => setOriginCountry(e.target.value)}
          placeholder="Where is this dish from?"
        />
      </label>

      <label className="upload-label">
        Upload Image:
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required={!editingReview || !imageUrl}
        />
      </label>

      {image && (
        <div>
          <p>New image selected:</p>
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            style={{ maxWidth: "200px", marginTop: "10px" }}
          />
        </div>
      )}

      {!image && imageUrl && (
        <div>
          <p>Current image:</p>
          <img
            src={imageUrl}
            alt="Current"
            style={{ maxWidth: "200px", marginTop: "10px" }}
          />
        </div>
      )}

      <button type="submit">{editingReview ? "Update Review" : "Add Review"}</button>
    </form>
  );
}

export default ReviewForm;
