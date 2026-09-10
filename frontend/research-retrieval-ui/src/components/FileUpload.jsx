import { useRef, useState } from "react";

export default function FileUpload({ onUpload, uploading }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFiles(files) {
    const file = files && files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      onUpload(null, "Only PDF files are supported.");
      return;
    }

    onUpload(file, null);
  }

  return (
    <div
      className={"upload-dropzone" + (isDragging ? " upload-dropzone-active" : "")}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="upload-input"
        onChange={(event) => handleFiles(event.target.files)}
        disabled={uploading}
      />

      <div className="upload-copy">
        <div className="upload-title">
          {uploading ? "Uploading and indexing..." : "Upload a research paper"}
        </div>
        <div className="upload-hint">
          Drag a PDF here, or{" "}
          <button
            type="button"
            className="upload-browse"
            onClick={() => inputRef.current && inputRef.current.click()}
            disabled={uploading}
          >
            browse your files
          </button>
        </div>
      </div>
    </div>
  );
}
