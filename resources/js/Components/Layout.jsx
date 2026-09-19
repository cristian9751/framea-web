import { Head } from '@inertiajs/react';
import Header from './Header';
import Footer from './Footer';
import Particles from './Particles';

export default function Layout({ title, description, children }) {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta
                    name="description"
                    content={description || 'ENTERPRISE - Servidor de SCP: Secret Laboratory en espanol'}
                />
                <meta
                    name="keywords"
                    content="SCP, Secret Laboratory, ENTERPRISE, servidor, gaming, horror, multiplayer"
                />
            </Head>
            <Particles />
            <Header />
            <main>{children}</main>
            <Footer />
        </>
    );
}
