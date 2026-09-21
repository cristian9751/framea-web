import { useState } from 'react';
import { Head } from '@inertiajs/react';
import TopHeader from './TopHeader';
import MobileFloatingControls from './MobileFloatingControls';
import Footer from '../Footer';

export default function PageLayout({ title, description, children }) {
    const [toast, setToast] = useState('');

    function showToast(m) {
        setToast(m);
        window.clearTimeout(showToast._t);
        showToast._t = window.setTimeout(function () { setToast(''); }, 2400);
    }

    return (
        <div className="relative flex min-h-screen flex-col bg-enterprise-bg font-[Arial,Helvetica,sans-serif] text-[#d6d8dc]">
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
            <TopHeader showToast={showToast} />
            <main className="relative z-[2] min-w-0 flex-1 pt-[64px]">
                {children}
            </main>
            {toast && (
                <div className="fixed bottom-[18px] left-1/2 z-[80] -translate-x-1/2 border border-enterprise-border bg-enterprise-card px-3.5 py-[7px] text-[11px] text-enterprise-primary">
                    {toast}
                </div>
            )}
            <Footer />
            <MobileFloatingControls showToast={showToast} />
        </div>
    );
}
