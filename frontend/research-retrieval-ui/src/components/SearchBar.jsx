export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder,
  buttonLabel,
  disabled,
  multiline = false,
}) {
  function handleKeyDown(event) {
    if (multiline) return;
    if (event.key === "Enter" && !disabled) {
      onSubmit();
    }
  }

  const InputTag = multiline ? "textarea" : "input";

  return (
    <div className="search-bar">
      <InputTag
        className="search-bar-input"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={multiline ? 3 : undefined}
      />
      <button
        type="button"
        className="search-bar-button"
        onClick={onSubmit}
        disabled={disabled}
      >
        {buttonLabel}
      </button>
    </div>
  );
}
