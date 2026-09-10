import { useState } from "react";
import Navigation from "./components/Navigation.jsx";
import Home from "./pages/Home.jsx";
import AskPaper from "./pages/AskPaper.jsx";
import DiscoverResearch from "./pages/DiscoverResearch.jsx";

export default function App() {
  const [activeSection, setActiveSection] = useState("library");
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [blockedNotice, setBlockedNotice] = useState(null);

  function handleNavigate(sectionId) {
    const requiresPaper = sectionId !== "library";

    if (requiresPaper && !selectedPaper) {
      setBlockedNotice(
        "Select a paper in the Research Library before using this section."
      );
      return;
    }

    setBlockedNotice(null);
    setActiveSection(sectionId);
  }

  function handleSelectPaper(paper) {
    setSelectedPaper(paper);
    setBlockedNotice(null);
  }

  return (
    <div className="app-shell">
      <Navigation
        activeSection={activeSection}
        onNavigate={handleNavigate}
        selectedPaper={selectedPaper}
      />

      <main className="app-main">
        {blockedNotice && (
          <div className="blocked-notice" role="alert">
            {blockedNotice}
          </div>
        )}

        {activeSection === "library" && (
          <Home selectedPaper={selectedPaper} onSelectPaper={handleSelectPaper} />
        )}

        {activeSection === "ask" && selectedPaper && (
          <AskPaper selectedPaper={selectedPaper} />
        )}

        {activeSection === "discover" && selectedPaper && (
          <DiscoverResearch selectedPaper={selectedPaper} />
        )}
      </main>
    </div>
  );
}
