import { useState, useEffect } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../Firebase";
import imageCompression from "browser-image-compression"; 

function RecipeForm({ onAddRecipe, editingRecipe }) {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState(null);       
  const [imageUrl, setImageUrl] = useState("");    
  const [country, setCountry] = useState("");
  const [mealType, setMealType] = useState("");
  const [blogPost, setBlogPost] = useState("");

  useEffect(() => {
    if (editingRecipe) {
      setTitle(editingRecipe.title || "");
      setIngredients(editingRecipe.ingredients || "");
      setInstructions(editingRecipe.instructions || "");
      setImageUrl(editingRecipe.image || "");
      setCountry(editingRecipe.country || "");
      setMealType(editingRecipe.mealType || "");
      setBlogPost(editingRecipe.blogPost || "");
      setImage(null);
    } else {
      setTitle("");
      setIngredients("");
      setInstructions("");
      setImage(null);
      setImageUrl("");
      setCountry("");
      setMealType("");
      setBlogPost("");
    }
  }, [editingRecipe]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      setImage(compressedFile); 
      setImageUrl(URL.createObjectURL(compressedFile)); 
    } catch (error) {
      console.error("Image compression failed:", error);
      alert("Failed to compress image. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalImageUrl = imageUrl;

    try {
      if (image) {
        const fileName = image.name?.split(".")[0] || "recipe";
        const imageRef = ref(storage, `recipes/${fileName}-${Date.now()}.jpg`);

        await uploadBytes(imageRef, image);
        finalImageUrl = await getDownloadURL(imageRef);
      }

      if (!finalImageUrl) {
        return alert("Please upload an image");
      }

      if (!title.trim()) {
        return alert("Please enter a title");
      }

      const newRecipe = {
        title,
        ingredients,
        instructions,
        image: finalImageUrl,
        country,
        mealType,
        blogPost,
        ...(editingRecipe?.id && { id: editingRecipe.id }),
      };

      onAddRecipe(newRecipe);

      
      setTitle("");
      setIngredients("");
      setInstructions("");
      setImage(null);
      setImageUrl("");
      setCountry("");
      setMealType("");
      setBlogPost("");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed. Please try again.");
    }
  };

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="recipe-title-input"
        />
      </label>

      <label>
        Ingredients:
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
        />
      </label>

      <label>
        Instructions:
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          required
        />
      </label>

      <label>
        Country of Origin:
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="e.g., Italy"
        />
      </label>

      <label>
        Meal Type:
        <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
          <option value="">Select meal type</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Brunch">Brunch</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Dessert">Dessert</option>
          <option value="Snack">Snack</option>
          <option value="Other">Other</option>
        </select>
      </label>

      <label>
        Blog Post:
        <textarea
          value={blogPost}
          onChange={(e) => setBlogPost(e.target.value)}
          placeholder="Write a blog-style note, story, or description..."
          rows={6}
        />
      </label>

      <label className="upload-label">
        Upload Image:
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required={!editingRecipe || !imageUrl}
        />
      </label>

      {imageUrl && (
        <div>
          <p>{image ? "New image selected:" : "Current image:"}</p>
          <img
            src={imageUrl}
            alt="Preview"
            style={{ maxWidth: "200px", marginTop: "10px" }}
            loading="lazy"
          />
        </div>
      )}

      <button type="submit">
        {editingRecipe ? "Update Recipe" : "Add Recipe"}
      </button>
    </form>
  );
}

export default RecipeForm;
