import { usePage } from '@inertiajs/react';
import { Settings } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';

export default function MobileFloatingControls({ showToast }) {
    const { auth } = usePage().props;
    const name = auth?.user?.name || null;

    return (
        <div className="hidden max-md:flex fixed right-4 bottom-4 z-40 items-center gap-2.5 rounded-[18px] border border-enterprise-border bg-[rgba(45,36,73,0.85)] p-2 shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-[8px]">
            <Button
                variant="ghost"
                size="icon-sm"
                aria-label="settings"
                onClick={() => showToast('Ajustes — pronto')}
                className="h-[39px] w-[39px] bg-transparent text-[#4a4e56] hover:text-enterprise-primary"
            >
                <Settings size={21} strokeWidth={1.5} />
            </Button>
            <Avatar className="h-[39px] w-[39px] rounded-full border border-enterprise-border bg-enterprise-card">
                <AvatarFallback className="bg-transparent text-[14px] text-[#8aa0b8]">
                    {(name || 'F').charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>
        </div>
    );
}