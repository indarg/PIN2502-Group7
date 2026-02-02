import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TTag } from 'src/models/TTag';
import './CRMTagEditPage.css';
import CRMNavToolbar from 'src/shared/components/crm-nav-toolbar/CRMNavToolbar';
import TagForm from 'src/shared/components/tag_form/TagForm';
import CRMTagService from 'src/services/CRMTagsService';

const CRMTagEditPage: FC<any> = () => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const { id } = useParams();
    const nav = useNavigate();
    const [tag, setTag] = useState<TTag | undefined>();
    useEffect(() => {
        id && init(id);
    }, [id]);

    const init = async (id: string) => {
        const service = new CRMTagService();
        try {
            const response = await service.get(id);
            setTag(response.payload);

        }
        catch (error) {
            nav(-1);
        }
    }
    return (
        <div className='crm-view'>
            <CRMNavToolbar title='Editar Etiqueta' />
            {tag && <TagForm createOrUpdate='update' tag={tag} />}
        </div>
    )
}

export default CRMTagEditPage;