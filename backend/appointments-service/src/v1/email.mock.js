import nodemailer from 'nodemailer';

// This creates a transport that logs to console. Replace with real SMTP if needed
const transport = nodemailer.createTransport({
  jsonTransport: true
});

export function sendMockEmail({ to, subject, text }) {
  transport.sendMail({ from: 'no-reply@tac.local', to, subject, text }, (err, info) => {
    if (err) console.error('Mock email error:', err.message);
    else console.log('Mock email queued:', info.message);
  });
}
