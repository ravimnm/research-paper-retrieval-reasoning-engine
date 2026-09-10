export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="error-banner" role="alert">
      <div className="error-banner-text">
        <strong>Something went wrong.</strong> {message}
      </div>
      {onRetry && (
        <button type="button" className="error-banner-retry" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
