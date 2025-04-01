'use client';

import { useState } from 'react';
import styles from './page.module.css';
import LoadingSpinner from '@/components/LoadingSpinner';
import { extractTextFromFile } from '@/utils/fileProcessor';
import ClientLayout from '@/components/ClientLayout';

export default function Home() {
  const [file, setFile] = useState(null);
  const [textPrompt, setTextPrompt] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inputMethod, setInputMethod] = useState('file');

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setError('');
    }
  };

  const handleInputMethodChange = (method) => {
    setInputMethod(method);
    setError('');
    setFile(null);
    setTextPrompt('');
  };

  const analyzeDocument = async () => {
    if (!file && !textPrompt) return;

    setLoading(true);
    setError('');

    try {
      let content = '';
      
      if (inputMethod === 'file' && file) {
        content = await extractTextFromFile(file);
      } else if (inputMethod === 'text' && textPrompt) {
        content = textPrompt;
      } else {
        throw new Error('Please provide either a file or text input');
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: content }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze document');
      }
      
      setAnalysis(data.analysis);
      setError('');
    } catch (error) {
      console.error('Error analyzing document:', error);
      setError(
        error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred. Please try again.'
      );
      setAnalysis('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClientLayout>
      <main className={styles.main}>
        <h1>Document Requirement Analyzer</h1>
        
        <div className={styles.inputSelector}>
          <button 
            onClick={() => handleInputMethodChange('file')}
            className={`${styles.selectorButton} ${inputMethod === 'file' ? styles.active : ''}`}
          >
            Upload File
          </button>
          <button 
            onClick={() => handleInputMethodChange('text')}
            className={`${styles.selectorButton} ${inputMethod === 'text' ? styles.active : ''}`}
          >
            Enter Text
          </button>
        </div>

        <div className={styles.uploadSection}>
          {inputMethod === 'file' ? (
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={handleFileUpload}
              className={styles.fileInput}
            />
          ) : (
            <textarea
              value={textPrompt}
              onChange={(e) => setTextPrompt(e.target.value)}
              placeholder="Enter your requirements or project description here..."
              className={styles.textInput}
              rows={10}
            />
          )}
          
          <button 
            onClick={analyzeDocument}
            disabled={(!file && !textPrompt) || loading}
            className={styles.analyzeButton}
          >
            {loading ? 'Analyzing...' : 'Analyze Document'}
          </button>
        </div>

        {loading && <LoadingSpinner />}
        
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {analysis && (
          <div className={styles.analysisResult}>
            <h2>Requirements Analysis</h2>
            <div className={styles.srsDocument}>
              {analysis.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </main>
    </ClientLayout>
  );
} 