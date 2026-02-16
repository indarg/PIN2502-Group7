
export const aboutUsData = {
  bannerImage: "/banner.jpg",
  sections: [
    {
      title: "¿Quienes somos?",
      titleHighlight: "m",
      text: "Motorizando nace como un proyecto que combina la pasión por los autos con una identidad moderna, clara y funcional. Nuestro objetivo es acercar toda la información del mundo automotor a los fanáticos y curiosos del sector, a través de contenido de calidad, novedades, lanzamientos, pruebas de manejo y noticias.\n Cada publicación refleja nuestro compromiso por contar lo que ocurre en la industria de una manera auténtica y dinámica, adaptada a cada una de las plataformas en las que tenemos presencia."
    },
    {
      title: "¿Qué ofrecemos?",
      titleHighlight: "m",
      text: "En Motorizando brindamos un espacio innovador que trasciende los límites del periodismo automotor tradicional. Creamos contenido actualizado y relevante en redes sociales, en nuestra página web y en YouTube, siempre con la objetividad, el detalle y la profundidad técnica que nuestra comunidad valora.\n Cada tema es abordado con dedicación y profesionalismo, generando análisis y debates que enriquecen a todos los que compartimos esta misma pasión por los motores."
    }
  ],
  imageDivider: {
    src: "/flyeruser.png",
    alt: "motorizando"
  },
  team: {
    title: "Equipo fundador",
    members: [
      {
        id: 1,
        position:'Fundador & Dirección General',
        name: "Franco Cattani",
        description: "Franco estudió la Lic. en Ciencias de la Comunicación en UCSF y creador de Manejando, un canal de YouTube que nació en 2016 para compartir su pasión de toda la vida: los autos.\n El mundo automotor lo acompaña desde siempre. De hecho, una de sus primeras fotos de chico es al volante del Ford Galaxy GL bordó de su viejo. Gracias a a su familia, creció rodeado de historias, experiencias y conocimientos que le marcaron el camino.\n Hoy sigue disfrutando de cada novedad, noticia y adelanto del sector, con la misma curiosidad de cuando era chico. Si de gustos se trata, no deja de rendirle homenaje a los motores en V, al placer de un buen diseño, a las altas rpm y a nuestra industria argentina bien aplicada.",
        image: "/Fran.png",
        social: [
          // { icon: "/icons/instragram.png", alt: "instagram-icon" },
          { icon: "/icons/youtube.png", alt: "youtube-icon", url:'https://www.youtube.com/@manejando' },
          // { icon: "/icons/X- icon.png", alt: "x-icon" }
        ]
      },
      {
        id: 2,
        position:'Fundador & Dirección General',
        name: "Juan Richardone",
        description: "Desde chico, Juan combinó dos pasiones que lo marcarían para siempre: el diseño y los autos. Estudió Arquitectura, pero su entusiasmo por el mundo motor lo llevó a comenzar, en 2011, su camino en medios especializados del sector.\nEn 2018 fundó Argentina Motor, un canal de YouTube dedicado exclusivamente a compartir las últimas novedades del mercado automotor.\nApasionado por todo lo que tenga motor, sus preferencias siempre oscilaron entre la precisión de los autos japoneses y la imponencia de las grandes berlinas y camionetas estadounidenses. Con el tiempo, amplió su mirada para profundizar en la mecánica y en las complejas variables políticas y económicas que influyen en la industria.\nHoy, lo motiva la misma curiosidad de sus inicios: descubrir y manejar cada nuevo modelo que llega al país, para luego contar su experiencia de primera mano a la audiencia.",
        image: "/Juan.png",
        social: [
          // { icon: "/icons/instragram.png", alt: "instagram-icon" },
          { icon: "/icons/youtube.png", alt: "youtube-icon",url:'https://www.youtube.com/@ArgentinaMotor' },
          // { icon: "/icons/X- icon.png", alt: "x-icon" }
        ],
        reverse: true // indica que se debe invertir el orden en el layout
      }
    ]
  }
};
