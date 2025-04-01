export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Document Requirement Analyzer</title>
        <meta name="description" content="Analyze documents and generate SRS" />
      </head>
      <body>{children}</body>
    </html>
  );
} 