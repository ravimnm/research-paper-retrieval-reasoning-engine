import { useEffect, useState } from "react";
import FileUpload from "../components/FileUpload.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import EmptyState from "../components/EmptyState.jsx";
import PaperCard from "../components/PaperCard.jsx";
import { getPapers, uploadPaper, deletePaper, ApiError } from "../services/api.js";

export default function Home({ selectedPaper, onSelectPaper }) {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  async function loadPapers() {
    setLoading(true);
    setError(null);

    try {
      const data = await getPapers();
      setPapers(data || []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load papers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPapers();
  }, []);

  async function handleUpload(file, validationError) {
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setUploadError(null);
    setUploading(true);

    try {
      const paper = await uploadPaper(file);
      setPapers((current) => [paper, ...current]);
      onSelectPaper(paper);
    } catch (err) {
      setUploadError(
        err instanceof ApiError ? err.message : "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(paper) {
    const confirmed = window.confirm(
      `Delete "${paper.title || paper.fileName}"? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await deletePaper(paper.id);
      setPapers((current) => current.filter((p) => p.id !== paper.id));

      if (selectedPaper && selectedPaper.id === paper.id) {
        onSelectPaper(null);
      }
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not delete this paper."
      );
    }
  }

  return (
    <section>
      <header className="page-header">
        <h1>Research Library</h1>
        <p>
          Upload a research paper to ask grounded questions about it or
          discover related work in the literature.
        </p>
      </header>

      <FileUpload onUpload={handleUpload} uploading={uploading} />
      <ErrorBanner message={uploadError} />

      <div className="section-divider" />

      {loading && <LoadingState label="Loading your papers..." />}

      {!loading && error && (
        <ErrorBanner message={error} onRetry={loadPapers} />
      )}

      {!loading && !error && papers.length === 0 && (
        <EmptyState
          title="No research papers yet"
          description="Upload a PDF above to start asking questions and discovering related research."
        />
      )}

      {!loading && !error && papers.length > 0 && (
        <div className="paper-grid">
          {papers.map((paper) => (
            <PaperCard
              key={paper.id}
              paper={paper}
              isSelected={Boolean(selectedPaper && selectedPaper.id === paper.id)}
              onSelect={onSelectPaper}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
