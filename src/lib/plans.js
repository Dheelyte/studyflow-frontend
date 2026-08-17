// Display copy for the pricing tiers. Enforcement lives in the backend
// (app/config.py limits) , keep these numbers in sync with it.

export const PLANS = [
    {
        id: 'free',
        name: 'Free',
        tagline: '',
        priceMonthly: 0,
        priceAnnual: 0,
        cta: 'Start learning free',
        features: [
            { label: 'Access courses, quizzes & projects', included: true },
            { label: 'chat tutor messages / day', value: '10' },
            { label: 'screen tutor questions / day', value: '5' },
        ],
    },
    {
        id: 'pro',
        name: 'Pro',
        tagline: '',
        priceMonthly: 4500,
        priceAnnual: 45000,
        cta: 'Go Pro',
        features: [
            { label: 'Everything in Free', included: true },
            { label: 'Create custom courses' },
            { label: 'chat tutor messages / day', value: '100' },
            { label: 'screen tutor questions / day', value: '30' },
        ],
    },
    {
        id: 'max',
        name: 'Max',
        tagline: '',
        priceMonthly: 10000,
        priceAnnual: 100000,
        recommended: true,
        cta: 'Go Max',
        features: [
            { label: 'Everything in Pro', included: true },
            { label: 'Unlimited tutor messages', value: '∞' },
            { label: 'Unlimited screen tutor questions', value: '∞' },
        ],
    },
];

export function formatNaira(amount) {
    if (!amount) return '₦0';
    return `₦${amount.toLocaleString('en-NG')}`;
}
