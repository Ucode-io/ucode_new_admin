import React, {Suspense, useMemo} from "react";
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import AuthLayoutDesign from "../layouts/AuthLayout/AuthLayoutDesign";

import MainLayout from "../layouts/MainLayout";
import PageFallback from "../components/FormElements/PageFallBack";
import DashboardPage from "../views/DashBoard";
import TransactionsPage from "../views/Transactions";
import FaresPage from "../views/Fares";
import FaresPricesItem from "../views/Fares/FaresPricesItem";
import LoginDesign from "../views/Auth/LoginDesign";
import CompanyPage from "../views/Company";
import CompanyDetailPage from "../views/Company/CompanyDetailPage";

function Router() {
  const location = useLocation();
  const isAuth = useSelector((state) => state.auth.isAuth);
  const auth = useSelector((state) => state.auth);
  const companyDefaultLink = useSelector((state) => state.company?.defaultPage);
  const applications = useSelector((state) => state.application?.list);

  const redirectLink = useMemo(() => {
    return (
      auth?.clientType?.default_page || companyDefaultLink || "/main/dashboard"
    );
  }, [
    auth?.clientType?.default_page,
    companyDefaultLink,
    location.pathname,
    applications,
  ]);

  if (!isAuth) {
    return (
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<AuthLayoutDesign />}>
            <Route index element={<Navigate to="/login" />} />
            <Route path="login" element={<LoginDesign />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Route>
        </Routes>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/main" element={<MainLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="company" element={<CompanyPage />} />
          <Route path="company/:id/:name" element={<CompanyDetailPage />} />
          <Route path="transactions" element={<TransactionsPage />} />

          <Route path="fares" element={<FaresPage />} />
          <Route path="fares/:id/:name" element={<FaresPricesItem />} />
        </Route>

        <Route path="*" element={<Navigate to={redirectLink} replace />} />
      </Routes>
    </Suspense>
  );
}

export default Router;
