import React from "react";
import { Route, Routes } from "react-router-dom";

import ProfileSetupPage from "../pages/ProfileSetupPage";
import GoalSetupPage from "../pages/GoalSetupPage";
import NutritionPage from "../pages/NutritionPage";
import WorkoutPage from "../pages/WorkoutPage";
import ProfilePage from "../pages/ProfilePage";
import SignInPage from "../pages/auth/SignInPage";
import SignUpPage from "../pages/auth/SignUpPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ActivationPage from "../pages/auth/ActivationPage";
import Home from "../pages/Home";
import ProtectedRoute from "./ProtectedRoutes";
import TrackerPage from "../pages/TrackerPage";
import SleepTrackerPage from "../pages/SleepTrackerPage";
import WaterTrackerPage from "../pages/WaterTrackerPage";
import WeightTrackerPage from "../pages/WeightTrackerPage";

function Routing() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/profile-setup" element={<ProfileSetupPage />} />
        <Route exact path="/goal-setup" element={<GoalSetupPage />} />
        <Route exact path="/food" element={<NutritionPage />} />
        <Route exact path="/workout" element={<WorkoutPage />} />
        <Route exact path="/profile" element={<ProfilePage />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/tracker" element={<TrackerPage />} />
        <Route exact path="/sleep" element={<SleepTrackerPage />}/>
        <Route exact path="/water" element={<WaterTrackerPage />} />
        <Route exact path="/weight" element={<WeightTrackerPage />} />
      </Route>
      <Route exact path="/auth/sign-in" element={<SignInPage />} />
      <Route exact path="/auth/sign-up" element={<SignUpPage />} />
      <Route exact path="/auth/reset-password" element={<ResetPasswordPage />} />
      <Route exact path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route exact path="/auth/activate/:token" element={<ActivationPage />} />
    </Routes>
  );
}

export default Routing;
