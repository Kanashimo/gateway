import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router"

import Setup from "./app/Setup"
import Login from "./app/Login"
import NYI from "./app/not_yet_implemented"

import "./style.css"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="setup" element={<Setup />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<NYI />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
