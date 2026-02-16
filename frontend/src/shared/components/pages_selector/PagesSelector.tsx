import { Box, IconButton, Button, Stack, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

type TProps = {
    count: number; // total de páginas
    moveTo: (page: number) => void;
    maxVisiblePages?: number
};

const PagesSelector: FC<TProps> = ({ count, moveTo, maxVisiblePages = 10 }) => {
    const [pageSelected, setPageSelected] = useState<number>(1); // comenzamos en la página 1
    const handleMove = (page: number) => {
        if (page < 1 || page > count) return;
        setPageSelected(page);
        moveTo(page);
    };

    const getVisiblePages = (): number[] => {
        if (count <= maxVisiblePages) {
            return Array.from({ length: count }, (_, i) => i + 1);
        }

        const pages: number[] = [];

        const showAll = maxVisiblePages;
        const half = Math.floor(showAll / 2);

        if (pageSelected <= half + 1) {
            // al inicio
            for (let i = 1; i <= showAll; i++) {
                pages.push(i);
            }
        } else if (pageSelected >= count - half) {
            // al final
            for (let i = count - showAll + 1; i <= count; i++) {
                pages.push(i);
            }
        } else {
            // en el medio
            const start = pageSelected - Math.floor(showAll / 2);
            for (let i = 0; i < showAll; i++) {
                pages.push(start + i);
            }
        }

        return pages;
    };

    const visiblePages = getVisiblePages();
    const showLeftDots = visiblePages[0] > 1;
    const showRightDots = visiblePages[visiblePages.length - 1] < count;

    return (
        <Stack flexDirection={"row"} justifyContent={"center"} alignItems="center" gap={1} margin={"10px 0"}>

            <IconButton
                disabled={pageSelected === 1}
                onClick={() => handleMove(pageSelected - 1)}
            >
                <KeyboardArrowLeftIcon />
            </IconButton>

            {showLeftDots && <span>...</span>}

            {visiblePages.map((page) => (
                <Button
                    sx={{
                        color: pageSelected !== page ? "white" : "primary",
                        fontWeight: pageSelected !== page ? "300" : "900"
                    }}
                    key={page}
                    variant={"text"}
                    onClick={() => pageSelected !== page && handleMove(page)}
                >
                    {page}
                </Button>
            ))}

            {showRightDots && <span>...</span>}

            <IconButton
                disabled={pageSelected === count}
                onClick={() => handleMove(pageSelected + 1)}
            >
                <ChevronRightIcon />
            </IconButton>
        </Stack>
    );
};

export default PagesSelector;
