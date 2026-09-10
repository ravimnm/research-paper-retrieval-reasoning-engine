function formatDate(value) {
  if (!value) return null;

  try {
    return new Date(value).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return value;
  }
}

export default function PaperCard({ paper, isSelected, onSelect, onDelete }) {
  const uploadedAt = formatDate(paper.uploadedAt);

  return (
    <div
      className={"paper-card" + (isSelected ? " paper-card-selected" : "")}
      onClick={() => onSelect(paper)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(paper);
        }
      }}
    >
      <div className="paper-card-header">
        <span className="paper-card-source">{paper.sourceType || "LOCAL"}</span>
        {isSelected && <span className="paper-card-badge">Selected</span>}
      </div>

      <div className="paper-card-title">{paper.title || "Untitled paper"}</div>
      <div className="paper-card-filename">{paper.fileName}</div>

      {uploadedAt && (
        <div className="paper-card-meta">Uploaded {uploadedAt}</div>
      )}

      <div className="paper-card-actions">
        <button
          type="button"
          className="paper-card-delete"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(paper);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
