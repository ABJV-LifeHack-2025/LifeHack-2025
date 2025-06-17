
// Initialize Supabase
let supabase

(async () => {
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm')

  const SUPABASE_URL = '' // To insert as needed
  const SUPABASE_ANON_KEY = ''

  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  // Once Supabase is ready, call init()
  init()
})()

// Global ESG data cache
let ESG_DATA = {}
let PRODUCT_PATTERNS = {}
let isEnabled = true
const processedElements = new Set()

// Load ESG data from Supabase
async function loadESGData() {
  const { data, error } = await supabase.from('esg_data').select('*')

  if (error) {
    console.error("Error fetching ESG data:", error)
    return
  }

  data.forEach(entry => {
    if (!entry.brand_name || !entry.products || !Array.isArray(entry.products)) return

    const key = entry.brand_name.toLowerCase()
    ESG_DATA[key] = entry

    entry.products.forEach(product => {
      const normalized = product.toLowerCase()
      if (!PRODUCT_PATTERNS[normalized]) {
        PRODUCT_PATTERNS[normalized] = key
      }
    })
  })
}

// Detect brand by product name match
function detectBrand(text) {
  const lowerText = text.toLowerCase()

  for (const [pattern, brandKey] of Object.entries(PRODUCT_PATTERNS)) {
    if (lowerText.includes(pattern)) {
      return ESG_DATA[brandKey]
    }
  }

  return null
}

// ESG scoring helpers
function getScoreColor(score) {
  if (score >= 80) return "#16a34a"
  if (score >= 60) return "#eab308"
  return "#ef4444"
}

function getScoreLabel(score) {
  if (score >= 90) return "Excellent"
  if (score >= 80) return "Very Good"
  if (score >= 70) return "Good"
  if (score >= 60) return "Fair"
  return "Poor"
}

// Initialize extension
async function init() {
  await loadESGData()

  if (typeof chrome !== "undefined" && chrome.storage) {
    chrome.storage.sync.get(["enabled"], (result) => {
      isEnabled = result.enabled !== false
      if (isEnabled) {
        scanForProducts()
        setupObserver()
      }
    })
  } else {
    scanForProducts()
    setupObserver()
  }
}

// Scan for product elements
function scanForProducts() {
  const selectors = getProductSelectors()
  selectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector)
    elements.forEach((element) => {
      if (!processedElements.has(element)) {
        processedElements.add(element)
        processProduct(element)
      }
    })
  })
}

function getProductSelectors() {
  const hostname = window.location.hostname

  if (hostname.includes("amazon.com")) {
    return [
      '[data-component-type="s-search-result"]',
      "#dp-container",
      ".s-result-item",
      ".a-section.a-spacing-base"
    ]
  } else if (hostname.includes("ebay.com")) {
    return [".s-item", ".x-item-title-label", ".notranslate", ".it-ttl"]
  } else if (hostname.includes("walmart.com")) {
    return [
      '[data-testid="item-stack"]',
      ".search-result-gridview-item",
      ".product-title-link"
    ]
  } else if (hostname.includes("target.com")) {
    return [
      '[data-test="product-details"]',
      ".ProductCardImage",
      '[data-test="@web/site-top-of-funnel/ProductCardWrapper"]'
    ]
  } else if (hostname.includes("bestbuy.com")) {
    return [".sku-item", ".sr-item", ".product-title"]
  } else {
    return [".product", ".product-item", ".product-card", "h1", "h2", "h3", ".title", ".product-title", ".product-name"]
  }
}

function processProduct(element) {
  const text = extractProductText(element)
  const brand = detectBrand(text)
  if (brand) addESGBadge(element, brand)
}

function extractProductText(element) {
  const sources = [
    element.textContent,
    element.getAttribute("title"),
    element.getAttribute("alt"),
    element.getAttribute("data-title"),
    element.getAttribute("aria-label"),
  ].filter(Boolean)

  return sources.join(" ")
}

function addESGBadge(element, brand) {
  if (element.querySelector(".esg-badge")) return

  const badge = createESGBadge(brand, element)
  const targetElement = findBestPosition(element)

  if (targetElement) {
    targetElement.style.position = "relative"
    targetElement.appendChild(badge)
  }
}

