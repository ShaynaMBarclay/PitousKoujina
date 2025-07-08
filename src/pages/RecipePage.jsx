import { useState } from 'react';
import RecipeForm from '../components/RecipeForm';

function RecipePage() {
  const [recipes, setRecipes] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };

  const handleAddRecipe = (newRecipe) => {
    setRecipes([newRecipe, ...recipes]);
  };

  const handleDeleteRecipe = (idToDelete) => {
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== idToDelete));
  };

  return (
    <div className="recipes-page">
      <h1 className="recipes-heading">Pitou's Koujina</h1>
      <h2 className="recipes-smallheading">مرحبا بيك في كوجينتي</h2>

      <button className="toggle-form-button" onClick={toggleForm}>
        {showForm ? 'Close Form' : '+ Add Recipe'}
      </button>

      {showForm && <RecipeForm onAddRecipe={handleAddRecipe} />}

      <div className="recipe-gallery">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <img
              src={recipe.image}
              alt="Recipe"
              className="recipe-image"
              onClick={() => alert(`Show popup for: ${recipe.ingredients}`)} // placeholder
            />
            <button
              className="delete-button"
              onClick={() => handleDeleteRecipe(recipe.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecipePage;
