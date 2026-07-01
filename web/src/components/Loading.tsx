export function Loading() {
  return (
    <div className="center-screen">
      <div className="spinner" role="status" aria-label="Nalaganje" />
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="container section">
      <p className="empty">{message}</p>
    </div>
  );
}
