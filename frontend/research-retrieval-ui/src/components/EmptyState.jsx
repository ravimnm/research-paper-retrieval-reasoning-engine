export default function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-title">{title}</div>
      {description && <p className="empty-state-description">{description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}
