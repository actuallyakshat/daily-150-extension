import { useEffect, useState } from "react"

import "~style.css"

function IndexPopup() {
  const [isActive, setIsActive] = useState<boolean>(false)

  useEffect(() => {
    chrome.storage.local.get("isActive", (result) => {
      setIsActive(result.isActive ?? false)
    })
  }, [])

  async function toggleIsActive(isActiveStatus: boolean) {
    await chrome.storage.local.set({ isActive: isActiveStatus })
    setIsActive(isActiveStatus)
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

export default IndexPopup
