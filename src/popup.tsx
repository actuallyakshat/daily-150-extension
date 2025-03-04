import { MemoryRouter, Route, Routes } from "react-router"

import Homepage from "~components/homepage"
import LoginPage from "~components/login-page"
import { ApplicationContextProvider } from "~context/application-context"

import "~style.css"

function IndexPopup() {
  return (
    <MemoryRouter>
      <ApplicationContextProvider>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </ApplicationContextProvider>
    </MemoryRouter>
  )
}

export default IndexPopup
