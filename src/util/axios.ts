import axios from "axios"

async function getToken() {
  const token = (await chrome.storage.local.get("token")) || ""
  console.log("token", token)
  return token
}

const api = axios.create({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
})

export default api
