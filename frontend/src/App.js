import React, { useState } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      // Assuming the Spring Boot backend is running on port 8080
      const apiResponse = await fetch(`http://localhost:8080/ai?prompt=${encodeURIComponent(prompt)}`);

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        throw new Error(`API Error: ${apiResponse.status} ${apiResponse.statusText} - ${errorText}`);
      }

      const data = await apiResponse.text(); // Spring AI returns plain text
      setResponse(data);
    } catch (err) {
      console.error("Error fetching AI response:", err);
      setError(err.message || 'Failed to fetch response from the AI service.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Spring AI Chat</h1>
      </header>
      <main>
        <form onSubmit={handleSubmit} className="prompt-form">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            rows="3"
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>

        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
          </div>
        )}

        {response && (
          <div className="response-area">
            <h2>AI Response:</h2>
            <pre>{response}</pre>
          </div>
        )}
         {isLoading && !error && (
          <div className="loading-indicator">
            <p>Loading response...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
