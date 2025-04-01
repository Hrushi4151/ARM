'use client';

import { useEffect } from 'react';

export default function ClientLayout({ children }) {
  useEffect(() => {
    const initializePdfWorker = async () => {
      const { GlobalWorkerOptions, version } = await import('pdfjs-dist');
      GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;
    };
    
    initializePdfWorker().catch(console.error);
  }, []);

  return <>{children}</>;
} 