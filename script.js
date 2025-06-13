// Elements
const serviceType = document.getElementById('serviceType');
const employmentStatus = document.getElementById('employmentStatus');
const employmentOther = document.getElementById('employmentOther');
const region = document.getElementById('region');
const province = document.getElementById('province');
const vulnerable = document.getElementById('vulnerable');
const vulnerableOther = document.getElementById('vulnerableOther');
const totalPrice = document.getElementById('totalPrice');

// Show/hide "Other" text fields
employmentStatus.addEventListener('change', () => {
  employmentOther.classList.toggle('hidden', employmentStatus.value !== 'other');
});
vulnerable.addEventListener('change', () => {
  vulnerableOther.classList.toggle('hidden', vulnerable.value !== 'other');
});

// Pricing logic
function calculatePrice() {
  let basePrice = 0;

  // Service Type
  if (serviceType.value === 'psychotherapy' || serviceType.value === 'psychiatric') {
    basePrice = 800;
  } else if (serviceType.value && serviceType.value !== '') {
    basePrice = 700;
  }

  // Employment Status adjustment
  const discountStatuses = ['unemployed', 'student', 'retired'];
  if (discountStatuses.includes(employmentStatus.value)) basePrice -= 100;

  // Address adjustment
  // Example: rural provinces (Cebu, Davao del Sur, Pampanga, Other) get PHP50 discount
  const ruralProvinces = ['cebu', 'davao_del_sur', 'pampanga', 'other'];
  if (ruralProvinces.includes(province.value)) basePrice -= 50;

  // Vulnerable population adjustment (PHP100 discount)
  const vulnerableDiscounts = [
    "elderly", "children", "pwd", "pregnant", "lowincome", "homeless", "migrant", "indigenous", "lgbtq", "chronic", "singleparent", "refugee"
  ];
  if (vulnerableDiscounts.includes(vulnerable.value)) basePrice -= 100;

  // Minimum price
  if (basePrice < 0) basePrice = 0;

  totalPrice.textContent = `PHP ${basePrice}`;
}

// Listen for changes
[serviceType, employmentStatus, region, province, vulnerable].forEach(el => el.addEventListener('change', calculatePrice));

// Recalculate on load (if fields are prefilled)
window.addEventListener('DOMContentLoaded', calculatePrice);

// Show booking confirmation on submit
document.getElementById('bookingForm').addEventListener('submit', function(e) {
  e.preventDefault();
  document.getElementById('confirmationMsg').innerHTML = '<strong>Booking submitted!</strong> We will contact you via email/SMS for confirmation.';
});
