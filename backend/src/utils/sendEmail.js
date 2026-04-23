const isProd = process.env.NODE_ENV === 'production';

async function sendViaResend({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set in environment variables.');
  }

  const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Resend API error ${res.status}: ${JSON.stringify(data)}`);
  }

  console.log(`✅ [Email] Delivered to ${to} — id: ${data.id}`);
  return data;
}

let gmailTransporter = null;

async function getGmailTransporter() {
  if (gmailTransporter) return gmailTransporter;

  const nodemailer = (await import('nodemailer')).default;

  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.error('❌ GMAIL_USER or GMAIL_PASS not set in .env');
    console.error('   → GMAIL_PASS must be a Gmail App Password, not your login password');
  }

  gmailTransporter = nodemailer.createTransport({
    host:   'smtp.gmail.com',
    port:   465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
    connectionTimeout: 10_000,
    greetingTimeout:   10_000,
    socketTimeout:     15_000,
  });

  gmailTransporter.verify((err) => {
    if (err) {
      console.error('❌ Gmail SMTP failed to connect:', err.message);
      console.error('   → Check GMAIL_USER / GMAIL_PASS in your .env');
      console.error('   → GMAIL_PASS must be a Gmail App Password (not your login password)');
    } else {
      console.log('✅ SMTP ready via Gmail (development)');
    }
  });

  return gmailTransporter;
}

async function sendViaGmail({ to, subject, html }) {
  const transporter = await getGmailTransporter();
  const from = `"CodeForge" <${process.env.GMAIL_USER}>`;
  const result = await transporter.sendMail({ from, to, subject, html });
  console.log(`✅ [Email] Delivered to ${to} — messageId: ${result.messageId}`);
  return result;
}

async function send({ to, subject, html }) {
  console.log(`📬 [Email] Sending "${subject}" to ${to} via ${isProd ? 'Resend HTTP' : 'Gmail'}`);
  if (isProd) {
    return sendViaResend({ to, subject, html });
  } else {
    return sendViaGmail({ to, subject, html });
  }
}

if (isProd) {
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY is not set — emails will NOT send in production.');
    console.error('   → Sign up at resend.com, create an API key, set RESEND_API_KEY in Render env vars.');
  }
}


export async function sendVerificationEmail(toEmail, name, token) {
  const url = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  await send({
    to:      toEmail,
    subject: 'Verify your CodeForge email address',
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;background:#0f0f0f;color:#e0e0e0;border-radius:12px;padding:40px;">
        <h2 style="color:#00d084;margin:0 0 6px;">Welcome to CodeForge, ${name.split(' ')[0]}!</h2>
        <p style="color:#aaa;font-size:14px;margin:0 0 32px;">
          You're one step away. Click the button below to verify your email and activate your account.
        </p>
        <a href="${url}"
           style="display:inline-block;background:#00d084;color:#000;text-decoration:none;
                  padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px;letter-spacing:.3px;">
          Verify Email Address →
        </a>
        <p style="color:#555;font-size:13px;margin-top:32px;line-height:1.6;">
          This link expires in <strong style="color:#aaa">2 minutes</strong>.<br/>
          If you didn't create a CodeForge account, you can safely ignore this email.
        </p>
        <hr style="border:none;border-top:1px solid #222;margin:32px 0"/>
        <p style="color:#333;font-size:11px;margin:0;">CodeForge · The platform built for developers who want to get hired</p>
      </div>
    `,
  });
}

export async function sendVerificationOtp(toEmail, name, otp) {
  await send({
    to:      toEmail,
    subject: 'Your CodeForge verification code',
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;background:#0f0f0f;color:#e0e0e0;border-radius:12px;padding:40px;">
        <h2 style="color:#00d084;margin:0 0 6px;">Welcome to CodeForge, ${name.split(' ')[0]}!</h2>
        <p style="color:#aaa;font-size:14px;margin:0 0 28px;">
          Enter the code below to verify your email and activate your account.
        </p>
        <div style="background:#1a1a1a;border:1px solid #333;border-radius:12px;padding:28px;text-align:center;margin-bottom:28px;">
          <p style="color:#666;font-size:12px;margin:0 0 12px;letter-spacing:1px;text-transform:uppercase;">Your verification code</p>
          <p style="color:#00d084;font-size:40px;font-weight:800;letter-spacing:16px;margin:0;font-family:monospace;">${otp}</p>
        </div>
        <p style="color:#555;font-size:13px;line-height:1.6;">
          This code expires in <strong style="color:#aaa">2 minutes</strong>.<br/>
          You have <strong style="color:#aaa">3 attempts</strong> before the code is locked.<br/>
          If you didn't create a CodeForge account, you can safely ignore this email.
        </p>
        <hr style="border:none;border-top:1px solid #222;margin:32px 0"/>
        <p style="color:#333;font-size:11px;margin:0;">CodeForge · The platform built for developers who want to get hired</p>
      </div>
    `,
  });
}

export async function sendPasswordResetOtp(toEmail, name, otp) {
  await send({
    to:      toEmail,
    subject: 'Your CodeForge password reset code',
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;background:#0f0f0f;color:#e0e0e0;border-radius:12px;padding:40px;">
        <h2 style="color:#00d084;margin:0 0 6px;">Password Reset</h2>
        <p style="color:#aaa;font-size:14px;margin:0 0 28px;">
          Hi ${name.split(' ')[0]}, use the code below to reset your CodeForge password.
        </p>
        <div style="background:#1a1a1a;border:1px solid #333;border-radius:12px;padding:28px;text-align:center;margin-bottom:28px;">
          <p style="color:#666;font-size:12px;margin:0 0 12px;letter-spacing:1px;text-transform:uppercase;">Your verification code</p>
          <p style="color:#00d084;font-size:40px;font-weight:800;letter-spacing:16px;margin:0;font-family:monospace;">${otp}</p>
        </div>
        <p style="color:#555;font-size:13px;line-height:1.6;">
          This code expires in <strong style="color:#aaa">2 minutes</strong>.<br/>
          You have <strong style="color:#aaa">3 attempts</strong> before the code is locked.<br/>
          If you didn't request this, you can safely ignore this email.
        </p>
        <hr style="border:none;border-top:1px solid #222;margin:32px 0"/>
        <p style="color:#333;font-size:11px;margin:0;">CodeForge · The platform built for developers who want to get hired</p>
      </div>
    `,
  });
}