function findBestPosition(element) {
  const imageContainer = element.querySelector("img")?.parentElement
  if (imageContainer) return imageContainer

  const titleElement = element.querySelector("h1, h2, h3, .title, .product-title, .product-name")
  if (titleElement) return titleElement.parentElement || titleElement

  return element
}

function getBadgeSize(element) {
  const rect = element.getBoundingClientRect()
  if (rect.width < 150 || rect.height < 120) return "mini"
  else if (rect.width < 200 || rect.height < 150) return "compact"
  return "normal"
}

function createESGBadge(brand, containerElement) {
  const badge = document.createElement("div")
  const badgeSize = getBadgeSize(containerElement)

  badge.className =
    badgeSize === "mini" ? "esg-badge mini" : badgeSize === "compact" ? "esg-badge compact" : "esg-badge"

  const tooltipText = `${brand.brand_name} - ${getScoreLabel(brand.overall_score)} (E:${brand.environmental_score} S:${brand.social_score} G:${brand.governance_score})`

  badge.innerHTML = `
    <div class="esg-badge-content">
      <div class="esg-score" style="background-color: ${getScoreColor(brand.overall_score)}">
        ${brand.overall_score}
      </div>
      <div class="esg-info">
        <div class="esg-brand">${brand.brand_name}</div>
      </div>
      ${
        badgeSize !== "mini"
          ? `
        <div class="esg-breakdown">
          <span class="esg-category">E:${brand.environmental_score}</span>
          <span class="esg-category">S:${brand.social_score}</span>
          <span class="esg-category">G:${brand.governance_score}</span>
        </div>
      `
          : ""
      }
      <div class="esg-badge-tooltip">${tooltipText}</div>
    </div>
  `

  badge.addEventListener("click", (e) => {
    e.preventDefault()
    e.stopPropagation()
    showDetailModal(brand)
  })

  return badge
}

function showDetailModal(brand) {
  const existingModal = document.querySelector(".esg-modal")
  if (existingModal) existingModal.remove()

  const modal = document.createElement("div")
  modal.className = "esg-modal"
  modal.innerHTML = `
    <div class="esg-modal-content">
      <div class="esg-modal-header">
        <h3>${brand.brand_name} ESG Score</h3>
        <button class="esg-modal-close">&times;</button>
      </div>
      <div class="esg-modal-body">
        <div class="esg-overall-score">
          <div class="esg-score-circle" style="border-color: ${getScoreColor(brand.overall_score)}">
            <span class="esg-score-number">${brand.overall_score}</span>
            <span class="esg-score-text">${getScoreLabel(brand.overall_score)}</span>
          </div>
        </div>

        <div class="esg-categories">
          ${['Environmental', 'Social', 'Governance'].map((type, idx) => {
            const score = [brand.environmental_score, brand.social_score, brand.governance_score][idx]
            const color = ['#16a34a', '#2563eb', '#7c3aed'][idx]
            const icon = ['🌱', '👥', '🛡️'][idx]
            return `
              <div class="esg-category-item">
                <div class="esg-category-header">
                  <span class="esg-icon">${icon}</span>
                  <span>${type}</span>
                  <span class="esg-score-value">${score}/100</span>
                </div>
                <div class="esg-progress-bar">
                  <div class="esg-progress-fill" style="width: ${score}%; background-color: ${color};"></div>
                </div>
              </div>
            `
          }).join("")}
        </div>

        <div class="esg-brand-info">
          <p><strong>Industry:</strong> ${brand.industry}</p>
          <p><strong>Country:</strong> ${brand.country}</p>
        </div>

        <div class="esg-reasoning">
          <h4>Score Summary:</h4>
          <p>${brand.reasoning}</p>
        </div>
      </div>
    </div>
  `

  document.body.appendChild(modal)

  modal.querySelector(".esg-modal-close").addEventListener("click", () => {
    modal.remove()
  })
}

// Mutation observer to catch dynamic page updates
function setupObserver() {
  const observer = new MutationObserver(() => {
    if (isEnabled) scanForProducts()
  })

  observer.observe(document.body, { childList: true, subtree: true })
}