import axios from "axios"

async function checkJournalStatus() {
  try {
    console.log("CHECKING JOURNAL STATUS")

    const serverURL = process.env.PLASMO_PUBLIC_SERVER_URL

    console.log("SERVER URL  = ", serverURL)
    const token = await chrome.storage.local.get("token")

    if (!token) {
      console.error("No token found")
      return
    }

    const response = await axios.get(
      serverURL + "/api/extension/did-user-journal-today",
      {
        headers: {
          Authorization: `Bearer ${token.token}`
        }
      }
    )

    console.log("Journal status response:", response.data)
    return { status: response.data.status === true }
  } catch (error) {
    console.error("Error checking journal status:", error)
    return { status: false, error: "Failed to check journal status" }
  }
}

let temporaryAccessTimeout

async function allowTemporaryAccess() {
  if (temporaryAccessTimeout) {
    await chrome.storage.local.set({ temporaryAccess: false })
    clearTimeout(temporaryAccessTimeout)
  }

  chrome.storage.local.set({ temporaryAccess: true })

  temporaryAccessTimeout = setTimeout(
    async () => {
      await chrome.storage.local.set({ temporaryAccess: false })
    },
    5 * 60 * 1000
  )
}

chrome.runtime.onInstalled.addListener(async () => {
  chrome.storage.local.set({ temporaryAccess: false })
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "checkJournalStatus") {
    checkJournalStatus().then(sendResponse)
    return true
  } else if (message.action === "allowTemporaryAccess") {
    allowTemporaryAccess()
    sendResponse({ success: true })
    return true
  }
})
