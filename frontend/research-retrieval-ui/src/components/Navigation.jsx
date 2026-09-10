const SECTIONS = [
  { id: "library", label: "Research Library" },
  { id: "ask", label: "Ask Paper" },
  { id: "discover", label: "Discover Research" },
];

export default function Navigation({ activeSection, onNavigate, selectedPaper }) {
  return (
    <nav className="nav">
      <div className="nav-brand">
        <span className="nav-brand-mark">RR</span>
        <div>
          <div className="nav-brand-title">Research Retrieval</div>
          <div className="nav-brand-subtitle">&amp; Reasoning Engine</div>
        </div>
      </div>

      <ul className="nav-list">
        {SECTIONS.map((section) => {
          const requiresPaper = section.id !== "library";
          const disabled = requiresPaper && !selectedPaper;

          return (
            <li key={section.id}>
              <button
                type="button"
                className={
                  "nav-item" +
                  (activeSection === section.id ? " nav-item-active" : "") +
                  (disabled ? " nav-item-disabled" : "")
                }
                onClick={() => onNavigate(section.id)}
                title={
                  disabled
                    ? "Select a paper in the Research Library first"
                    : undefined
                }
              >
                {section.label}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="nav-selected">
        <div className="nav-selected-label">Selected paper</div>
        {selectedPaper ? (
          <div className="nav-selected-paper">
            <div className="nav-selected-title">{selectedPaper.title}</div>
            <div className="nav-selected-meta">{selectedPaper.fileName}</div>
          </div>
        ) : (
          <div className="nav-selected-empty">None selected</div>
        )}
      </div>
    </nav>
  );
}
