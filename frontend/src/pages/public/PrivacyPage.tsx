import { FC, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Typography, Stack } from "@mui/material";
import Footer from "src/shared/components/footer/Footer";
import { useGlobal } from "src/context/GlobalContext/useGlobal";
import { usePagePreparationActions } from "src/shared/hooks/usePagePreparationActions";

const PrivacyPage: FC = () => {
  const { setShowSplashScreen } = useGlobal();
  useEffect(() => setShowSplashScreen(false), []);
  usePagePreparationActions();

  return (
    <main className="legal-page" itemScope itemType="https://schema.org/PrivacyPolicy">
      <Helmet>
        <title>Política de Privacidad | Motorizando</title>
        <meta
          name="description"
          content="Conocé cómo Motorizando recopila, utiliza y protege tus datos personales conforme a la Ley 25.326 de Protección de Datos Personales en Argentina."
        />
        <link rel="canonical" href="https://www.motorizando.com.ar/privacidad" />
        <script type="application/ld+json">
          {`
  {
    "@context": "https://schema.org",
    "@type": "PrivacyPolicy",
    "url": "https://www.motorizando.com.ar/privacidad",
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
        <h1 className="headline">Política de Privacidad</h1>

        <Stack spacing={3}>
          <Typography variant="body1">
            En <strong>Motorizando</strong> valoramos tu privacidad y nos comprometemos a
            proteger la información personal que compartís con nosotros. Esta política describe cómo
            recopilamos, utilizamos y protegemos tus datos conforme a la <strong>Ley N.º 25.326 de
              Protección de Datos Personales</strong> de la República Argentina.
          </Typography>

          <Typography variant="h6">1. Información que recopilamos</Typography>
          <Typography variant="body1">
            Podemos recopilar información como nombre, dirección de correo electrónico, dirección IP,
            preferencias de navegación y datos anónimos de uso mediante herramientas como Google Analytics y AdSense.
            Si te suscribís a nuestro boletín o dejás un comentario, podremos almacenar tu email y nombre.
          </Typography>

          <Typography variant="h6">2. Finalidad del tratamiento</Typography>
          <Typography variant="body1">
            Utilizamos los datos únicamente para mejorar tu experiencia, personalizar contenidos, enviar
            novedades (si lo autorizás) y ofrecer publicidad relevante a través de plataformas como
            Google AdSense.
          </Typography>

          <Typography variant="h6">3. Cookies</Typography>
          <Typography variant="body1">
            Nuestro sitio usa cookies propias y de terceros para analizar el tráfico y ofrecer funciones
            personalizadas. Podés configurar tu navegador para rechazarlas, aunque algunas funciones podrían
            dejar de estar disponibles.
          </Typography>

          <Typography variant="h6">4. Derechos del titular</Typography>
          <Typography variant="body1">
            Tenés derecho a acceder, rectificar, actualizar o eliminar tus datos personales. Para ejercerlos,
            escribinos a <strong>info.motorizando@gmail.com</strong>. La autoridad de aplicación es la
            <em>Agencia de Acceso a la Información Pública</em> (AAIP) – www.argentina.gob.ar/aaip.
          </Typography>

          <Typography variant="h6">5. Transferencia de datos</Typography>
          <Typography variant="body1">
            No vendemos ni cedemos tus datos personales. Podremos compartir información con servicios de terceros
            (como Google Analytics o Mailchimp) que actúan como encargados del tratamiento bajo estrictas medidas
            de seguridad.
          </Typography>

          <Typography variant="h6">6. Seguridad</Typography>
          <Typography variant="body1">
            Implementamos medidas técnicas y organizativas razonables para proteger tus datos frente a accesos
            no autorizados, pérdida o alteración.
          </Typography>

          <Typography variant="h6">7. Cambios en la política</Typography>
          <Typography variant="body1">
            Podremos actualizar esta política sin previo aviso. La versión vigente estará siempre disponible en
            <a href="https://www.motorizando.com.ar/privacidad"> esta página</a>.
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

export default PrivacyPage;
