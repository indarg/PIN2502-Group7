import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import './CRMNewsOutlet.css'

const CRMNewsOutlet: FC<any> = () => {
    return (
        <Outlet />
    )
}

export default CRMNewsOutlet