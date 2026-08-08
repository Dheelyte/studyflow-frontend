import PricingClient from './PricingClient';
import { PLANS } from '@/lib/plans';
import { SITE_URL, SITE_NAME } from '@/lib/site';

export const metadata = {
    title: 'Pricing | Primerly',
    description:
        'Take any course in the Primerly library free. Pro and Max raise the limits on the AI tutors and custom course generation.',
    alternates: { canonical: `${SITE_URL}/pricing` },
};

const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${SITE_NAME} Pro`,
    description:
        'Higher limits on Primerly’s AI tutors and custom course generation. All library courses, certificates, and community stay free on every plan.',
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: PLANS.map((plan) => ({
        '@type': 'Offer',
        name: `${plan.name} (monthly)`,
        price: plan.priceMonthly,
        priceCurrency: 'NGN',
        url: `${SITE_URL}/pricing`,
    })),
};

export default function PricingPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
            />
            <PricingClient />
        </>
    );
}
