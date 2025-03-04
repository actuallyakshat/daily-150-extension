import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router"

import { useApplicationContext } from "~context/application-context"

export default function LoginPage() {
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const { isTokenAvailable, login } = useApplicationContext()
  const navigate = useNavigate()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(username, password)
      console.log("Successfully logged in")
      navigate("/")
    } catch (error) {
      console.error("Error logging in:", error)
    } finally {
      setLoading(false)
    }
  }

  if (isTokenAvailable) {
    navigate("/")
  }

  return (
    <div className="plasmo-h-[300px] plasmo-w-[300px] plasmo-bg-black plasmo-text-white plasmo-flex plasmo-items-center plasmo-justify-center">
      <form
        className="plasmo-flex plasmo-flex-col plasmo-gap-3"
        onSubmit={onSubmit}>
        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          className="plasmo-w-full plasmo-p-2 plasmo-bg-black plasmo-border-white plasmo-border plasmso-rounded-md focus:plasmo-outline-0 focus:plasmo-ring-0 focus:plasmo-border-lime-600"
        />
        <input
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="plasmo-w-full plasmo-p-2 plasmo-bg-black plasmo-border-white plasmo-border plasmso-rounded-md focus:plasmo-outline-0 focus:plasmo-ring-0 focus:plasmo-border-lime-600"
          type="password"
        />
        <button
          className="plasmo-w-full plasmo-p-2 plasmo-bg-lime-700 plasmo-text-white plasmo-rounded-md plasmo-hover:plasmo-bg-lime-600 plasmo-cursor-pointer"
          disabled={loading}>
          Login with Daily 150
        </button>
      </form>
    </div>
  )
}
