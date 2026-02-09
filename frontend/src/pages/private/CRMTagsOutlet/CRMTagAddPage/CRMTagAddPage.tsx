import { FC, useState } from 'react';
import './CRMTagAddPage.css';
import CRMNavToolbar from 'src/shared/components/crm-nav-toolbar/CRMNavToolbar';
import TagForm from 'src/shared/components/tag_form/TagForm';

const CRMTagAddPage: FC<any> = () => {
    const [isLoading, setLoading] = useState<boolean>(false);

    return (
        <div className='crm-view'>
            <CRMNavToolbar title='Agregar etiqueta' />
            <TagForm createOrUpdate='create' />
        </div>
    )
}

export default CRMTagAddPage;