import CertificateClient from './CertificateClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
    const resolved = await params;
    return {
        title: `Certificate · ${resolved?.code || ''}`,
    };
}

export default function CertificatePage({ params }) {
    return <CertificateClient params={params} />;
}
