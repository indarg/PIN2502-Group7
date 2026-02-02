import { Box, Drawer } from '@mui/material';
import { FC, Fragment } from 'react';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export type TCustomDrawerProps = {
    anchor: Anchor,
    children?:React.ReactNode,
    open:boolean,
    handleClose:(value:boolean) => void,
    width?:number
}

export const CustomDrawer: FC<TCustomDrawerProps> = ({ anchor, children, open, handleClose,width = 250 }) => {

    return (
        <div>
            <Fragment key={anchor}>
                <Drawer
                    anchor={anchor}
                    open={open}
                    onClose={() => handleClose(false)}
                >
                    {
                        <Box
                            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : width }}
                            role="presentation"
                        >
                            {children}
                        </Box>
                    }
                </Drawer>
            </Fragment>

        </div>
    );
};