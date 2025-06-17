document.addEventListener("DOMContentLoaded", async () => {
  // Check if chrome API is available
  const chrome = window.chrome // Declare the chrome variable
  if (typeof chrome !== "undefined" && chrome.tabs) {
    try {
      // Get current tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

      // Update current site
      const hostname = new URL(tab.url).hostname
      document.getElementById("currentSite").textContent = hostname

      // Load extension state
      chrome.storage.sync.get(["enabled"], (result) => {
        const isEnabled = result.enabled !== false
        updateToggleState(isEnabled)
      })

      // Setup toggle switch
      const toggleSwitch = document.getElementById("toggleSwitch")
      toggleSwitch.addEventListener("click", () => {
        const isActive = toggleSwitch.classList.contains("active")
        const newState = !isActive

        updateToggleState(newState)

        // Save state
        chrome.storage.sync.set({ enabled: newState })

        // Send message to content script
        chrome.tabs.sendMessage(tab.id, {
          action: "toggle",
          enabled: newState,
        })
      })

      // Setup web app link
      document.getElementById("openWebApp").addEventListener("click", (e) => {
        e.preventDefault()
        chrome.tabs.create({ url: "https://your-esg-dashboard.com" })
      })
    } catch (error) {
      console.log("Chrome API not available, using fallback")
      setupFallback()
    }
  } else {
    setupFallback()
  }

  // Simulate some stats
  document.getElementById("brandsDetected").textContent = Math.floor(Math.random() * 5) + 2
})

function setupFallback() {
  // Fallback for when chrome API is not available
  document.getElementById("currentSite").textContent = "demo-site.com"

  const toggleSwitch = document.getElementById("toggleSwitch")
  toggleSwitch.addEventListener("click", () => {
    const isActive = toggleSwitch.classList.contains("active")
    updateToggleState(!isActive)
  })
}

function updateToggleState(isEnabled) {
  const toggleSwitch = document.getElementById("toggleSwitch")
  const extensionStatus = document.getElementById("extensionStatus")

  if (isEnabled) {
    toggleSwitch.classList.add("active")
    extensionStatus.textContent = "Active"
    extensionStatus.className = "stat-value status-active"
  } else {
    toggleSwitch.classList.remove("active")
    extensionStatus.textContent = "Disabled"
    extensionStatus.className = "stat-value status-disabled"
  }
}
