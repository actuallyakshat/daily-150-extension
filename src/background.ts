import axios from "axios"

async function checkJournalStatus() {
  try {
    console.log("CHECKING JOURNAL STATUS")

    const serverURL = process.env.PLASMO_PUBLIC_SERVER_URL
    const token = await chrome.storage.local.get("token")

    if (!token || Object.keys(token).length === 0) {
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

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "temporaryAccessEnd") {
    await chrome.storage.local.set({ temporaryAccess: false })
  }
})

async function allowTemporaryAccess() {
  await chrome.storage.local.set({
    temporaryAccess: true,
    temporaryAccessExpiry: Date.now() + 5 * 60 * 1000
  })

  chrome.alarms.clear("temporaryAccessEnd")
  chrome.alarms.create("temporaryAccessEnd", { delayInMinutes: 5 })
}

async function checkAndRestoreState() {
  const { temporaryAccessExpiry } = await chrome.storage.local.get(
    "temporaryAccessExpiry"
  )

  if (temporaryAccessExpiry && Date.now() >= temporaryAccessExpiry) {
    await chrome.storage.local.set({ temporaryAccess: false })
  }
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "temporaryAccessEnd") {
    await chrome.storage.local.set({ temporaryAccess: false })
  }
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

chrome.runtime.onInstalled.addListener(async () => {
  chrome.storage.local.set({ temporaryAccess: false })
  chrome.storage.local.set({ isActive: false })
})

chrome.runtime.onStartup.addListener(checkAndRestoreState)
