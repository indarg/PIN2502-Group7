/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Stack, Typography } from "@mui/material";
import { FC, useEffect } from "react";
import Divider from "src/shared/components/divider/Divider";
import Footer from "src/shared/components/footer/Footer";
import { aboutUsData } from "src/static/dataAboutUs";
import "./AboutUsPage.css";
import { useGlobal } from "src/context/GlobalContext/useGlobal";
import { usePagePreparationActions } from "src/shared/hooks/usePagePreparationActions";
import { Helmet } from "react-helmet";

const AboutUsPage: FC<any> = () => {
    const { setShowSplashScreen } = useGlobal();

    useEffect(() => {
        setShowSplashScreen(false);
    }, [])
    usePagePreparationActions();

    return (
        <main className="about-us-section">
            <Helmet>
                <title>Nosotros | Motorizando</title>
                <meta name="description" content="Noticias, adelantos y lanzamientos del mundo automotor. Motorizando te trae la información más reciente y relevante sobre autos, motos y la industria automotriz." />
                <meta property="og:title" content="Motorizando | Nosotros" />
                <meta property="og:description" content="Noticias, adelantos y lanzamientos del mundo automotor. Motorizando te trae la información más reciente y relevante sobre autos, motos y la industria automotriz." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.motorizando.com.ar/nosotros" />
                <meta property="og:image" content={"https://www.motorizando.com.ar/logo-wallpaper.png"} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:site_name" content="Motorizando" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Motorizando | Nosotros" />
                <meta name="twitter:description" content="Noticias, adelantos y lanzamientos del mundo automotor. Motorizando te trae la información más reciente y relevante sobre autos, motos y la industria automotriz." />
                <meta name="twitter:image" content={"https://www.motorizando.com.ar/logo-wallpaper.png"} />
                <link rel="canonical" href="https://www.motorizando.com.ar/nosotros" />
                {/* JSON-LD: Información de la organización */}
                <script type="application/ld+json">
                    {`
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Motorizando",
        "url": "https://www.motorizando.com.ar",
        "logo": "https://www.motorizando.com.ar/logo-wallpaper.png",
        "foundingDate": "2020",
        "founders": [
          {
            "@type": "Person",
            "name": "Franco Cattani",
            "jobTitle": "Fundador y Director General",
            "sameAs": ${JSON.stringify(
                        aboutUsData.team.members[0].social.map((s) => s.url)
                    )}
          },
          {
            "@type": "Person",
            "name": "Juan Richardone",
            "jobTitle": "Fundador y Director General",
            "sameAs": ${JSON.stringify(
                        aboutUsData.team.members[1].social.map((s) => s.url)
                    )}
          }
        ],
        "description": "Medio digital argentino dedicado a noticias, adelantos y lanzamientos del sector automotor.",
        "areaServed": "AR",
        "brand": {
          "@type": "Brand",
          "name": "Motorizando"
        },
        "sameAs": [
          "https://www.instagram.com/motorizando",
          "https://www.youtube.com/@motorizando",
          "https://www.tiktok.com/@motorizando"
        ]
      }
      `}
                </script>
            </Helmet>
            <Divider classname="about-us-banner">
                <img
                    itemProp="image"
                    src="/f6b2b62516a9b639c50ac0a56e20c86a.jpg"
                    alt="Equipo Motorizando"
                />
            </Divider>
            {/* Información institucional */}
            <Divider classname="information-about-us pd">
                <Stack spacing={2}>
                    <Stack spacing={2} direction="column">
                        <h1 className="headline" itemProp="slogan">
                            ¿Quiénes somos?
                        </h1>
                        <Typography variant="subtitle1" itemProp="description">
                            Motorizando nace como un proyecto que combina la pasión por los autos con una identidad moderna, clara y funcional. Nuestro objetivo es acercar toda la información del mundo automotor a los fanáticos y curiosos del sector, a través de contenido de calidad, novedades, lanzamientos, pruebas de manejo y noticias. <br />
                            Cada publicación refleja nuestro compromiso por contar lo que ocurre en la industria de una manera auténtica y dinámica, adaptada a cada una de las plataformas en las que tenemos presencia.
                        </Typography>
                    </Stack>
                </Stack>
                <Stack spacing={2}>
                    <Stack spacing={2} direction="column">
                        <h1 className="headline">¿Qué ofrecemos?</h1>
                        <Typography variant="subtitle1">
                            En Motorizando brindamos un espacio innovador que trasciende los límites del periodismo automotor tradicional. Creamos contenido actualizado y relevante en redes sociales, en nuestra página web y en YouTube, siempre con la objetividad, el detalle y la profundidad técnica que nuestra comunidad valora. <br />
                            Cada tema es abordado con dedicación y profesionalismo, generando análisis y debates que enriquecen a todos los que compartimos esta misma pasión por los motores.
                        </Typography>
                    </Stack>
                </Stack>
            </Divider>

            {/* Equipo fundador */}
            <section className="members-about-us" itemProp="founder" itemScope itemType="https://schema.org/Person">
                <h3 className="headline pd">Equipo fundador</h3>

                {/* Franco */}
                <div className="member-information-about-us pd">
                    <img src="/Fran.png" alt="Franco Cattani" itemProp="image" />
                    <div style={{ textAlign: "left" }}>
                        <h6 itemProp="jobTitle">Fundador & Dirección General</h6>
                        <h1 itemProp="name">Franco Cattani</h1>
                        <p itemProp="description">
                            Franco estudió la Lic. en Ciencias de la Comunicación en UCSF y es creador de Manejando, un canal de YouTube que nació en 2016 para compartir su pasión de toda la vida: los autos. <br />
                            El mundo automotor lo acompaña desde siempre. Una de sus primeras fotos de chico es al volante del Ford Galaxy Ghia bordó de su viejo. <br />
                            Hoy sigue disfrutando de cada novedad, noticia y adelanto del sector, con la misma curiosidad de cuando era chico.
                        </p>
                        <div>
                            {aboutUsData.team.members[0].social.map((social) => (
                                <a
                                    key={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={social.url}
                                    itemProp="sameAs"
                                >
                                    <img src={social.icon} alt={social.alt} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <Box className="about-us-divider" />

                {/* Juan */}
                <div className="member-information-about-us reverse pd" itemScope itemType="https://schema.org/Person">
                    <img src="/Juan.png" alt="Juan Richardone" itemProp="image" />
                    <div style={{ textAlign: "left" }}>
                        <h6 itemProp="jobTitle">Fundador & Dirección General</h6>
                        <h1 itemProp="name">Juan Richardone</h1>
                        <p itemProp="description">
                            Desde chico, Juan combinó dos pasiones que lo marcarían para siempre: el diseño y los autos. Estudió Arquitectura, pero su entusiasmo por el mundo motor lo llevó a comenzar, en 2011, su camino en medios especializados. <br />
                            En 2018 fundó Argentina Motor, un canal de YouTube dedicado exclusivamente a compartir las últimas novedades del mercado automotor. <br />
                            Hoy, lo motiva la misma curiosidad de sus inicios: descubrir y manejar cada nuevo modelo que llega al país, para luego contar su experiencia de primera mano.
                        </p>
                        <div>
                            {aboutUsData.team.members[1].social.map((social) => (
                                <a
                                    key={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={social.url}
                                    itemProp="sameAs"
                                >
                                    <img src={social.icon} alt={social.alt} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>

    )
}

export default AboutUsPage;