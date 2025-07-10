document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("booking-form");
  const result = document.getElementById("price-result");

  // Base prices
  const basePrices = {
    teletherapy: 600,
    "in-person": 800,
    group: 300
  };

  // Discount rates by subsidy type
  const subsidyRates = {
    "low-income": 0.5,
    student: 0.3,
    pwd: 0.7,
    none: 1.0
  };

  // Simulate ML model predicting price based on date/time (Time Series)
  function predictPriceBasedOnTime(dateStr, timeStr) {
    const date = new Date(`${dateStr}T${timeStr}`);
    const hour = date.getHours();
    let multiplier = 1.0;

    if (hour >= 8 && hour < 12) multiplier = 0.9; // Morning discount
    else if (hour >= 12 && hour < 14) multiplier = 1.1; // Lunch peak
    else if (hour >= 18 && hour <= 20) multiplier = 1.2; // Evening rush

    return multiplier;
  }

  // Dynamic pricing engine
  function calculateFinalPrice(serviceType, dateStr, timeStr, subsidyType) {
    let price = basePrices[serviceType];

    // Apply time-based multiplier
    const timeMultiplier = predictPriceBasedOnTime(dateStr, timeStr);
    price *= timeMultiplier;

    // Apply subsidy
    const subsidyDiscount = subsidyRates[subsidyType];
    price *= subsidyDiscount;

    return Math.round(price);
  }

  form.addEventListener("submit", e => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    const finalPrice = calculateFinalPrice(
      data["service-type"],
      data["Preferred Date"],
      data["Preferred Time"],
      data["means-test"]
    );

    result.textContent = `Your Final Price: ₱${finalPrice}`;
  });

  // Fade-in animation
  const sections = document.querySelectorAll(".fade-up");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(section => observer.observe(section));
});
