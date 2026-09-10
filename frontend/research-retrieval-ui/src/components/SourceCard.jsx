function formatScore(value) {
  if (value === null || value === undefined) return "—";
  return Number(value).toFixed(3);
}

export default function SourceCard({ source, rank }) {
  return (
    <div className="source-card">
      <div className="source-card-header">
        <span className="source-card-rank">Source {rank}</span>
        <span className="source-card-score" title="Relevance score">
          score {formatScore(source.score)}
        </span>
      </div>

      <div className="source-card-meta">
        <span>{source.paper || "Unknown paper"}</span>
        {source.page !== null && source.page !== undefined && (
          <span>page {source.page}</span>
        )}
        {source.chunkId !== null && source.chunkId !== undefined && (
          <span>chunk {source.chunkId}</span>
        )}
        {source.fusionScore !== undefined && source.fusionScore !== null && (
          <span>fusion {formatScore(source.fusionScore)}</span>
        )}
        {source.rerankScore !== undefined && source.rerankScore !== null && (
          <span>rerank {formatScore(source.rerankScore)}</span>
        )}
      </div>

      <p className="source-card-text">{source.text}</p>
    </div>
  );
}
