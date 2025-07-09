import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";

function SearchResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query")?.toLowerCase() || "";

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      const recipeSnap = await getDocs(collection(db, "recipes"));
      const reviewSnap = await getDocs(collection(db, "reviews"));

      const recipeResults = recipeSnap.docs
  .map(doc => ({ ...doc.data(), id: doc.id, type: "recipe" }))
  .filter(item =>
    item.title?.toLowerCase().includes(query) ||
    item.ingredients?.toLowerCase().includes(query) ||
    item.instructions?.toLowerCase().includes(query)
  );

      const reviewResults = reviewSnap.docs
  .map(doc => ({ ...doc.data(), id: doc.id, type: "review" }))
  .filter(item =>
    item.restaurant?.toLowerCase().includes(query) ||
    item.review?.toLowerCase().includes(query) ||
    item.country?.toLowerCase().includes(query)
  );

      setResults([...recipeResults, ...reviewResults]);
      setLoading(false);
    }

    fetchResults();
  }, [query]);

  if (loading) return <p className="loading-text">Searching...</p>;

  if (!results.length) {
    return <p className="loading-text">No results found for "{query}".</p>;
  }

  return (
    <div className="search-results-page">
      <h2 className="reviews-heading">Search Results for "{query}"</h2>
      <div className="review-gallery">
        {results.map((item) => (
          <Link
  to={item.type === "recipe" ? `/recipe/${item.id}` : `/reviews/${item.id}`}
  className="review-link"
  key={item.id}
>
  <div className="review-card">
    <h3 className="review-title">
      {item.type === "recipe" ? item.title : item.restaurant}
    </h3>
    {item.image && (
      <img src={item.image} alt="" className="review-image" />
    )}
    {item.type === "review" && (
      <div className="review-rating">{'⭐'.repeat(item.rating)}</div>
    )}
  </div>
</Link>
        ))}
      </div>
    </div>
  );
}

export default SearchResultsPage;
