// backend/api/predict-mood.js
const { spawn } = require('child_process');
const path = require('path');

module.exports = async (req, res) => {
  // Check for request method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get mood logs from request body
    const moodLogs = req.body;
    
    if (!Array.isArray(moodLogs)) {
      return res.status(400).json({ error: 'Invalid input: expected array of mood logs' });
    }
    
    // Path to Python script (relative to this file)
    const scriptPath = path.join(process.cwd(), 'backend/mood_prediction.py');
    
    // Spawn Python process
    const pythonProcess = spawn('python', [scriptPath]);
    
    // Set up buffers for stdout and stderr
    let dataString = '';
    let errorString = '';
    
    // Send data to Python script via stdin
    pythonProcess.stdin.write(JSON.stringify(moodLogs));
    pythonProcess.stdin.end();
    
    // Collect data from script
    pythonProcess.stdout.on('data', (data) => {
      dataString += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      errorString += data.toString();
    });
    
    // Handle process completion
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        console.error(`Error: ${errorString}`);
        return res.status(500).json({ 
          error: 'Python process failed', 
          details: errorString,
          code 
        });
      }
      
      try {
        // Parse JSON output from Python
        const result = JSON.parse(dataString);
        
        // Check if the result contains an error
        if (result.error) {
          return res.status(500).json(result);
        }
        
        // Return successful prediction
        return res.status(200).json(result);
      } catch (e) {
        console.error('Failed to parse Python output:', e);
        return res.status(500).json({ 
          error: 'Failed to parse Python output',
          raw: dataString,
          parseError: e.message
        });
      }
    });
    
    // Handle process errors
    pythonProcess.on('error', (err) => {
      console.error('Failed to start Python process:', err);
      res.status(500).json({ error: 'Failed to start Python process', details: err.message });
    });
    
    // Set timeout for long-running predictions
    const timeout = setTimeout(() => {
      pythonProcess.kill();
      res.status(504).json({ error: 'Prediction timed out' });
    }, 9000); // 9 seconds timeout (Vercel functions timeout at 10s)
    
    // Clear timeout on process completion
    pythonProcess.on('close', () => {
      clearTimeout(timeout);
    });
    
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};