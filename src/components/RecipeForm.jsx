import { useState, useEffect } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../Firebase";

function RecipeForm({ onAddRecipe, editingRecipe }) {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [country, setCountry] = useState('');
  const [mealType, setMealType] = useState('');
  const [blogPost, setBlogPost] = useState('');

  useEffect(() => {
    if (editingRecipe) {
      setTitle(editingRecipe.title || "");
      setIngredients(editingRecipe.ingredients || '');
      setInstructions(editingRecipe.instructions || '');
      setImageUrl(editingRecipe.image || '');
      setCountry(editingRecipe.country || '');
      setMealType(editingRecipe.mealType || '');
      setBlogPost(editingRecipe.blogPost || '');
      setImage(null);
    } else {
      setTitle("");
      setIngredients('');
      setInstructions('');
      setImage(null);
      setImageUrl('');
      setCountry('');
      setMealType('');
      setBlogPost('');
    }
  }, [editingRecipe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalImageUrl = imageUrl;

    try {
      if (image) {
        const imageRef = ref(storage, `recipes/${image.name}-${Date.now()}`);
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
      setIngredients('');
      setInstructions('');
      setImage(null);
      setImageUrl('');
      setCountry('');
      setMealType('');
      setBlogPost('');
    } catch (error) {
      console.error("Upload failed:", error);
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

      {/* ✅ New Blog Post Field */}
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
          onChange={(e) => setImage(e.target.files[0])}
          required={!editingRecipe || !imageUrl}
        />
      </label>

      {image && (
        <div>
          <p>New image selected:</p>
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            style={{ maxWidth: '200px', marginTop: '10px' }}
          />
        </div>
      )}
      {!image && imageUrl && (
        <div>
          <p>Current image:</p>
          <img
            src={imageUrl}
            alt="Current"
            style={{ maxWidth: '200px', marginTop: '10px' }}
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
