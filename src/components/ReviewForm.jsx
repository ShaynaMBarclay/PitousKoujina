import { useState, useEffect } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../Firebase";

function ReviewForm({ onAddReview, editingReview, setEditingReview, onCancel }) {
  const [restaurant, setRestaurant] = useState("");
  const [country, setCountry] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (editingReview) {
      setRestaurant(editingReview.restaurant || "");
      setCountry(editingReview.country || "");
      setRating(editingReview.rating || 0);
      setReview(editingReview.review || "");
      setImageUrl(editingReview.image || "");
      setImage(null);
    } else {
      setRestaurant("");
      setCountry("");
      setRating(0);
      setReview("");
      setImage(null);
      setImageUrl("");
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

      if (!restaurant || !country || !rating || !review) {
        alert("Please fill in all required fields.");
        return;
      }

      const newReview = {
        restaurant,
        country,
        rating,
        review,
        image: finalImageUrl || "",
        ...(editingReview?.id && { id: editingReview.id }),
      };

      onAddReview(newReview);

      if (!editingReview) {
        setRestaurant("");
        setCountry("");
        setRating(0);
        setReview("");
        setImage(null);
        setImageUrl("");
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <label>
        Restaurant Name:
        <input
          type="text"
          value={restaurant}
          onChange={(e) => setRestaurant(e.target.value)}
          required
          className="recipe-title-input"
        />
      </label>

      <label>
        Country:
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
          className="recipe-title-input"
        />
      </label>

      <label>
        Rating:
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          required
          className="recipe-title-input"
        >
          <option value={0} disabled>
            Select rating
          </option>
          {[1, 2, 3, 4, 5].map((star) => (
            <option key={star} value={star}>
              {star} Star{star > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </label>

      <label>
        Review:
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
          className="recipe-ingredients-textarea"
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
        <div className="image-preview-container">
          <p>New image selected:</p>
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="image-preview"
          />
        </div>
      )}

      {!image && imageUrl && (
        <div className="image-preview-container">
          <p>Current image:</p>
          <img src={imageUrl} alt="Current" className="image-preview" />
        </div>
      )}

      <div style={{ display: "flex", gap: "10px" }}>
        <button type="submit">
          {editingReview ? "Update Review" : "Add Review"}
        </button>
        {editingReview && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ReviewForm;
