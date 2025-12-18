"use client";
import { createContext, useContext, useState } from 'react';

const CommunityContext = createContext();

export function CommunityProvider({ children }) {
  // Mock Initial Data - Expanded for "Explore" list
  const [communities, setCommunities] = useState([
    { id: 'react', name: 'React Mastery', description: 'Everything React, Next.js and hooks.', memberCount: 1205, isJoined: true, tags: ['Frontend', 'JS'] },
    { id: 'python', name: 'Pythonistas', description: 'Data Science, ML, and Django.', memberCount: 890, isJoined: false, tags: ['Backend', 'AI'] },
    { id: 'design', name: 'UI/UX Design', description: 'Figma tips and design critiques.', memberCount: 450, isJoined: false, tags: ['Design'] },
    { id: 'rust', name: 'Rustacean Station', description: 'Memory safety and blazingly fast code.', memberCount: 320, isJoined: false, tags: ['Systems'] },
    { id: 'web3', name: 'Web3 Enthusiasts', description: 'Blockchain, Solidity, and DApps.', memberCount: 15400, isJoined: true, tags: ['Crypto', 'Dev'] },
    { id: 'productivity', name: 'Productivity Hacks', description: 'Optimize your learning workflow.', memberCount: 4320, isJoined: true, tags: ['LifeHack', 'Methods'] },
    { id: 'indie', name: 'Indie Hackers', description: 'Building profitable side projects.', memberCount: 8900, isJoined: true, tags: ['Business', 'SaaS'] },
    // Overflow Test Communities
    { id: 'ml', name: 'Machine Learning', description: 'Neural networks and deep learning.', memberCount: 12000, isJoined: true, tags: ['AI', 'Data'] },
    { id: 'cloud', name: 'Cloud Native', description: 'Kubernetes, Docker, and Serverless.', memberCount: 5600, isJoined: true, tags: ['DevOps', 'Infra'] },
    { id: 'gamedev', name: 'Game Dev', description: 'Unity, Unreal, and Godot.', memberCount: 3400, isJoined: true, tags: ['Gaming', 'C#'] },
    { id: 'cyber', name: 'Cybersecurity', description: 'Pentesting, InfoSec, and Cryptography.', memberCount: 2300, isJoined: true, tags: ['Security', 'Hacking'] },
    { id: 'mobile', name: 'Mobile Dev', description: 'Swift, Kotlin, and React Native.', memberCount: 8900, isJoined: true, tags: ['Mobile', 'App'] },
    { id: 'career', name: 'Career Growth', description: 'Resume reviews and interview prep.', memberCount: 15000, isJoined: true, tags: ['Jobs', 'Advice'] },
    // New additions for Explore list
    { id: 'dotnet', name: '.NET Developers', description: 'C#, ASP.NET Core, and Azure.', memberCount: 4100, isJoined: false, tags: ['Backend', 'MS'] },
    { id: 'flutter', name: 'Flutter Devs', description: 'Build beautiful native apps.', memberCount: 6700, isJoined: false, tags: ['Mobile'] },
    { id: 'agile', name: 'Agile & Scrum', description: 'Project management methodologies.', memberCount: 2100, isJoined: false, tags: ['Management'] },
    { id: 'devops', name: 'DevOps Culture', description: 'CI/CD pipelines and automation.', memberCount: 5500, isJoined: false, tags: ['Ops'] },
    { id: 'vue', name: 'Vue.js Vixens', description: 'The progressive framework community.', memberCount: 3800, isJoined: false, tags: ['Frontend'] },
    { id: 'go', name: 'Golang Gophers', description: 'Simple, reliable, and efficient software.', memberCount: 4900, isJoined: false, tags: ['Backend'] },
    { id: 'sql', name: 'SQL Masters', description: 'Database design and optimization.', memberCount: 7200, isJoined: false, tags: ['Data'] }
  ]);

  const [posts, setPosts] = useState([
    { id: 1, communityId: 'react', author: "Sarah Jenks", initials: "SJ", time: "2h ago", content: "Just finished the React hook module! The way useEffect handles dependencies finally clicked. 🚀", tag: "React Mastery", likes: 24, comments: [] },
    { id: 2, communityId: 'python', author: "David Chen", initials: "DC", time: "5h ago", content: "Anyone have good resources for visualizing neural networks?", tag: "Deep Learning", likes: 12, comments: [] },
    { id: 3, communityId: 'global', author: "StudyFlow Bot", initials: "SF", time: "1d ago", content: "Weekly Challenge: Complete 3 modules this week! 🏆", tag: "Challenge", likes: 156, comments: [] },
    { id: 4, communityId: 'react', author: "Mike Ross", initials: "MR", time: "30m ago", content: "Is Next.js 15 stable enough for production yet? The new params handling caught me off guard.", tag: "Discussion", likes: 8, comments: [] },
    { id: 5, communityId: 'react', author: "Jenny Kim", initials: "JK", time: "1h ago", content: "Building a dashboard with Recharts. It's surprisingly intuitive!", tag: "Showcase", likes: 45, comments: [] },
    { id: 6, communityId: 'python', author: "Alex V", initials: "AV", time: "6h ago", content: "Pandas 2.0 is a game changer. The PyArrow backend is so much faster.", tag: "Data Science", likes: 32, comments: [] },
    { id: 7, communityId: 'rust', author: "Ferris The Crab", initials: "FC", time: "2h ago", content: "Ownership and borrowing are hard, but the compiler error messages are basically love letters.", tag: "Rust", likes: 88, comments: [] },
    { id: 8, communityId: 'design', author: "Pixel Perfect", initials: "PP", time: "4h ago", content: "Dark mode isn't just inverting colors! You need to adjust saturation and contrast.", tag: "Tips", likes: 67, comments: [] },
    { id: 9, communityId: 'web3', author: "Satoshi Fan", initials: "SF", time: "10m ago", content: "Just deployed my first smart contract on Sepolia! Gas fees are crazy though.", tag: "Solidity", likes: 102, comments: [] },
    { id: 10, communityId: 'productivity', author: "Tim F", initials: "TF", time: "3h ago", content: "The Pomodoro technique combined with lofi beats is the ultimate focus hack.", tag: "Focus", likes: 230, comments: [] },
    { id: 11, communityId: 'indie', author: "Pieter L", initials: "PL", time: "1d ago", content: "Reached 00 MRR on my study tool! Consistency is key.", tag: "Milestone", likes: 540, comments: [] }
  ]);

  const [activeView, setActiveView] = useState('feed'); 

  // Actions
  const joinCommunity = (id) => {
    setCommunities(prev => prev.map(c => 
        c.id === id ? { ...c, isJoined: true, memberCount: c.memberCount + 1 } : c
    ));
  };

  const leaveCommunity = (id) => {
    setCommunities(prev => prev.map(c => 
        c.id === id ? { ...c, isJoined: false, memberCount: c.memberCount - 1 } : c
    ));
  };

  const createCommunity = ({ name, description, tags }) => {
    const newId = name.toLowerCase().replace(/\s+/g, '-');
    const newCommunity = {
        id: newId,
        name,
        description,
        memberCount: 1,
        isJoined: true,
        tags: tags.split(',').map(t => t.trim())
    };
    setCommunities([...communities, newCommunity]);
    return newId;
  };

  const createPost = (content, communityId = 'global') => {
     const newPost = {
        id: Date.now(),
        communityId,
        author: "You",
        initials: "ME",
        time: "Just now",
        content,
        tag: "General",
        likes: 0,
        comments: []
    };
    setPosts([newPost, ...posts]);
  };

  const getCommunity = (slug) => communities.find(c => c.id === slug);

  return (
    <CommunityContext.Provider value={{ 
        communities, 
        posts, 
        activeView, 
        setActiveView, 
        joinCommunity, 
        leaveCommunity, 
        createCommunity,
        createPost,
        getCommunity
    }}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  return useContext(CommunityContext);
}
