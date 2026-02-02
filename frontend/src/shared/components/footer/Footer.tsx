import { FC } from "react";
import Logo from "../Logo";
import './Footer.css';
import { Box, Stack, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { FacebookIcon, InstagramIcon, TikTokIcon, XIcon } from "src/static/icons";

const Footer: FC = () => {
    return (
        <footer>
            <img src="/Logo-transparente.png" alt="Logo de decorativo" />
            <div>
            </div>
            <Stack direction={"row"} component={"section"} className="footer-content" >
                <Stack component={"section"} direction={"column"}>
                    <img src="/motorizando_word.svg" alt="Palabra logo"/>
                </Stack>
                <Stack component={"section"} spacing={2} direction={"row"}>
                    <Box component="div">
                        <Typography variant="h5" color="primary">Nuestra web</Typography>
                        <Stack component={"div"} direction={"column"} spacing={1}>
                            <NavLink to={"/inicio"}><Typography variant="h4">Inicio</Typography></NavLink>
                            <NavLink to={"/noticias"}><Typography variant="h4">Noticias</Typography></NavLink>
                            <NavLink to={"/lanzamientos"}><Typography variant="h4">Lanzamientos</Typography></NavLink>
                            <NavLink to={"/adelantos"}><Typography variant="h4">Adelantos</Typography></NavLink>
                        </Stack>
                    </Box>
                    <Box component="div">
                        <Typography variant="h5" color="primary">Redes</Typography>
                        <Stack component={"div"} direction={"row"} spacing={2} className="social-medias">
                            <a href="https://www.instagram.com/motorizandoarg/">
                                 <InstagramIcon/>
                                <Typography variant="h4">
                                    </Typography>
                            </a>
                            <a href="https://www.tiktok.com/@motorizandoarg">
                                <TikTokIcon/>
                                <Typography variant="h4">
                                    </Typography>
                            </a>
                            <a href="https://www.facebook.com/Motorizandoarg">
                               <FacebookIcon/>
                                <Typography variant="h4">
                                    </Typography>
                            </a>
                            <a href="https://x.com/motorizandoarg">
                                <XIcon/>
                                <Typography variant="h4">
                                    </Typography>
                            </a>
                        </Stack>
                    </Box>
                </Stack>
            </Stack>
            <div style={{display:"flex",alignItems:"center", justifyContent:"center",}}>
                <NavLink style={{ color:"white", margin:"auto", fontWeight:200, textDecoration:"none"}} to={"/terminos"}>Términos y Condiciones</NavLink>
                <NavLink style={{ color:"white", margin:"auto", fontWeight:200, textDecoration:"none"}} to={"/privacidad"}>Privacidad</NavLink>

            </div>
        </footer>
    )
}

export default Footer;