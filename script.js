document.getElementById("bookingForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Collect data
  const formData = new FormData(this);
  const data = {};
  for (let [key, value] of formData.entries()) {
    data[key] = value;
  }

  // Show confirmation (simulate backend)
  document.getElementById("confirmationMsg").innerHTML =
    "<strong>✅ Booking Received!</strong><br>We’ll contact you via email and SMS.";

  // Optional: send data to Firebase/Server here
  console.log("Booking Data:", data);

  // Reset
  this.reset();
});
