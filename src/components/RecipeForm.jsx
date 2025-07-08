import { useState, useEffect } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../Firebase";

function RecipeForm({ onAddRecipe, editingRecipe }) {
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (editingRecipe) {
      setIngredients(editingRecipe.ingredients || '');
      setInstructions(editingRecipe.instructions || '');
      setImageUrl(editingRecipe.image || '');
      setImage(null);
    } else {
      setIngredients('');
      setInstructions('');
      setImage(null);
      setImageUrl('');
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

      const newRecipe = {
        ingredients,
        instructions,
        image: finalImageUrl,
        ...(editingRecipe?.id && { id: editingRecipe.id }),
      };

      console.log("Submitting recipe:", newRecipe);

      onAddRecipe(newRecipe);

      setIngredients('');
      setInstructions('');
      setImage(null);
      setImageUrl('');
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
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

      <button type="submit">{editingRecipe ? "Update Recipe" : "Add Recipe"}</button>
    </form>
  );
}

export default RecipeForm;
