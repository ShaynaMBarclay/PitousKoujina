import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase";
import RecipeForm from '../components/RecipeForm';

function RecipePage() {
  const [recipes, setRecipes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);

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

  const handleAddRecipe = async (newRecipe) => {
    try {
      console.log("🧪 Recipe passed to handler: ", newRecipe);

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
      console.log("🗑️ Deleting recipe with ID:", idToDelete);
      const docRef = doc(db, "recipes", idToDelete);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting recipe: ", error);
    }
  };

  const handleEditRecipe = (recipe) => {
    console.log("✏️ Editing recipe:", recipe);
    setEditingRecipe(recipe);
    setShowForm(true);
  };

  return (
    <div className="recipes-page">
      <h1 className="recipes-heading">Pitou's Koujina</h1>
      <h2 className="recipes-smallheading">مرحبا بيك في كوجينتي</h2>

      <button className="toggle-form-button" onClick={toggleForm}>
        {showForm ? 'Close Form' : '+ Add Recipe'}
      </button>

      {showForm && (
        <RecipeForm
          onAddRecipe={handleAddRecipe}
          editingRecipe={editingRecipe}
        />
      )}

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
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecipePage;
