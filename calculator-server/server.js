
const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

const WINDOW_SIZE = 10;
const VALID_IDS = new Set(['p', 'f', 'e', 'r']);
const TIMEOUT_MS = 500;

// Store numbers per numberId
const numberWindows = {
  p: [],
  f: [],
  e: [],
  r: []
};

function calculateAverage(numbers) {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, val) => acc + val, 0);
  return parseFloat((sum / numbers.length).toFixed(2));
}

// Add a root route to handle GET /
app.get('/', (req, res) => {
  res.send('Average Calculator Microservice is running.');
});

app.get('/numbers/:numberId', async (req, res) => {
  const numberId = req.params.numberId;

  if (!VALID_IDS.has(numberId)) {
    return res.status(400).json({ error: 'Invalid numberId' });
  }

  const prevState = [...numberWindows[numberId]];

  try {
    const source = axios.CancelToken.source();
    const timeout = setTimeout(() => {
      source.cancel(`Timeout of ${TIMEOUT_MS}ms exceeded`);
    }, TIMEOUT_MS);

    const response = await axios.get(`http://localhost:4000/numbers/${numberId}`, {
      cancelToken: source.token
    });

    clearTimeout(timeout);

    if (!Array.isArray(response.data)) {
      return res.status(500).json({ error: 'Invalid response from third-party server' });
    }

    // Filter unique new numbers ignoring duplicates already stored
    const uniqueNewNumbers = response.data.filter(n => !numberWindows[numberId].includes(n));

    // Add unique new numbers to the window, maintaining window size
    uniqueNewNumbers.forEach(num => {
      if (numberWindows[numberId].length >= WINDOW_SIZE) {
        numberWindows[numberId].shift(); // remove oldest
      }
      numberWindows[numberId].push(num);
    });

    const currState = [...numberWindows[numberId]];
    const avg = calculateAverage(currState);

    return res.json({
      windowPrevState: prevState,
      windowCurrState: currState,
      numbers: response.data,
      avg: avg
    });

  } catch (error) {
    if (axios.isCancel(error)) {
      // Timeout
      return res.status(504).json({ error: 'Request to third-party server timed out' });
    }
    console.error('Error fetching from third-party server:', error.message);
    return res.status(500).json({ error: 'Error fetching from third-party server' });
  }
});

app.listen(port, () => {
  console.log(`Average Calculator Microservice listening at http://localhost:${port}`);
});
