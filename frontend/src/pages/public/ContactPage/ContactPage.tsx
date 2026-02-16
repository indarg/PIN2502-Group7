import { FC } from 'react';
import Divider from 'src/shared/components/divider/Divider';
import NavBar from 'src/shared/components/navbar/NavBar';
import Section from 'src/shared/components/Section/Section';

const ContactPage: FC<any> = () => {
    return (
        <main>
            <NavBar/>
            <Section classname='contact'>
                <div>
                    Contacto
                </div>
            </Section>
        </main>
    )
}

export default ContactPage;