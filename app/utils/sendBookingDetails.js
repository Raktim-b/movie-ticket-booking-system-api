const transporter = require("../config/emailVerify");

const sendBookingDetails = async (user, bookings) => {
  const rows = bookings
    .map(
      (booking, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${booking.movie.movieName}</td>
        <td>${booking.theater.theaterName}</td>
        <td>${new Date(booking.showTime).toLocaleString()}</td>
        <td>${booking.numberOfTickets}</td>
      </tr>
    `,
    )
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin:auto;">
      <h2 style="color:#2563eb;">Booking Summary</h2>

      <p>Hello <strong>${user.name}</strong>,</p>

      <p>Thank you for booking with us. Here is your booking summary.</p>

      <table
        style="
          width:100%;
          border-collapse:collapse;
          margin-top:20px;
        "
      >
        <thead>
          <tr style="background:#2563eb;color:white;">
            <th style="padding:10px;border:1px solid #ddd;">#</th>
            <th style="padding:10px;border:1px solid #ddd;">Movie</th>
            <th style="padding:10px;border:1px solid #ddd;">Theater</th>
            <th style="padding:10px;border:1px solid #ddd;">Show Time</th>
            <th style="padding:10px;border:1px solid #ddd;">Tickets</th>
          </tr>
        </thead>

        <tbody>
          ${rows}
        </tbody>
      </table>

      <br>

      <p><strong>Total Bookings:</strong> ${bookings.length}</p>

      <p>
        Thank you for choosing us.
        <br>
        Have a great movie experience!
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Your Booking Summary",
    html,
  });
};

module.exports = sendBookingDetails;
