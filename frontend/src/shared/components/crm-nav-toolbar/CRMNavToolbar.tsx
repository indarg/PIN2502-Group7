import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './CRMNavToolbar.css';
import { useCRMCommon } from 'src/context/CRMCommonContext/useCRMCommon';
type Props = {
    title: string
}

export default function CRMNavToolbar({ title }: Props) {
    const nav = useNavigate();
    const { changesMade, setConfirmationModal, goFoward } = useCRMCommon();



    return (
        <nav className='crm-nav-toolbar'>
            <Typography fontWeight={900} variant="h3" color='primary' gutterBottom>
                {title}
            </Typography>
            <Button onClick={() => !changesMade ? nav(-1) : setConfirmationModal({ action: () => goFoward(() => nav(-1)), show: true, message: "Se han detectado cambios, si continua con la acción los descartará" })}>
                <ArrowBackIcon />
            </Button>
        </nav>

    )
}