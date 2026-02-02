import { FC, useState } from 'react';
import './CRMYouTubeVideoAddPage.css';
import CRMNavToolbar from 'src/shared/components/crm-nav-toolbar/CRMNavToolbar';
import YoutubeVideoForm from 'src/shared/components/youtube_form/YoutubeVideoForm';

const CRMYouTubeVideoAddPage: FC<any> = () => {

    return (
        <div className='crm-view'>
            <CRMNavToolbar title='Agregar video' />
            <YoutubeVideoForm createOrUpdate='create' />
        </div>
    )
}

export default CRMYouTubeVideoAddPage;