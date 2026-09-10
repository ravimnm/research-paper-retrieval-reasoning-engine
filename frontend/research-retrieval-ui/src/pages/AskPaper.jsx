import { useState } from "react";
import SearchBar from "../components/SearchBar.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import EmptyState from "../components/EmptyState.jsx";
import SourceCard from "../components/SourceCard.jsx";
import { askQuestion, ApiError } from "../services/api.js";

const SUGGESTED_QUESTIONS = [
  "What problem does this paper address?",
  "What method or model does it propose?",
  "What datasets were used for evaluation?",
  "What are the main limitations the authors note?",
];

export default function AskPaper({ selectedPaper }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function handleAsk() {
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await askQuestion(trimmed, 5);
      setResult(response);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not get an answer. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <header className="page-header">
        <h1>Ask Paper</h1>
        <p>
          Ask a natural-language question and get an answer grounded in the
          text of the paper, with the exact evidence it was drawn from.
        </p>
      </header>

      <div className="context-strip">
        <span className="context-strip-label">Context</span>
        <span className="context-strip-value">
          {selectedPaper ? selectedPaper.title : "No paper selected"}
        </span>
      </div>

      <div className="contract-note">
        The AI engine currently holds one active document in memory, so
        answers reflect the most recently uploaded paper rather than
        necessarily the paper selected above. If your answer looks
        unrelated, re-upload the paper you want to ask about.
      </div>

      <SearchBar
        value={query}
        onChange={setQuery}
        onSubmit={handleAsk}
        placeholder="Ask a question about this paper..."
        buttonLabel="Ask"
        disabled={loading || !query.trim()}
        multiline
      />

      <div className="suggested-questions">
        {SUGGESTED_QUESTIONS.map((question) => (
          <button
            key={question}
            type="button"
            className="suggested-question"
            onClick={() => setQuery(question)}
          >
            {question}
          </button>
        ))}
      </div>

      {loading && <LoadingState label="Retrieving evidence and reasoning..." />}

      <ErrorBanner message={error} onRetry={handleAsk} />

      {!loading && !error && !result && (
        <EmptyState
          title="No answer yet"
          description="Ask a question above to see a grounded answer and its supporting evidence."
        />
      )}

      {!loading && result && (
        <div className="answer-layout">
          <div className="answer-card">
            <div className="answer-card-label">Answer</div>
            {result.answer
              ? result.answer
                  .split(/\n\s*\n/)
                  .map((paragraph, index) => <p key={index}>{paragraph}</p>)
              : <p>No answer was returned.</p>}
          </div>

          <div className="evidence-section">
            <div className="evidence-section-label">
              Evidence ({(result.sources || []).length})
            </div>

            {(result.sources || []).length === 0 && (
              <EmptyState
                title="No supporting evidence returned"
                description="The engine did not return any source chunks for this answer."
              />
            )}

            {(result.sources || []).map((source, index) => (
              <SourceCard
                key={`${source.chunkId}-${index}`}
                source={source}
                rank={index + 1}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
