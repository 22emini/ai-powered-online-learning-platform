
import {GoogleGenAI} from '@google/genai';
// ...existing code...

// Function to test if the Gemini API key is working
export async function testGeminiApiKey(apiKey) {
  try {
    const testAi = new GoogleGenAI({ apiKey });
    const response = await testAi.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: 'Test',
    });
    if (response && response.text) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

// Example usage:
// testGeminiApiKey('YOUR_API_KEY');

// Simple React button to test Gemini API key
import React, { useState } from 'react';

export function GeminiApiKeyTestButton() {
  const [apiKey, setApiKey] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    const isValid = await testGeminiApiKey(apiKey);
    setResult(isValid ? 'API Key is valid!' : 'API Key is invalid.');
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Test Gemini API Key</h2>
      <input
        type="text"
        value={apiKey}
        onChange={e => setApiKey(e.target.value)}
        placeholder="Enter Gemini API Key"
        style={{ width: 300, marginRight: 10 }}
      />
      <button onClick={handleTest} disabled={loading}>
        {loading ? 'Testing...' : 'Test API Key'}
      </button>
      {result && <div style={{ marginTop: 20 }}>{result}</div>}
    </div>
  );
}
