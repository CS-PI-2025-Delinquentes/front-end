import { Routes, Route } from 'react-router-dom';
import { LandingPage } from "../pages/landingPage";
import { LoginPage } from "../pages/authentication/LoginPage";
import { SignUpPage } from "../pages/authentication/SignUpPage";
import { Layout } from "../pages/app/layout"
import { Home } from "../pages/app/home";
import { Budget } from "../pages/app/screens/Budget";
import { RequireAuth } from '../components/RequireAuth';
import { Review } from '../pages/app/screens/Review';
import { ServicedRoutes } from '../pages/app/screens/ServicedRoutes';
import { MyShipments } from '../pages/app/screens/MyShipments';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<SignUpPage />} />
      <Route
        path="/app"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="home" element={<Home />} />
        <Route path="orcamento" element={<Budget />} />
        <Route path="avaliar" element={<Review />}/>
        <Route path="rotas-atendidas" element={<ServicedRoutes />}/>
        <Route path="meus-fretes" element={<MyShipments />}/>
      </Route>
    </Routes>
  );
}
