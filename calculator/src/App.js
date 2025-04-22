import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [numberId, setNumberId] = useState('p');
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchAverage = async () => {
    setLoading(true);
    setErrorMessage('');
    setResponseData(null);
    try {
      const res = await axios.get(`http://localhost:3000/numbers/${numberId}`);
      setResponseData(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage('Sorry, there was a problem fetching the data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Average Calculator</h1>
      <p>Choose a number type and click "Get Average" to see the calculated average and related data.</p>
      
      <div className="input-section">
        <label htmlFor="numberTypeSelect">Select Number Type:</label>
        <select
          id="numberTypeSelect"
          value={numberId}
          onChange={(e) => setNumberId(e.target.value)}
          aria-label="Select number type"
        >
          <option value="p">Prime Numbers</option>
          <option value="f">Fibonacci Numbers</option>
          <option value="e">Even Numbers</option>
          <option value="r">Random Numbers</option>
        </select>

        <button onClick={fetchAverage} disabled={loading} aria-busy={loading}>
          {loading ? 'Calculating average...' : 'Get Average'}
        </button>
      </div>

      {errorMessage && (
        <div className="error-message" role="alert">
          {errorMessage}
        </div>
      )}

      {responseData && (
        <div className="output-section" aria-live="polite">
          <h2>Calculation Results</h2>
          <p><strong>Previous State:</strong></p>
          <pre>{JSON.stringify(responseData.windowPrevState, null, 2)}</pre>
          <p><strong>Current State:</strong></p>
          <pre>{JSON.stringify(responseData.windowCurrState, null, 2)}</pre>
          <p><strong>New Numbers:</strong></p>
          <pre>{JSON.stringify(responseData.numbers, null, 2)}</pre>
          <p><strong>Average:</strong> {responseData.avg}</p>
        </div>
      )}
    </div>
  );
}

export default App;
