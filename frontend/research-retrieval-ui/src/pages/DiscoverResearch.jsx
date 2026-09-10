import { useState } from "react";
import SearchBar from "../components/SearchBar.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import EmptyState from "../components/EmptyState.jsx";
import RelatedPaperCard from "../components/RelatedPaperCard.jsx";
import { discoverResearch, ApiError } from "../services/api.js";

export default function DiscoverResearch({ selectedPaper }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function handleDiscover() {
    if (!selectedPaper) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await discoverResearch(
        selectedPaper.id,
        query.trim() || null,
        10
      );
      setResult(response);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not discover related research. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <header className="page-header">
        <h1>Discover Research</h1>
        <p>
          Find related work in the scholarly literature, ranked by semantic
          similarity and explained in relation to your source paper.
        </p>
      </header>

      <div className="context-strip">
        <span className="context-strip-label">Source paper</span>
        <span className="context-strip-value">
          {selectedPaper ? selectedPaper.title : "No paper selected"}
        </span>
      </div>

      <div className="contract-note">
        Discovery currently forwards only this paper's ID to the AI engine,
        which needs the actual document content to build search queries.
        Until that gap is closed on the backend, discovery may only return
        results for the most recently uploaded paper.
      </div>

      <SearchBar
        value={query}
        onChange={setQuery}
        onSubmit={handleDiscover}
        placeholder="Optional: focus the search, e.g. 'transformer architectures'"
        buttonLabel="Discover"
        disabled={loading || !selectedPaper}
      />

      {loading && <LoadingState label="Searching the literature..." />}

      <ErrorBanner message={error} onRetry={handleDiscover} />

      {!loading && !error && !result && (
        <EmptyState
          title="No related research yet"
          description="Run discovery above to find and rank related papers."
        />
      )}

      {!loading && result && (
        <div className="related-list">
          <div className="evidence-section-label">
            Related papers ({(result.relatedPapers || []).length})
          </div>

          {(result.relatedPapers || []).length === 0 && (
            <EmptyState
              title="No related papers found"
              description="External sources did not return anything usable for this paper. Try again, or narrow the focus query."
            />
          )}

          {(result.relatedPapers || []).map((paper, index) => (
            <RelatedPaperCard key={index} paper={paper} rank={index + 1} />
          ))}
        </div>
      )}
    </section>
  );
}
