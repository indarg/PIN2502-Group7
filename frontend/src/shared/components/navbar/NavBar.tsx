
import { Stack, Typography } from "@mui/material";
import { FC } from "react";
import { NavLink } from "react-router-dom";
import GlobalSearcher from "../global_searcher/GlobalSearcher";
import "./NavBar.css";

export const NavBar: FC = () => {

    return (
        <nav className="nav-bar">
            <div>
                <div className="nav-logo">
                    <NavLink to="/inicio">
                        <Stack flexDirection={"column"} spacing={1} width={120} >
                            <img src="/motorizando_logo.svg" alt="Pieza gráfica" />
                            <img src="/motorizando_word.svg" alt="Letras de logo"/>
                        </Stack>
                    </NavLink>
                </div>
                <div className="nav-search">
                    <GlobalSearcher ></GlobalSearcher>
                </div>
                <ul>
                    <li><NavLink to="/inicio" className={({ isActive }) => isActive ? "active-link" : ""}><Typography variant="button">Inicio</Typography></NavLink></li>
                    <li><NavLink to="/noticias" className={({ isActive }) => isActive ? "active-link" : ""}><Typography variant="button">Noticias</Typography></NavLink></li>
                    <li><NavLink to="/nosotros" className={({ isActive }) => isActive ? "active-link" : ""}><Typography variant="button">Nosotros</Typography></NavLink></li>
                </ul>
            </div>
        </nav>
    )
}
export default NavBar;