const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const compression = require('compression');

const app = express();

app.use(cors());
app.use(compression());

// Mobile redirect middleware - redirect mobile users to main site
app.use((req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  // Only redirect on root path to avoid breaking API routes
  if (isMobile && req.path === '/') {
    return res.redirect(301, 'https://digitinexus.com');
  }
  
  next();
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Handle POST requests to /api/send-email
app.post('/api/send-email', (req, res) => {
    const { name, company, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.FOLIO_EMAIL,
            pass: process.env.FOLIO_PASSWORD,
        },
    });

    transporter
        .verify()
        .then(() => {
            transporter
                .sendMail({
                    from: `"${name}" <henryheffernan.folio@gmail.com>`,
                    to: 'henryheffernan@gmail.com, henryheffernan.folio@gmail.com',
                    subject: `${name} <${email}> ${
                        company ? `from ${company}` : ''
                    } submitted a contact form`,
                    text: `${message}`,
                })
                .then((info) => {
                    console.log({ info });
                    res.json({ message: 'success' });
                })
                .catch((e) => {
                    console.error(e);
                    res.status(500).send(e);
                });
        })
        .catch((e) => {
            console.error(e);
            res.status(500).send(e);
        });
});

// Export the Express app as a serverless function for Vercel
module.exports = app;

