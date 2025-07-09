import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";

function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const docRef = doc(db, "recipes", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRecipe({ id: docSnap.id, ...docSnap.data() });
        } else {
          setRecipe(null);
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [id]);

  if (loading) return <p className="loading-text">Loading recipe...</p>;

  if (!recipe) return <p className="error-text">Recipe not found.</p>;

  return (
    <div className="recipe-detail-page">
      <div className="recipe-nav-buttons">
        <button onClick={() => document.getElementById("details")?.scrollIntoView({ behavior: "smooth" })}>
          Details
        </button>
        <button onClick={() => document.getElementById("ingredients")?.scrollIntoView({ behavior: "smooth" })}>
          Ingredients
        </button>
        <button onClick={() => document.getElementById("instructions")?.scrollIntoView({ behavior: "smooth" })}>
          Instructions
        </button>
        {recipe.blogPost && (
          <button onClick={() => document.getElementById("blog")?.scrollIntoView({ behavior: "smooth" })}>
            Blog Post
          </button>
        )}
      </div>

      <h1 className="recipe-title">{recipe.title || "Recipe"}</h1>

      <div className="recipe-image-container">
        <img
          src={recipe.image}
          alt={recipe.title || "Recipe image"}
          className="recipe-detail-image"
        />
      </div>

      <section className="recipe-section" id="details">
        <h3 className="section-title">Details</h3>
        <div className="recipe-details">
          <p><strong>Country of Origin:</strong> {recipe.country || "Unknown"}</p>
          <p><strong>Meal Type:</strong> {recipe.mealType || "Various"}</p>
        </div>
      </section>

      <section className="recipe-section" id="ingredients">
        <h3 className="section-title">Ingredients</h3>
        <pre className="recipe-text">{recipe.ingredients}</pre>
      </section>

      <section className="recipe-section" id="instructions">
        <h3 className="section-title">Instructions</h3>
        <pre className="recipe-text">{recipe.instructions}</pre>
      </section>

      {recipe.blogPost && (
        <section className="recipe-section" id="blog">
          <h3 className="section-title blog-post-title">Blog Post</h3>
          <article className="blog-post-text">
            {recipe.blogPost.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </article>
        </section>
      )}

      <Link to="/" className="back-link">
        ← Back to all recipes
      </Link>
    </div>
  );
}

export default RecipeDetailPage;
