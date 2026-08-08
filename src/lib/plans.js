// Display copy for the pricing tiers. Enforcement lives in the backend
// (app/config.py limits) , keep these numbers in sync with it.

export const PLANS = [
    {
        id: 'free',
        name: 'Free',
        tagline: 'Everything you need to learn anything.',
        priceMonthly: 0,
        priceAnnual: 0,
        cta: 'Start learning free',
        features: [
            { label: 'Unlimited library courses, quizzes & projects', included: true },
            { label: 'tutor messages / day', value: '10' },
            { label: 'screen tutor questions / day', value: '5' },
        ],
    },
    {
        id: 'pro',
        name: 'Pro',
        tagline: 'For learners who live in the AI tutor.',
        priceMonthly: 4500,
        priceAnnual: 45000,
        cta: 'Go Pro',
        features: [
            { label: 'Everything in Free', included: true },
            { label: 'Create custom courses' },
            { label: 'tutor messages / day', value: '100' },
            { label: 'screen tutor questions / day', value: '30' },
        ],
    },
    {
        id: 'max',
        name: 'Max',
        tagline: 'No meters. Just learning.',
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
