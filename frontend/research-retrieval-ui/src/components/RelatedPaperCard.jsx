function formatScore(value) {
  if (value === null || value === undefined) return null;
  return Number(value).toFixed(3);
}

export default function RelatedPaperCard({ paper, rank }) {
  const score = formatScore(paper.score);

  return (
    <div className="related-card">
      <div className="related-card-header">
        <span className="related-card-rank">{rank}</span>
        <div className="related-card-heading">
          <div className="related-card-title">{paper.title || "Untitled"}</div>
          {paper.authors && (
            <div className="related-card-authors">{paper.authors}</div>
          )}
        </div>
        {score && (
          <span className="related-card-score" title="Similarity / rank score">
            {score}
          </span>
        )}
      </div>

      {paper.abstractText && (
        <p className="related-card-abstract">{paper.abstractText}</p>
      )}

      {paper.relationship && (
        <div className="related-card-relationship">
          <div className="related-card-relationship-label">
            How it relates
          </div>
          <p>{paper.relationship}</p>
        </div>
      )}

      {paper.url && (
        <a
          className="related-card-link"
          href={paper.url}
          target="_blank"
          rel="noreferrer"
        >
          View source
        </a>
      )}
    </div>
  );
}
