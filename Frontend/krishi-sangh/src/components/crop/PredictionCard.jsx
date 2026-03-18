export default function PredictionCard({ title, description, severity = 'info' }) {
  return (
    <div className={`card prediction-card prediction-card-${severity}`}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
