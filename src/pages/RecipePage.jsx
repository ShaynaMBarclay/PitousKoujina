import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase";
import RecipeForm from '../components/RecipeForm';
import LazyImage from "../components/LazyImage";

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Brunch", "Dessert", "Snack"];

function RecipePage({ isAdmin }) {
  const [recipes, setRecipes] = useState([]);
  const [filters, setFilters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "recipes"), (snapshot) => {
      setRecipes(snapshot.docs.map(doc => {
        const data = doc.data();
        const { id: _ignoredId, ...rest } = data;
        return {
          id: doc.id,
          ...rest
        };
      }));
    });
    return () => unsubscribe();
  }, []);

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setEditingRecipe(null); 
  };

  const toggleFilter = (type) => {
    setFilters((prev) =>
      prev.includes(type) ? prev.filter((f) => f !== type) : [...prev, type]
    );
  };

  const filteredRecipes =
    filters.length === 0
      ? recipes
      : recipes.filter((recipe) => filters.includes(recipe.mealType));

  const handleAddRecipe = async (newRecipe) => {
    try {
      if (!isAdmin) return;

      if (newRecipe.id) {
        console.log("✏️ Updating recipe with ID:", newRecipe.id);
        const docRef = doc(db, "recipes", newRecipe.id);
        const { id, ...recipeWithoutId } = newRecipe; 
        await updateDoc(docRef, recipeWithoutId);
        setEditingRecipe(null);
      } else {
        console.log("➕ Adding new recipe");
        const { id, ...recipeWithoutId } = newRecipe;
        await addDoc(collection(db, "recipes"), recipeWithoutId);
      }

      setShowForm(false);
    } catch (error) {
      console.error("Error adding/editing recipe: ", error);
    }
  };

  const handleDeleteRecipe = async (idToDelete) => {
    try {
      if (!isAdmin) return;
      console.log("🗑️ Deleting recipe with ID:", idToDelete);
      const docRef = doc(db, "recipes", idToDelete);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting recipe: ", error);
    }
  };

  const handleEditRecipe = (recipe) => {
    if (!isAdmin) return; 
    console.log("✏️ Editing recipe:", recipe);
    setEditingRecipe(recipe);
    setShowForm(true);
  };

  return (
    <div className="recipes-page">
      <h1 className="recipes-heading">La Cucina di Shay</h1>
      <h2 className="recipes-smallheading">Tra tradizione e fantasia, sapori fatti con amore.</h2>

      <div className="filter-buttons">
        {mealTypes.map((type) => (
          <button
            key={type}
            onClick={() => toggleFilter(type)}
            className={filters.includes(type) ? "filter-active" : ""}
            type="button"
          >
            {type}
          </button>
        ))}
      </div>

      {isAdmin && (
        <button className="toggle-form-button" onClick={toggleForm}>
          {showForm ? 'Close Form' : '+ Add Recipe'}
        </button>
      )}

      {isAdmin && showForm && (
        <RecipeForm
          onAddRecipe={handleAddRecipe}
          editingRecipe={editingRecipe}
        />
      )}

      <div className="recipe-gallery">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">

            <LazyImage
              src={recipe.image}
              alt={recipe.title || "Recipe"}
              className="recipe-image"
              onClick={() => navigate(`/recipe/${recipe.id}`)}
            />

            {isAdmin && (
              <>
                <button
                  className="edit-button"
                  onClick={() => handleEditRecipe(recipe)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteRecipe(recipe.id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecipePage;
