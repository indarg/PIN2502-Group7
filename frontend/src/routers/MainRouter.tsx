
import { Navigate, Outlet, Route, Routes } from "react-router";
import { CRMNewsProvider } from "src/context/CRMNewsContext/CRMNewsProvider";
import { CRMYouTubeVideoProvider } from "src/context/CRMYoutubeVideoContext/CRMYouTubeVideoProvider";
import CRMHomePage from "src/pages/private/CRMHomePage/CRMHomePage";
import LoginPage from "src/pages/private/CRMLoginPage/CRMLoginPage";
import CRMNewsAddPage from "src/pages/private/CRMNewsOutlet/CRMNewsAddPage/CRMNewsAddPage";
import CRMNewsEditPage from "src/pages/private/CRMNewsOutlet/CRMNewsEditPage/CRMNewsEditPage";
import CRMNewsPage from "src/pages/private/CRMNewsOutlet/CRMNewsOutlet";
import CRMNewsTablePage from "src/pages/private/CRMNewsOutlet/CRMNewsTablePage/CRMNewsTablePage";
import CRMTagAddPage from "src/pages/private/CRMTagsOutlet/CRMTagAddPage/CRMTagAddPage";
import CRMTagEditPage from "src/pages/private/CRMTagsOutlet/CRMTagEditPage/CRMTagEditPage";
import CRMTagsPage from "src/pages/private/CRMTagsOutlet/CRMTagsOutlet";
import CRMTagsTablePage from "src/pages/private/CRMTagsOutlet/CRMTagsTablePage/CRMTagsTablePage";
import CRMYouTubeVideoAddPage from "src/pages/private/CRMYoutubeOutlet/CRMYouTubeVideoAddPage/CRMYouTubeVideoAddPage";
import CRMYouTubeVideoEditPage from "src/pages/private/CRMYoutubeOutlet/CRMYouTubeVideoEditPage/CRMYouTubeVideoEditPage";
import CRMYoutubeVideoOutlet from "src/pages/private/CRMYoutubeOutlet/CRMYoutubeVideoOutlet";
import CRMYouTubeVideoTablePage from "src/pages/private/CRMYoutubeOutlet/CRMYouTubeVideoTablePage/CRMYouTubeVideoTablePage";
import DashboardLayout from "src/pages/private/DashboardLayout";
import DetailNewsPage from "src/pages/public/DetailNewsPage/DetailNewsPage";
import NewsPage from "src/pages/public/NewsPage/NewsPage";
import PrivacyPage from "src/pages/public/PrivacyPage";
import TermsPage from "src/pages/public/TermsPage";
import TransitionPage from "src/pages/public/TransitionPage/TransitionPage";
import AboutUsPage from "../pages/public/AboutUsPage/AboutUsPage";
import LandingPage from "../pages/public/LandingPage/LandingPage";
import PrivateContextWrapper from "./PrivateContextWrapper";
import PrivateRoute from "./PrivateRoute";
import PublicContextWrapper from "./PublicContextWrapper";
import { AuthProvider } from "src/context/AuthContext/AuthProvider";

export default function MainRouter() {


  return (
    <Routes>
      <Route
        element={
          <PublicContextWrapper >
            <TransitionPage />
            <Outlet />
          </PublicContextWrapper>
        }
      >
        <Route path="inicio" element={<LandingPage />} />
        <Route path="nosotros" element={<AboutUsPage />} />
        <Route path="noticias" element={<NewsPage />} />
        <Route path="noticias/:id" element={<DetailNewsPage />} />
        <Route path="/privacidad" element={<PrivacyPage />} />
        <Route path="/terminos" element={<TermsPage />} />
        {/* <Route path="*" element={<Navigate to="/inicio" replace />} /> */}
      </Route>
      {/* Rutas protegidas CRM */}
      <Route
        path="crm/:hash"
        element={
            <PrivateRoute>
              <PrivateContextWrapper>
                <Outlet />
              </PrivateContextWrapper>
            </PrivateRoute>
        }
      >
        <Route path="login" element={<LoginPage />} />
        <Route
          path="dashboard"
          element={<DashboardLayout />}
        >
          <Route path="home" index element={<CRMHomePage />} />
          <Route path="news" element={
            <CRMNewsProvider>
              <CRMNewsPage />
            </CRMNewsProvider>
          } >
            <Route path="" index element={<CRMNewsTablePage />} />
            <Route path="create" element={<CRMNewsAddPage />} />
            <Route path=":id" element={<CRMNewsEditPage />} />

          </Route>
          <Route path="yt-videos" element={
            <CRMYouTubeVideoProvider>
              <CRMYoutubeVideoOutlet />
            </CRMYouTubeVideoProvider>
          } >
            <Route path="" index element={<CRMYouTubeVideoTablePage />} />
            <Route path="create" element={<CRMYouTubeVideoAddPage />} />
            <Route path=":id" element={<CRMYouTubeVideoEditPage />} />
          </Route>
          <Route path="tags" element={
            <CRMTagsPage />
          } >
            <Route path="" index element={<CRMTagsTablePage />} />
            <Route path="create" element={<CRMTagAddPage />} />
            <Route path=":id" element={<CRMTagEditPage />} />
          </Route>


          <Route path="*" element={<Navigate to="home" replace />} />
        </Route>
      </Route>

      {/* Fallback global */}
      <Route path="*" element={<Navigate to="/inicio" replace />} />
    </Routes >
  )

}


