import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

const social_media_sites = [
  "*://*.instagram.com/*",
  "*://*.twitter.com/*",
  "*://*.x.com/*",
  "*://*.facebook.com/*",
  "*://*.youtube.com/*",
  "*://*.reddit.com/*",
  "*://*.tiktok.com/*",
  "*://*.pinterest.com/*",
  "*://*.tumblr.com/*",
  "*://*.linkedin.com/*",
  "*://*.dribbble.com/*"
]

export const config: PlasmoCSConfig = {
  matches: social_media_sites
}

export const getStyle = (): HTMLStyleElement => {
  const baseFontSize = 16

  let updatedCssText = cssText.replaceAll(":root", ":host(plasmo-csui)")
  const remRegex = /([\d.]+)rem/g
  updatedCssText = updatedCssText.replace(remRegex, (match, remValue) => {
    const pixelsValue = parseFloat(remValue) * baseFontSize
    return `${pixelsValue}px`
  })

  const styleElement = document.createElement("style")
  styleElement.textContent = updatedCssText
  return styleElement
}

const isSocialMediaSite = (): boolean => {
  const hostname = window.location.hostname.toLowerCase()

  console.log("Checking hostname:", hostname)

  return [
    "instagram.com",
    "twitter.com",
    "x.com",
    "facebook.com",
    "youtube.com",
    "reddit.com",
    "tiktok.com",
    "pinterest.com",
    "tumblr.com",
    "linkedin.com",
    "dribbble.com"
  ].some((site) => hostname === site || hostname.endsWith("." + site))
}

const PlasmoOverlay = () => {
  const [showOverlay, setShowOverlay] = useState<boolean>(false)

  useEffect(() => {
    function updateOverlayState() {
      chrome.storage.local.get("isActive", (result) => {
        setShowOverlay(result.isActive ?? false)
      })
    }
    updateOverlayState()

    chrome.storage.onChanged.addListener((changes) => {
      if (changes.isActive) {
        setShowOverlay(changes.isActive.newValue)
      }
    })

    return () => {
      chrome.storage.onChanged.removeListener((changes) => {
        if (changes.isActive) {
          setShowOverlay(changes.isActive.newValue)
        }
      })
    }
  }, [])

  if (!isSocialMediaSite() || !showOverlay) {
    return null
  }

  return (
    <div className="plasmo-z-50 plasmo-font-display plasmo-text-xl plasmo-flex plasmo-flex-col plasmo-gap-3 plasmo-fixed plasmo-top-0 plasmo-left-0 plasmo-w-screen plasmo-h-screen plasmo-bg-black plasmo-text-white plasmo-items-center plasmo-justify-center">
      <p>It would be nice if you journaled before surfing social media.</p>
      <p>
        Journal at{" "}
        <a
          className="hover:plasmo-underline plasmo-text-lime-500"
          href="https://daily150.actuallyakshat.in">
          daily150.actuallyakshat.in
        </a>
      </p>

      <button className="plasmo-mt-5 plasmo-font-medium plasmo-transition-colors hover:plasmo-text-red-600">
        Allow for 15 minutes
      </button>
    </div>
  )
}

export default PlasmoOverlay
