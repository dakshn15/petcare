import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 2525,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Send email helper
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Petcare Pro" <${process.env.EMAIL_FROM || 'noreply@petcarepro.com'}>`,
      to,
      subject,
      html
    });
    console.log(`📧 Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error(`❌ Email failed to ${to}:`, error.message);
    // Don't throw - email failures shouldn't break the app
  }
};

// Welcome email
export const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #eee;">
      <div style="background: #e65742; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to Petcare Pro! 🐾</h1>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #333;">Hi <strong>${user.name}</strong>,</p>
        <p style="color: #666;">Thank you for joining Petcare Pro! Your account has been created successfully.</p>
        <p style="color: #666;">You can now:</p>
        <ul style="color: #666;">
          <li>Book grooming services for your pets</li>
          <li>Apply for pet adoption</li>
          <li>Leave reviews and share your experience</li>
          <li>Track your bookings and applications</li>
        </ul>
        <p style="color: #666;">We're excited to have you as part of our Petcare family!</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">— The Petcare Pro Team</p>
      </div>
    </div>
  `;
  await sendEmail(user.email, 'Welcome to Petcare Pro!', html);
};

// Booking confirmation email
export const sendBookingConfirmation = async (user, booking) => {
  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #eee;">
      <div style="background: #e65742; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Booking Received! 📅</h1>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #333;">Hi <strong>${user.name}</strong>,</p>
        <p style="color: #666;">Your booking request has been received. Here are the details:</p>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${booking.bookingId}</p>
          <p style="margin: 5px 0;"><strong>Service:</strong> ${booking.serviceLabel}</p>
          <p style="margin: 5px 0;"><strong>Pet:</strong> ${booking.petName} (${booking.petType})</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${booking.date}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> ${booking.status}</p>
        </div>
        <p style="color: #666;">We'll review your booking and contact you within 24 hours to confirm.</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">— The Petcare Pro Team</p>
      </div>
    </div>
  `;
  await sendEmail(user.email, `Booking ${booking.bookingId} Received`, html);
};

// Booking status change email
export const sendBookingStatusEmail = async (user, booking) => {
  const statusColors = { Confirmed: '#22c55e', Completed: '#3b82f6', Cancelled: '#ef4444' };
  const color = statusColors[booking.status] || '#666';

  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #eee;">
      <div style="background: #e65742; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Booking Update 📋</h1>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #333;">Hi <strong>${user.name}</strong>,</p>
        <p style="color: #666;">Your booking <strong>${booking.bookingId}</strong> status has been updated:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="background: ${color}; color: white; padding: 8px 24px; border-radius: 20px; font-weight: bold; font-size: 16px;">${booking.status}</span>
        </div>
        <p style="color: #666;">Service: <strong>${booking.serviceLabel}</strong></p>
        <p style="color: #666;">Date: <strong>${booking.date}</strong></p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">— The Petcare Pro Team</p>
      </div>
    </div>
  `;
  await sendEmail(user.email, `Booking ${booking.bookingId} - ${booking.status}`, html);
};

// Adoption status email
export const sendAdoptionStatusEmail = async (user, application) => {
  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #eee;">
      <div style="background: #e65742; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Adoption Update 🐾</h1>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #333;">Hi <strong>${user.name}</strong>,</p>
        <p style="color: #666;">Your adoption application <strong>${application.applicationId}</strong> has been <strong>${application.status.toLowerCase()}</strong>.</p>
        ${application.status === 'Approved' ? '<p style="color: #22c55e; font-weight: bold;">Congratulations! We will contact you to arrange the next steps.</p>' : ''}
        ${application.status === 'Rejected' ? '<p style="color: #666;">We appreciate your interest. Please feel free to apply again in the future.</p>' : ''}
        <p style="color: #999; font-size: 12px; margin-top: 30px;">— The Petcare Pro Team</p>
      </div>
    </div>
  `;
  await sendEmail(user.email, `Adoption Application ${application.applicationId} - ${application.status}`, html);
};

// Password reset email
export const sendPasswordResetEmail = async (user, resetUrl) => {
  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #eee;">
      <div style="background: #e65742; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Password Reset 🔐</h1>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #333;">Hi <strong>${user.name}</strong>,</p>
        <p style="color: #666;">You requested a password reset. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #e65742; color: white; padding: 12px 32px; border-radius: 25px; text-decoration: none; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #999; font-size: 13px;">This link expires in 10 minutes. If you didn't request this, please ignore this email.</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">— The Petcare Pro Team</p>
      </div>
    </div>
  `;
  await sendEmail(user.email, 'Password Reset Request - Petcare Pro', html);
};

export default sendEmail;
