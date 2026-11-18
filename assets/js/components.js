/**
 * VERDANT ECOSYSTEMS | 2027 SUSTAINABILITY PLATFORM
 * Interactive Component Modules: Materials Filter, Service Postcode Checker, Pickup Form, Impact Calculator
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. Swiper Testimonials Slider (Homepage)
  // ==========================================================================
  if (document.querySelector('.testimonial-swiper') && window.Swiper) {
    new Swiper('.testimonial-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-btn-next',
        prevEl: '.swiper-btn-prev',
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 28,
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 32,
        }
      }
    });
  }

  // ==========================================================================
  // 2. Interactive Materials Filter & Live Item Search (materials.html)
  // ==========================================================================
  const materialFilters = document.querySelectorAll('.material-filter-pill');
  const materialCards = document.querySelectorAll('.material-item-col');
  const materialSearchInput = document.getElementById('materialSearchInput');
  const materialQuickResult = document.getElementById('materialQuickResult');

  // Database of searchable everyday items for quick lookup
  const itemLookupDB = [
    { name: 'Cardboard Box', category: 'paper', accepted: true, prep: 'Flatten completely, remove plastic packaging tape.' },
    { name: 'Pizza Box (Clean lid)', category: 'paper', accepted: true, prep: 'Tear off clean top lid. Compost or trash greasy bottom.' },
    { name: 'Pizza Box (Greasy)', category: 'paper', accepted: false, prep: 'Grease contaminates paper pulp. Place in organic or general waste.' },
    { name: 'PET Water Bottles', category: 'plastic', accepted: true, prep: 'Empty liquid, rinse lightly, replace screw cap.' },
    { name: 'Shampoo / Detergent Bottles (HDPE)', category: 'plastic', accepted: true, prep: 'Rinse out residue, pump heads can stay attached.' },
    { name: 'Plastic Carrier Bags', category: 'plastic', accepted: true, prep: 'Bundle together or return to supermarket collection bins.' },
    { name: 'Crisp Packets & Foil Pouches', category: 'plastic', accepted: false, prep: 'Multi-layer composite. Use specialist terracycle drops.' },
    { name: 'Wine & Beer Bottles', category: 'glass', accepted: true, prep: 'Rinse cleanly. Corks and metal caps can be separated.' },
    { name: 'Broken Window Glass / Mirrors', category: 'glass', accepted: false, prep: 'Different melting temperature. Treat as construction waste.' },
    { name: 'Aluminium Drinks Cans', category: 'metals', accepted: true, prep: 'Empty, rinse, crush flat to save transport volume.' },
    { name: 'Food Tins & Pet Food Cans', category: 'metals', accepted: true, prep: 'Rinse thoroughly to remove organic food matter.' },
    { name: 'Aerosol Spray Cans', category: 'metals', accepted: true, prep: 'Ensure fully depressurized and empty. Do not pierce.' },
    { name: 'Old Laptops & Computers', category: 'electronics', accepted: true, prep: 'Securely wipe data. We perform ISO-certified data destruction.' },
    { name: 'Smartphone & Tablets', category: 'electronics', accepted: true, prep: 'Remove SIM cards. Battery must remain intact inside case.' },
    { name: 'Lithium-Ion Rechargeable Batteries', category: 'batteries', accepted: true, prep: 'Tape battery terminals with electrical tape to prevent short circuits.' },
    { name: 'Car Lead-Acid Batteries', category: 'batteries', accepted: true, prep: 'Keep upright in leak-proof battery tubs.' },
    { name: 'Food Scraps & Coffee Grounds', category: 'organic', accepted: true, prep: 'Use certified 100% compostable liners or unlined brown caddies.' },
    { name: 'Garden Clippings & Branches', category: 'organic', accepted: true, prep: 'Cut branches under 1.5m length. No treated timber.' }
  ];

  if (materialFilters.length > 0) {
    materialFilters.forEach(pill => {
      pill.addEventListener('click', () => {
        materialFilters.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const filter = pill.getAttribute('data-filter');
        materialCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  if (materialSearchInput && materialQuickResult) {
    materialSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (!query) {
        materialQuickResult.innerHTML = '';
        materialQuickResult.classList.add('d-none');
        return;
      }

      const matches = itemLookupDB.filter(item => item.name.toLowerCase().includes(query));

      if (matches.length > 0) {
        materialQuickResult.classList.remove('d-none');
        materialQuickResult.innerHTML = `
          <div class="card-modern p-3 mb-4 border-2" style="border-color: var(--color-secondary);">
            <div class="d-flex align-items-center justify-content-between mb-2 pb-2 border-bottom border-light">
              <span class="fw-bold small text-uppercase" style="color: var(--color-primary);"><i data-lucide="sparkles" class="w-4 h-4 me-1 d-inline"></i> Instant Material Lookup (${matches.length} matches)</span>
              <button type="button" class="btn-close btn-close-sm" onclick="document.getElementById('materialQuickResult').classList.add('d-none');"></button>
            </div>
            <div class="list-group list-group-flush">
              ${matches.map(m => `
                <div class="list-group-item bg-transparent px-0 py-2 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
                  <div>
                    <strong class="d-block text-body">${escapeHtml(m.name)}</strong>
                    <small class="text-muted">${escapeHtml(m.prep)}</small>
                  </div>
                  <div>
                    ${m.accepted 
                      ? '<span class="badge-accepted"><i data-lucide="check-circle" style="width:14px; height:14px;"></i> Accepted for Recycling</span>'
                      : '<span class="badge-prohibited"><i data-lucide="x-circle" style="width:14px; height:14px;"></i> Not in Standard Bin</span>'
                    }
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
      } else {
        materialQuickResult.classList.remove('d-none');
        materialQuickResult.innerHTML = `
          <div class="alert alert-info py-2 px-3 small rounded-3 mb-4">
            No exact item found for "${escapeHtml(query)}". Need specialized guidance? <a href="contact.html" class="fw-bold text-decoration-underline">Ask our materials engineering team</a>.
          </div>
        `;
      }
    });
  }

  // ==========================================================================
  // 3. Service Coverage Postcode / City Checker (service-areas.html)
  // ==========================================================================
  const coverageForm = document.getElementById('coverageSearchForm');
  const coverageResult = document.getElementById('coverageResultBox');

  const coverageDatabase = {
    'london': { depot: 'Greenwich EcoHub & Dartford Material Recovery Facility', nextPickup: 'Next Day Available (Mon - Sat)', residential: true, commercial: true, industrial: true },
    'manchester': { depot: 'Trafford Clean Circular Logistics Center', nextPickup: 'Bi-Weekly or On-Demand', residential: true, commercial: true, industrial: true },
    'birmingham': { depot: 'Midlands West Zero-Landfill Processing Depot', nextPickup: 'Every Tuesday & Friday', residential: true, commercial: true, industrial: true },
    'leeds': { depot: 'Yorkshire Renewable Material Terminal', nextPickup: 'Weekly Collections', residential: true, commercial: true, industrial: true },
    'bristol': { depot: 'Avonmouth Circular Tech & Clean Energy Hub', nextPickup: 'Daily Commercial / Weekly Residential', residential: true, commercial: true, industrial: true },
    'glasgow': { depot: 'Clyde Valley Advanced Polymer & Glass Plant', nextPickup: 'Twice Weekly', residential: true, commercial: true, industrial: true },
    'edinburgh': { depot: 'Lothian Clean Tech Recovery Center', nextPickup: 'Weekly or Scheduled Container Drop', residential: true, commercial: true, industrial: true },
    'newcastle': { depot: 'Tyne Clean Energy & Biomass Recycling Plant', nextPickup: 'Scheduled On-Demand', residential: true, commercial: true, industrial: true },
  };

  if (coverageForm && coverageResult) {
    coverageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('coverageInput');
      const val = input.value.trim().toLowerCase();

      if (!val) {
        window.showToast('Please enter a valid UK postcode or city name.', 'error');
        return;
      }

      // Check matched city or sample postcode prefix
      let match = null;
      for (const city in coverageDatabase) {
        if (val.includes(city) || val.startsWith('sw') || val.startsWith('e1') || val.startsWith('m1') || val.startsWith('b1') || val.startsWith('ls') || val.startsWith('bs') || val.startsWith('g1')) {
          match = coverageDatabase[city];
          break;
        }
      }

      if (!match) {
        // Fallback matched demo region
        match = {
          depot: 'Verdant Regional Circular Depot',
          nextPickup: 'Standard 48-Hour Scheduled Service',
          residential: true,
          commercial: true,
          industrial: true
        };
      }

      coverageResult.classList.remove('d-none');
      coverageResult.innerHTML = `
        <div class="card-modern p-4 border-2" style="border-color: var(--color-secondary); animation: fadeIn 0.4s ease;">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="coverage-status-indicator text-success">
              <span class="status-dot"></span>
              <span>100% Service Coverage Verified</span>
            </div>
            <span class="badge-eco">Active Zone</span>
          </div>
          <h4 class="mb-2">Servicing: ${escapeHtml(input.value.toUpperCase())}</h4>
          <p class="text-muted mb-3">Your location is within our direct electrified vehicle route with zero-to-landfill guarantee.</p>
          <div class="row g-3 py-2 border-top border-bottom border-light my-2">
            <div class="col-sm-6">
              <small class="text-muted d-block">Assigned Regional Depot</small>
              <strong class="d-block text-body">${match.depot}</strong>
            </div>
            <div class="col-sm-6">
              <small class="text-muted d-block">Next Available Route Window</small>
              <strong class="d-block text-success">${match.nextPickup}</strong>
            </div>
          </div>
          <div class="d-flex flex-wrap gap-2 mt-3 pt-2">
            <span class="badge-accepted"><i data-lucide="check" class="w-3 h-3"></i> Residential Wheeled Bins</span>
            <span class="badge-accepted"><i data-lucide="check" class="w-3 h-3"></i> Commercial Compactors</span>
            <span class="badge-accepted"><i data-lucide="check" class="w-3 h-3"></i> Hazardous & E-Waste</span>
          </div>
          <div class="mt-4">
            <a href="contact.html?area=${encodeURIComponent(input.value)}" class="btn-primary-custom w-100 justify-content-center">
              <span>Book Collection For This Area</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </a>
          </div>
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();
      window.showToast('Coverage confirmed for ' + input.value.toUpperCase(), 'success');
    });
  }

  // ==========================================================================
  // 4. Pickup Enquiry Form Submission (contact.html)
  // ==========================================================================
  const pickupForm = document.getElementById('pickupEnquiryForm');
  if (pickupForm) {
    // If area passed in URL query param, prefill
    const urlParams = new URLSearchParams(window.location.search);
    const areaParam = urlParams.get('area');
    const cityInput = document.getElementById('pickupCity');
    if (areaParam && cityInput) {
      cityInput.value = decodeURIComponent(areaParam);
    }

    pickupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('pickupName').value.trim();
      const email = document.getElementById('pickupEmail').value.trim();
      const phone = document.getElementById('pickupPhone').value.trim();
      const address = document.getElementById('pickupAddress').value.trim();
      const city = document.getElementById('pickupCity').value.trim();
      const material = document.getElementById('pickupMaterial').value;
      const quantity = document.getElementById('pickupQuantity').value;
      const date = document.getElementById('pickupDate').value;
      const message = document.getElementById('pickupMessage').value.trim();

      if (!name || !email || !phone || !address || !city || !material || !quantity || !date) {
        window.showToast('Please fill out all required fields marked with *', 'error');
        return;
      }

      // Generate reference ID
      const refId = 'VRD-' + Math.floor(100000 + Math.random() * 900000);

      // Save enquiry to localStorage demo log
      const enquiries = JSON.parse(localStorage.getItem('verdant_enquiries') || '[]');
      enquiries.push({
        refId,
        name,
        email,
        phone,
        address,
        city,
        material,
        quantity,
        date,
        message,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('verdant_enquiries', JSON.stringify(enquiries));

      // Show Confirmation Modal
      const modalEl = document.getElementById('pickupSuccessModal');
      if (modalEl && window.bootstrap) {
        document.getElementById('modalRefCode').textContent = refId;
        document.getElementById('modalCustomerName').textContent = name;
        document.getElementById('modalScheduledDate').textContent = date;
        const bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();
      } else {
        window.showToast(`Enquiry ${refId} submitted successfully! Our fleet coordinator will contact you.`, 'success');
      }

      pickupForm.reset();
    });
  }

  // ==========================================================================
  // 5. Interactive Environmental Impact Calculator (process.html)
  // ==========================================================================
  const impactTonsInput = document.getElementById('impactTonsInput');
  const impactTonsDisplay = document.getElementById('impactTonsDisplay');
  const metricCo2 = document.getElementById('metricCo2');
  const metricTrees = document.getElementById('metricTrees');
  const metricKwh = document.getElementById('metricKwh');
  const metricLandfill = document.getElementById('metricLandfill');

  if (impactTonsInput && impactTonsDisplay) {
    const updateImpactCalculations = (tons) => {
      impactTonsDisplay.textContent = tons + ' Tonnes / Month';
      
      // Standard recycling benchmark factors (demonstration data)
      const co2Saved = Math.round(tons * 1.85);
      const treesSaved = Math.round(tons * 17);
      const kwhClean = Math.round(tons * 4100);
      const landfillDiverted = (tons * 0.96).toFixed(1);

      if (metricCo2) metricCo2.textContent = co2Saved.toLocaleString() + ' t';
      if (metricTrees) metricTrees.textContent = treesSaved.toLocaleString();
      if (metricKwh) metricKwh.textContent = kwhClean.toLocaleString() + ' kWh';
      if (metricLandfill) metricLandfill.textContent = landfillDiverted + ' t';
    };

    impactTonsInput.addEventListener('input', (e) => {
      updateImpactCalculations(e.target.value);
    });

    updateImpactCalculations(impactTonsInput.value || 50);
  }

  // ==========================================================================
  // 6. Newsletter Subscription Form
  // ==========================================================================
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        window.showToast(`Subscribed ${input.value} to Verdant Eco Insights!`, 'success');
        input.value = '';
      }
    });
  });

});
