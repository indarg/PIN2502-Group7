import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import './CRMTagsOutlet.css';

const CRMTagsOutlet: FC<any> = () => {
    return (
        <Outlet />
    )
}

export default CRMTagsOutlet