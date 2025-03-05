import { useEffect, useState } from "react"
import { useNavigate } from "react-router"

import { useApplicationContext } from "~context/application-context"

export default function Homepage() {
  const { isTokenAvailable, isLoading } = useApplicationContext()
  const navigate = useNavigate()
  const [isActive, setIsActive] = useState<boolean>(true)

  useEffect(() => {
    const handleStorageChange = (changes, areaName) => {
      if (areaName === "local" && changes.isActive) {
        setIsActive(changes.isActive.newValue ?? false)
      }
    }

    chrome.storage.local.get("isActive", (result) => {
      setIsActive(result.isActive ?? false)
    })

    chrome.storage.onChanged.addListener(handleStorageChange)

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange)
    }
  }, [])

  async function toggleIsActive(isActiveStatus: boolean) {
    await chrome.storage.local.set({ isActive: isActiveStatus })
    setIsActive(isActiveStatus)
  }

  console.log("IS LOADING: ", isLoading)
  console.log("IS TOKEN AVAIL: ", isTokenAvailable)
  if (!isTokenAvailable && !isLoading) {
    navigate("/login")
  }

  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-justify-center plasmo-h-[300px] plasmo-gap-3 plasmo-w-[300px] plasmo-bg-black plasmo-text-white">
      <h1 className="plasmo-text-2xl plasmo-font-extrabold">
        Daily 150 Support
      </h1>
      <button
        className={`plasmo-px-4 plasmo-py-2 ${isActive ? "plasmo-bg-lime-700 plasmo-text-white" : "plasmo-bg-white plasmo-text-black"} plasmo-rounded-md plasmo-hover:plasmo-bg-lime-600 plasmo-cursor-pointer`}
        onClick={() => toggleIsActive(!isActive)}>
        {isActive ? "Currently blocking socials" : "Currently inactive"}
      </button>
    </div>
  )
}
