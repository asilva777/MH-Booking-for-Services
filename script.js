// EmailJS: Do not expose your keys in production! Use environment variables/serverless functions.
document.addEventListener('DOMContentLoaded', function() {
  // EmailJS initialization
  emailjs.init("service_xfy4bbu"); // Move to env/server in production

  const form = document.getElementById('bookingForm');
  const spinner = document.getElementById('spinner');
  const submitBtn = document.getElementById('submitBtn');
  const summary = document.getElementById('summaryCard');
  const priceOutput = document.getElementById('priceOutput');
  const serviceSelect = document.getElementById('service');
  const profileSelect = document.getElementById('profile');
  const citySelect = document.getElementById('city');
  let finalPrice = 0;

  const basePrices = {
    psychiatric: 2000,
    psychotherapy: 1500,
    support: 1200,
    rehabilitation: 1000,
    resilience: 800
  };
  const discounts = {
    student: 0.4,
    worker: 0.1,
    senior: 0.3,
    pwds: 0.3,
    default: 0
  };
  const urbanAddOn = ["metro", "cebu", "davao"];

  function calculatePrice() {
    const service = serviceSelect.value;
    const profile = profileSelect.value;
    const city = citySelect.value;
    if (service && profile && city) {
      const base = basePrices[service];
      const discount = discounts[profile];
      const cityRate = urbanAddOn.includes(city) ? 1.2 : 1.0;
      const discounted = base - (base * discount);
      finalPrice = discounted * cityRate;
      priceOutput.textContent = `Estimated Price: PHP ${finalPrice.toFixed(2)}`;
    } else {
      finalPrice = 0;
      priceOutput.textContent = 'Estimated Price: PHP 0';
    }
  }

  serviceSelect.addEventListener('change', calculatePrice);
  profileSelect.addEventListener('change', calculatePrice);
  citySelect.addEventListener('change', calculatePrice);

  // Real-time validation
  const fields = [
    {id: 'name', message: 'nameError'},
    {id: 'age', message: 'ageError'},
    {id: 'contact', message: 'contactError'},
    {id: 'email', message: 'emailError'},
    {id: 'address', message: 'addressError'},
    {id: 'city', message: 'cityError'},
    {id: 'service', message: 'serviceError'},
    {id: 'profile', message: 'profileError'},
    {id: 'date', message: 'dateError'},
    {id: 'time', message: 'timeError'}
  ];
  fields.forEach(f => {
    const input = document.getElementById(f.id);
    const msg = document.getElementById(f.message);
    input.addEventListener('input', function() {
      if (input.checkValidity()) {
        msg.classList.remove('visible');
      } else {
        msg.classList.add('visible');
      }
    });
  });

  function validateForm() {
    let valid = true;
    fields.forEach(f => {
      const input = document.getElementById(f.id);
      const msg = document.getElementById(f.message);
      if (!input.checkValidity()) {
        msg.classList.add('visible');
        valid = false;
      } else {
        msg.classList.remove('visible');
      }
    });
    return valid;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    spinner.style.display = 'block';
    submitBtn.setAttribute('aria-busy', 'true');
    submitBtn.disabled = true;

    const templateParams = {
      name: form.name.value,
      age: form.age.value,
      contact: form.contact.value,
      email: form.email.value,
      address: form.address.value,
      city: form.city.value,
      service: form.service.value,
      profile: form.profile.value,
      date: form.date.value,
      time: form.time.value,
      price: finalPrice.toFixed(2)
    };

    emailjs.send("service_xfy4bbu", "template_default", templateParams)
      .then(function(response) {
        spinner.style.display = 'none';
        submitBtn.removeAttribute('aria-busy');
        submitBtn.disabled = false;
        alert("Booking email sent successfully!");
      }, function(error) {
        spinner.style.display = 'none';
        submitBtn.removeAttribute('aria-busy');
        submitBtn.disabled = false;
        let errorMsg = "Failed to send booking email.";
        if (error.status === 0) errorMsg += " (Network error.)";
        if (error.text) errorMsg += " " + error.text;
        alert(errorMsg);
      });

    summary.innerHTML = `
      <h3>Booking Summary</h3>
      <p><strong>Name:</strong> ${templateParams.name}</p>
      <p><strong>Age:</strong> ${templateParams.age}</p>
      <p><strong>Contact:</strong> ${templateParams.contact}</p>
      <p><strong>Email:</strong> ${templateParams.email}</p>
      <p><strong>Address:</strong> ${templateParams.address}</p>
      <p><strong>City:</strong> ${templateParams.city}</p>
      <p><strong>Service:</strong> ${templateParams.service}</p>
      <p><strong>Profile:</strong> ${templateParams.profile}</p>
      <p><strong>Date:</strong> ${templateParams.date}</p>
      <p><strong>Time:</strong> ${templateParams.time}</p>
      <p><strong>Price:</strong> PHP ${templateParams.price}</p>
      <hr>
    `;
    summary.style.display = 'block';
    summary.focus();
    summary.scrollIntoView({ behavior: 'smooth' });
  });

  // Pricing info modal/tooltip
  const priceInfo = document.getElementById('priceInfo');
  if (priceInfo) {
    priceInfo.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') {
        e.preventDefault();
        alert(
          'Base rates: Psychiatric 2,000; Psychotherapy 1,500; Support 1,200; Rehabilitation 1,000; Resilience 800.\n' +
          'Discounts: Student 40%, Worker 10%, Senior/PWD 30%. Highly urbanized cities add 20%.'
        );
      }
    });
  }
});
