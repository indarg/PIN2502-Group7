import { FC, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Typography, Stack } from "@mui/material";
import Footer from "src/shared/components/footer/Footer";
import { useGlobal } from "src/context/GlobalContext/useGlobal";
import { usePagePreparationActions } from "src/shared/hooks/usePagePreparationActions";

const TermsPage: FC = () => {
  const { setShowSplashScreen } = useGlobal();
  useEffect(() => setShowSplashScreen(false), []);
  usePagePreparationActions();

  return (
    <main className="legal-page" itemScope itemType="https://schema.org/TermsOfService">
      <Helmet>
        <title>Términos y Condiciones | Motorizando</title>
        <meta
          name="description"
          content="Términos y condiciones de uso del sitio Motorizando.com.ar. Conocé tus derechos y obligaciones como usuario."
        />
        <link rel="canonical" href="https://www.motorizando.com.ar/terminos" />
        <script type="application/ld+json">
          {`
  {
    "@context": "https://schema.org",
    "@type": "TermsOfService",
    "url": "https://www.motorizando.com.ar/terminos",
    "publisher": {
      "@type": "NewsMediaOrganization",
      "name": "Motorizando",
      "url": "https://www.motorizando.com.ar",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.motorizando.com.ar/logo-wallpaper.png"
      }
    },
    "inLanguage": "es-AR",
    "dateModified": "${new Date().toISOString().split('T')[0]}"
  }
  `}
        </script>

      </Helmet>

      <section className="pd">
        <h1 className="headline">Términos y Condiciones de Uso</h1>

        <Stack spacing={3}>
          <Typography variant="body1">
            El presente documento establece los términos bajo los cuales <strong>Motorizando</strong> pone a
            disposición su sitio web <a href="https://www.motorizando.com.ar">motorizando.com.ar</a> y sus
            contenidos. Al acceder o utilizar el sitio, aceptás estos términos.
          </Typography>

          <Typography variant="h6">1. Uso del sitio</Typography>
          <Typography variant="body1">
            El usuario se compromete a utilizar el sitio de manera lícita, respetando la legislación vigente y
            evitando cualquier acción que pueda dañar, inutilizar o sobrecargar la plataforma o interferir con su
            funcionamiento.
          </Typography>

          <Typography variant="h6">2. Propiedad intelectual</Typography>
          <Typography variant="body1">
            Todos los contenidos (textos, imágenes, logotipos, videos y código fuente) son propiedad de
            <strong>Motorizando</strong> o de sus respectivos autores y están protegidos por la legislación
            argentina sobre derechos de autor. Se prohíbe su reproducción total o parcial sin autorización expresa.
          </Typography>

          <Typography variant="h6">3. Contenidos de terceros</Typography>
          <Typography variant="body1">
            El sitio puede incluir enlaces o material proveniente de terceros (marcas, fabricantes, anunciantes).
            Motorizando no se responsabiliza por el contenido o veracidad de la información publicada por dichos
            terceros.
          </Typography>

          <Typography variant="h6">4. Publicidad</Typography>
          <Typography variant="body1">
            El sitio puede incluir anuncios de Google AdSense u otras redes publicitarias. Dichos anuncios son
            administrados automáticamente según tus intereses y comportamiento de navegación.
          </Typography>

          <Typography variant="h6">5. Exclusión de responsabilidad</Typography>
          <Typography variant="body1">
            Motorizando no garantiza la exactitud, vigencia o disponibilidad continua de la información publicada.
            El uso de la información del sitio se realiza bajo exclusiva responsabilidad del usuario.
          </Typography>

          <Typography variant="h6">6. Modificaciones</Typography>
          <Typography variant="body1">
            Motorizando podrá modificar estos términos sin previo aviso. Las versiones actualizadas estarán
            disponibles permanentemente en esta página.
          </Typography>

          <Typography variant="h6">7. Jurisdicción</Typography>
          <Typography variant="body1">
            Cualquier controversia será resuelta conforme a las leyes de la República Argentina, en los tribunales
            ordinarios de la Ciudad Autónoma de Buenos Aires.
          </Typography>

          <Typography variant="body2" sx={{ mt: 2 }}>
            Última actualización: {new Date().getFullYear()} – Motorizando © Todos los derechos reservados.
          </Typography>
        </Stack>
      </section>
      <Footer />
    </main>
  );
};

export default TermsPage;
