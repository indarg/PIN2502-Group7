import { Routes, Route, Navigate } from "react-router-dom";
import AboutUsPage from "src/pages/public/AboutUsPage/AboutUsPage";
import DetailNewsPage from "src/pages/public/DetailNewsPage/DetailNewsPage";


export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="nosotros" element={<AboutUsPage />} />
      <Route path="/noticias/:id" element={<DetailNewsPage />} />
      <Route path="*" element={<Navigate to="/inicio" replace />} />
    </Routes>
  );
}
