
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [numberId, setNumberId] = useState('p');
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAverage = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/numbers/${numberId}`);
      setResponseData(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setResponseData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Average Calculator</h1>
      
      <div className="input-section">
        <label>Select Number Type:</label>
        <select value={numberId} onChange={(e) => setNumberId(e.target.value)}>
          <option value="p">Prime</option>
          <option value="f">Fibonacci</option>
          <option value="e">Even</option>
          <option value="r">Random</option>
        </select>

        <button onClick={fetchAverage} disabled={loading}>
          {loading ? 'Calculating...' : 'Get Average'}
        </button>
      </div>

      {responseData && (
        <div className="output-section">
          <h2>Response</h2>
          <p><strong>Previous State:</strong> {JSON.stringify(responseData.windowPrevState)}</p>
          <p><strong>Current State:</strong> {JSON.stringify(responseData.windowCurrState)}</p>
          <p><strong>New Numbers:</strong> {JSON.stringify(responseData.numbers)}</p>
          <p><strong>Average:</strong> {responseData.avg}</p>
        </div>
      )}
    </div>
  );
}

export default App;
