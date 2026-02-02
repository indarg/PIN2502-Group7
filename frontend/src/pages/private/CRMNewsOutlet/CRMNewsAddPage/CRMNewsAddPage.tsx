import { FC } from 'react';
import CRMNavToolbar from 'src/shared/components/crm-nav-toolbar/CRMNavToolbar';
import NewsForm from 'src/shared/components/news_form/NewsForm';
import './CRMNewsAddPage.css';

const CRMNewsAddPage: FC<any> = () => {
    
    return (
        <div className='crm-view'>
            <CRMNavToolbar title='Agregar Noticia'/>
            <NewsForm mode='create'/>
        </div>
    )
}

export default CRMNewsAddPage;