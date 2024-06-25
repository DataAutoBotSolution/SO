const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const twilio = require('twilio');
const app = express();
const port = process.env.PORT || 3010;

// Twilio credentials
const accountSid = 'ACc23958e72df11d9582c48ef6fea859ed';
const authToken = '45015a0d2c25f0441e89a12c6e50eafd';
const twilioNumber = 'whatsapp:+918892084780';
const client = twilio(accountSid, authToken);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle service orders
app.post('/api/service-orders', async (req, res) => {
  const { name, email, phone, serviceType, description } = req.body;
  console.log('Received service order:', req.body);

  const message = `
    New Service Order:
    Name: ${name}
    Email: ${email}
    Phone: ${phone}
    Service Type: ${serviceType}
    Description: ${description}
  `;
  try {
    // Send WhatsApp message using Twilio
    await client.messages.create({
      from: `whatsapp:+14155238886`,
      to: `whatsapp:+918892084780`,
      body: message
    });

    res.status(200).json({
      message: 'Service order received successfully',
      data: { name, email, phone, serviceType, description }
    });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    res.status(500).json({ error: 'Failed to send WhatsApp message' });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, '../serviceorder/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../serviceorder/build/index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
