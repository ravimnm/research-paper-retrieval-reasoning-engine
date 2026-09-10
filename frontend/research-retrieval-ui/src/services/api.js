// All communication with the backend lives in this file. Components
// never call fetch() directly - they call these functions.
//
// The React app talks ONLY to Spring Boot. Spring Boot is the one
// that talks to the Python/FastAPI engine (over ngrok or otherwise).
// This file has no knowledge of that second hop.

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, options);
  } catch (networkError) {
    // fetch() itself throws for DNS failure, refused connection, etc.
    // This is what a stopped/unreachable Spring Boot backend looks like.
    throw new ApiError(
      "Cannot reach the backend. Make sure the Spring Boot API is running.",
      0
    );
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    // GlobalExceptionHandler on the backend returns { message, ... }.
    const message =
      (body && body.message) ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  return body;
}

// ---------------------------------------------------------------
// Papers
// ---------------------------------------------------------------

// GET /api/papers/local - the set of locally uploaded papers that
// can actually be asked questions about or used for discovery.
export function getPapers() {
  return request("/papers/local");
}

export function getPaper(id) {
  return request(`/papers/${id}`);
}

export function uploadPaper(file) {
  const formData = new FormData();
  formData.append("file", file);

  return request("/papers/upload", {
    method: "POST",
    body: formData,
  });
}

export function deletePaper(id) {
  return request(`/papers/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------
// Retrieval ("Ask Paper")
// ---------------------------------------------------------------

// NOTE - backend contract limitation: POST /api/retrieval does not
// accept a paperId. The AI engine holds a single active document in
// memory, so this always answers about whichever paper was most
// recently uploaded/indexed, regardless of which paper is "selected"
// in this UI. See the README note surfaced in AskPaper.jsx.
export function askQuestion(query, topK = 5) {
  return request("/retrieval", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, topK }),
  });
}

// ---------------------------------------------------------------
// Discovery ("Discover Research")
// ---------------------------------------------------------------

export function discoverResearch(paperId, query, topK = 10) {
  return request("/discovery", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paperId, query, topK }),
  });
}

export { ApiError, API_BASE_URL };
