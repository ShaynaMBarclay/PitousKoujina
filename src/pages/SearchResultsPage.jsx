import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import LazyImage from "../components/LazyImage";

function SearchResultsPage() {
  const [recipeResults, setRecipeResults] = useState([]);
  const [reviewResults, setReviewResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query")?.toLowerCase() || "";

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);

      const recipeSnap = await getDocs(collection(db, "recipes"));
      const reviewSnap = await getDocs(collection(db, "reviews"));

      const recipes = recipeSnap.docs
        .map(doc => ({ ...doc.data(), id: doc.id }))
        .filter(item =>
          item.title?.toLowerCase().includes(query) ||
          item.ingredients?.toLowerCase().includes(query) ||
          item.instructions?.toLowerCase().includes(query) ||
          item.country?.toLowerCase().includes(query) ||        
          item.mealType?.toLowerCase().includes(query) 
        );

      const reviews = reviewSnap.docs
        .map(doc => ({ ...doc.data(), id: doc.id }))
        .filter(item =>
          item.restaurant?.toLowerCase().includes(query) ||
          item.review?.toLowerCase().includes(query) ||
          item.country?.toLowerCase().includes(query) ||        
          item.dishCountry?.toLowerCase().includes(query) ||     
          item.originCountry?.toLowerCase().includes(query) 
        );

      setRecipeResults(recipes);
      setReviewResults(reviews);
      setLoading(false);
    }

    fetchResults();
  }, [query]);

  if (loading) return <p className="loading-text">Searching...</p>;

  if (recipeResults.length === 0 && reviewResults.length === 0) {
    return <p className="loading-text">No results found for "{query}".</p>;
  }

  return (
    <div className="search-results-page">
      <h2 className="reviews-heading">Search Results for "{query}"</h2>

      {recipeResults.length > 0 && (
        <>
          <h3 className="section-title">Recipes</h3>
          <div className="review-gallery">
            {recipeResults.map(item => (
              <Link
                to={`/recipe/${item.id}`}
                className="review-link"
                key={item.id}
              >
                <div className="review-card">
                  <h3 className="review-title">{item.title}</h3>
                  {item.image && (
                    <LazyImage
                      src={item.image}
                      alt={item.title}
                      className="review-image"
                    />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {reviewResults.length > 0 && (
        <>
          <h3 className="section-title">Reviews</h3>
          <div className="review-gallery">
            {reviewResults.map(item => (
              <Link
                to={`/reviews/${item.id}`}  
                className="review-link"
                key={item.id}
              >
                <div className="review-card">
                  <h3 className="review-title">{item.restaurant}</h3>
                  {item.image && (
                    <LazyImage
                      src={item.image}
                      alt={item.restaurant}
                      className="review-image"
                    />
                  )}
                  <div className="review-rating">{'⭐'.repeat(item.rating)}</div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SearchResultsPage;
