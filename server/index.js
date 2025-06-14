const express = require('express');
const cors = require('cors');
const csv = require('csvtojson');
const app = express();
const PORT = 3000;

app.use(cors());

app.get('/api/data', async (req, res) => {
  try {
    const jsonArray = await csv().fromFile('updated_data_aqi_cpcb.csv.csv');
    res.json(jsonArray);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read CSV' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
