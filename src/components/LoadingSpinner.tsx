'use client';

export default function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="spinner" />
      <style jsx>{`
        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #0070f3;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 