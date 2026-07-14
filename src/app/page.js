import HomeClient from './HomeClient';

export const metadata = {
    title: 'Primerly | Turn YouTube into your structured learning path.',
    description:
        'Type what you want to learn. Primerly pulls the right YouTube videos into a structured course, an AI tutor explains anything fuzzy, and you earn a verifiable certificate when you finish.',
};

export default function HomePage() {
    return <HomeClient />;
}