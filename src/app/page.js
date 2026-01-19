import HomeClient from './HomeClient';

export const metadata = {
    // Metadata for the root page is often inherited from layout, but we can override or be specific if needed.
    // Actually, standard practice for Home is often just "Brand - Tagline" which the template handles if we set title: 'Home' -> "Home | Brand"
    // OR we might want explicitly just "Brand" or "Brand: Tagline".
    // The layout has template: '%s | Primerly' and default: 'Primerly'.
    // If we don't export metadata here, it uses default.
    // Ideally, home page is just "Primerly", so we rely on default.
    // However, I'll export it for clarity if we want to change it later, 
    // but to match "Primerly" exactly, we might rely on the layout default or override the template.
    // Let's stick to layout default for now, BUT since I'm refactoring it, I need this file to exist.
    // If I export empty metadata, it merges.
    // Let's explicitly set it to something friendly like "Learn Anything" to test the template.
    title: 'Primerly | Learn Anything With An AI Roadmap',
};

export default function HomePage() {
    return <HomeClient />;
}