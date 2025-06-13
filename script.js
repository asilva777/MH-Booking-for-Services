// ------------------------------
// Constants
// ------------------------------
const PSYCHOTHERAPY_PRICE = 800;
const DEFAULT_SERVICE_PRICE = 700;
const EMPLOYMENT_DISCOUNT = 100;
const RURAL_PROVINCE_DISCOUNT = 50;
const VULNERABLE_DISCOUNT = 100;

// IDs of required fields
const FIELD_IDS = [
  'serviceType',
  'employmentStatus',
  'employmentOther',
  'region',
  'province',
  'vulnerable',
  'vulnerableOther',
  'totalPrice',
  'bookingForm',
  'confirmationMsg'
];

// ------------------------------
// Utility Functions
// ------------------------------

/**
 * Safely get an element by ID and log an error if not found.
 * @param {string} id
 * @returns {HTMLElement|null}
 */
function getElement(id) {
  const el = document.getElementById(id);
  if (!el) {
    console.error(`Element with ID "${id}" not found in DOM.`);
  }
  return el;
}

/**
 * Toggle visibility of an element based on a condition.
 * @param {HTMLElement|null} element
 * @param {boolean} shouldHide
 */
function toggleVisibility(element, shouldHide) {
  if (element) {
    element.classList.toggle('hidden', shouldHide);
  }
}

/**
 * Debounce function to limit how often a function can run.
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Validate required fields before form submission.
 * @param {Object} fields
 * @returns {boolean}
 */
function validateFields(fields) {
  // Example: only serviceType is required, but you can expand as needed
  if (!fields.serviceType.value) {
    alert('Please select a service type.');
    fields.serviceType.focus();
    return false;
  }
  return true;
}

// ------------------------------
// Main Script
// ------------------------------

// Gather DOM elements safely
const elements = {};
FIELD_IDS.forEach(id => {
  elements[id] = getElement(id);
});

// Early exit if critical elements are missing
if (!elements.serviceType || !elements.employmentStatus || !elements.province || !elements.vulnerable || !elements.totalPrice) {
  // Not enough elements to run the script safely
  throw new Error("Critical form elements missing. Aborting script initialization.");
}

// ------------------------------
// Event Handlers and Business Logic
// ------------------------------

/**
 * Show/hide "Other" input fields based on dropdown selection.
 */
function handleEmploymentStatusChange() {
  toggleVisibility(elements.employmentOther, elements.employmentStatus.value !== 'other');
}

function handleVulnerableChange() {
  toggleVisibility(elements.vulnerableOther, elements.vulnerable.value !== 'other');
}

/**
 * Compute and display the total price based on form selections.
 */
function calculatePrice() {
  let basePrice = 0;

  // --- Service Type ---
  if (['psychotherapy', 'psychiatric'].includes(elements.serviceType.value)) {
    basePrice = PSYCHOTHERAPY_PRICE;
  } else if (elements.serviceType.value) {
    basePrice = DEFAULT_SERVICE_PRICE;
  }

  // --- Employment Status Adjustment ---
  const discountStatuses = ['unemployed', 'student', 'retired'];
  if (discountStatuses.includes(elements.employmentStatus.value)) {
    basePrice -= EMPLOYMENT_DISCOUNT;
  }

  // --- Province Adjustment (Rural) ---
  const ruralProvinces = ['cebu', 'davao_del_sur', 'pampanga', 'other'];
  if (ruralProvinces.includes((elements.province.value || '').toLowerCase())) {
    basePrice -= RURAL_PROVINCE_DISCOUNT;
  }

  // --- Vulnerable Population Adjustment ---
  const vulnerableDiscounts = [
    "elderly", "children", "pwd", "pregnant", "lowincome", "homeless", "migrant",
    "indigenous", "lgbtq", "chronic", "singleparent", "refugee"
  ];
  if (vulnerableDiscounts.includes((elements.vulnerable.value || '').toLowerCase())) {
    basePrice -= VULNERABLE_DISCOUNT;
  }

  // --- Enforce Minimum Price ---
  if (basePrice < 0 || isNaN(basePrice)) basePrice = 0;

  // --- Display ---
  elements.totalPrice.textContent = `PHP ${basePrice}`;
}

// Debounced version for better performance
const debouncedCalculatePrice = debounce(calculatePrice, 200);

/**
 * Show booking confirmation after form submission.
 * Announce to screen readers for accessibility.
 */
function handleFormSubmit(e) {
  e.preventDefault();

  if (!validateFields(elements)) {
    return;
  }

  const confirmationMsg = elements.confirmationMsg;
  if (confirmationMsg) {
    confirmationMsg.innerHTML = '<strong>Booking submitted!</strong> We will contact you via email/SMS for confirmation.';
    confirmationMsg.setAttribute('role', 'alert');
    confirmationMsg.setAttribute('aria-live', 'assertive');
    confirmationMsg.focus?.(); // Focus for screen readers if possible
  }
}

// ------------------------------
// Attach Event Listeners
// ------------------------------

// Show/hide "Other" fields on change
elements.employmentStatus.addEventListener('change', handleEmploymentStatusChange);
elements.vulnerable.addEventListener('change', handleVulnerableChange);

// Price calculation on relevant field changes
[
  elements.serviceType,
  elements.employmentStatus,
  elements.region,
  elements.province,
  elements.vulnerable
].forEach(el => {
  if (el) {
    el.addEventListener('change', debouncedCalculatePrice);
  }
});

// Calculate price on DOMContentLoaded (handles pre-filled fields)
window.addEventListener('DOMContentLoaded', () => {
  handleEmploymentStatusChange();
  handleVulnerableChange();
  calculatePrice();
});

// Form submission with validation and accessibility
if (elements.bookingForm) {
  elements.bookingForm.addEventListener('submit', handleFormSubmit);
}

// ------------------------------
// Cross-Browser Compatibility
// ------------------------------
// (No modern browser-specific hacks needed, but polyfills can be added here if needed)
