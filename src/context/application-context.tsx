import axios from "axios"
import { createContext, useContext, useEffect, useState } from "react"

interface ApplicationContextProps {
  isTokenAvailable: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const ApplicationContext = createContext<ApplicationContextProps | undefined>(
  undefined
)

const ApplicationContextProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isTokenAvailable, setIsTokenAvailable] = useState<boolean>(false)

  const login = async (username: string, password: string) => {
    if (!username || !password) return

    const serverURL = process.env.PLASMO_PUBLIC_SERVER_URL

    console.log("SERVER URL = ", serverURL)

    try {
      const response = await axios.post(serverURL + "/api/extension/login", {
        username,
        password
      })

      console.log("RESPONSE ", response.data)
      if (response.data.token) {
        setIsTokenAvailable(true)
        await chrome.storage.local.set({ token: response.data.token })
      }
    } catch (error) {
      console.error("Error while logging in:", error)
    }
  }

  useEffect(() => {
    const fetchToken = async () => {
      setIsLoading(true)
      const token = await chrome.storage.local.get("token")
      console.log("TOKEN STATUS", token.token)
      if (token.token) {
        setIsTokenAvailable(true)
      } else {
        setIsTokenAvailable(false)
      }
      setIsLoading(false)
    }
    fetchToken()
  }, [])

  const logout = async () => {
    await chrome.storage.local.remove("token")
  }

  return (
    <ApplicationContext.Provider
      value={{ isTokenAvailable, login, logout, isLoading }}>
      {children}
    </ApplicationContext.Provider>
  )
}

const useApplicationContext = () => {
  const context = useContext(ApplicationContext)
  if (!context) {
    throw new Error(
      "useApplicationContext must be used within an ApplicationContextProvider"
    )
  }
  return context
}

export { ApplicationContextProvider, useApplicationContext }
