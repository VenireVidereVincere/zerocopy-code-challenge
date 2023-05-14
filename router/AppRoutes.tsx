import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorPage from "../client/components/Error";
import LoginPage from "../client/components/LoginPage";
import UserProfile from "../client/components/UserProfile";
import AccountBalance from "../client/components/AccountBalance";
import UpdateInfoPage from "../client/components/UpdateProfileInfo";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/balance" element={<AccountBalance />} />
        <Route path="/update-profile" element={<UpdateInfoPage />}/>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}