export async function sendContactEmail({ name, email, category, subject, message }) {

  await send({
    to:      email,
    subject: `We received your message — CodeForge Support`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.4);">

        <!-- Header -->
        <div style="background:#00d084;padding:36px 40px;text-align:center;">
          <h1 style="margin:0;color:#000;font-size:22px;font-weight:800;letter-spacing:-.3px;">
            Thanks for reaching out! 👋
          </h1>
        </div>

        <!-- Body -->
        <div style="background:#0f0f0f;padding:36px 40px;">
          <p style="color:#e0e0e0;font-size:15px;margin:0 0 16px;">
            Hey <strong style="color:#00d084">${name.split(' ')[0]}</strong>,
          </p>
          <p style="color:#aaa;font-size:14px;line-height:1.7;margin:0 0 24px;">
            We've received your message and will get back to you as soon as possible — usually within 24 hours.
          </p>

          <!-- Message summary box -->
          <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-left:3px solid #00d084;border-radius:8px;padding:20px 24px;margin-bottom:24px;">
            <p style="color:#666;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin:0 0 12px;">Your message summary</p>
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="color:#555;font-size:13px;padding:5px 0;width:80px;">Category</td>
                <td style="color:#ccc;font-size:13px;padding:5px 0;">${category}</td>
              </tr>
              <tr>
                <td style="color:#555;font-size:13px;padding:5px 0;">Subject</td>
                <td style="color:#ccc;font-size:13px;padding:5px 0;">${subject}</td>
              </tr>
            </table>
          </div>

          <p style="color:#555;font-size:13px;line-height:1.6;margin:0 0 28px;">
            If your matter is urgent, feel free to call me directly at +91 9199519751, or Email me on this
            <a href="mailto:${process.env.EMAIL_TO || process.env.GMAIL_USER}"
               style="color:#00d084;text-decoration:none;">
              ${process.env.EMAIL_TO || process.env.GMAIL_USER}
            </a>
          </p>

          <p style="color:#aaa;font-size:14px;margin:0;">
            Talk soon,<br/>
            <strong style="color:#e0e0e0;">The CodeForge Team</strong>
          </p>
        </div>

        <!-- Footer -->
        <div style="background:#0a0a0a;padding:16px 40px;text-align:center;border-top:1px solid #1a1a1a;">
          <p style="color:#333;font-size:11px;margin:0;">
            This is an automated reply — please don't respond to this email.<br/>
            CodeForge · The platform built for developers who want to get hired
          </p>
        </div>
      </div>
    `,
  });

  await send({
    to:      process.env.EMAIL_TO || process.env.GMAIL_USER,
    subject: `[CodeForge Support] ${category}: ${subject}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.4);">

        <!-- Header -->
        <div style="background:#00d084;padding:28px 40px;">
          <p style="margin:0;color:#000;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;opacity:.7;">New Support Message</p>
          <h1 style="margin:6px 0 0;color:#000;font-size:20px;font-weight:800;">📬 CodeForge Support</h1>
        </div>

        <!-- Fields -->
        <div style="background:#0f0f0f;padding:32px 40px;">

          <div style="margin-bottom:16px;">
            <p style="color:#555;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin:0 0 6px;">From</p>
            <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:12px 16px;">
              <p style="color:#e0e0e0;font-size:14px;font-weight:600;margin:0;">${name}</p>
              <a href="mailto:${email}" style="color:#00d084;font-size:13px;text-decoration:none;">${email}</a>
            </div>
          </div>

          <div style="display:flex;gap:12px;margin-bottom:16px;">
            <div style="flex:1;">
              <p style="color:#555;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin:0 0 6px;">Category</p>
              <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:12px 16px;">
                <p style="color:#ccc;font-size:13px;margin:0;">${category}</p>
              </div>
            </div>
          </div>

          <div style="margin-bottom:16px;">
            <p style="color:#555;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin:0 0 6px;">Subject</p>
            <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:12px 16px;">
              <p style="color:#e0e0e0;font-size:14px;font-weight:600;margin:0;">${subject}</p>
            </div>
          </div>

          <div style="margin-bottom:8px;">
            <p style="color:#555;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin:0 0 6px;">Message</p>
            <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-left:3px solid #00d084;border-radius:8px;padding:16px;font-size:14px;line-height:1.7;color:#ccc;white-space:pre-wrap;">${message}</div>
          </div>

        </div>

        <!-- Footer -->
        <div style="background:#0a0a0a;padding:16px 40px;border-top:1px solid #1a1a1a;">
          <p style="color:#333;font-size:11px;margin:0;text-align:center;">
            Hit reply or email <a href="mailto:${email}" style="color:#00d084;text-decoration:none;">${email}</a> to respond directly to ${name}
          </p>
        </div>
      </div>
    `,
  });
}
