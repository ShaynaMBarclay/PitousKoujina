import { useState } from 'react';


function RecipeForm({ onAddRecipe }) {
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!image) return alert("Please upload an image");

    const newRecipe = {
      id: Date.now(),
      ingredients,
      instructions,
      image: URL.createObjectURL(image),
    };

    onAddRecipe(newRecipe);

    // Reset form
    setIngredients('');
    setInstructions('');
    setImage(null);
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
          required
        />
      </label>

      <button type="submit">Add Recipe</button>
    </form>
  );
}

export default RecipeForm;
