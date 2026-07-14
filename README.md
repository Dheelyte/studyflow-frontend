# Primerly

**Master any skill with your personal AI tutor.**

Primerly is a learning platform that turns "I want to learn X" into a complete, personalized course in seconds. Tell it what you want to master - *Data Analysis*, *Public Speaking*, *Watercolor Painting*, *React Hooks*, *Music Theory* - and Primerly builds you a full learning path: curated videos, lessons, quizzes, an AI tutor that explains anything on demand, and a community of people learning the same thing alongside you.

This repository contains everything that powers Primerly: the website you see, the brain that generates the courses, and the systems that track your progress.

---

## Who is this for?

Primerly is built for people who want to learn something new but don't know where to start, get lost in endless YouTube tabs, or lose motivation halfway through a course.

That includes:

- **Students** preparing for exams or going deeper than the syllabus
- **Career switchers** picking up a new skill (tech, design, marketing, finance, anything)
- **Self-taught learners** who'd rather follow a real plan than wander through tutorials
- **Hobbyists** finally learning the guitar, the language, or the recipe technique they keep putting off
- **Working professionals** topping up specific skills in short, focused sessions

If "I'd love to learn that, but I don't have time to figure out *how* to learn it" sounds familiar - Primerly is for you.

---

## What does Primerly actually do?

Think of Primerly as a tutor, librarian, study buddy, and motivational coach in one place. Here's what happens when you use it:

### 1. You tell Primerly what you want to learn
You type a topic - anything from *"Cybersecurity Fundamentals"* to *"History of Jazz"*. You can pick how deep you want to go (beginner, intermediate, advanced) and roughly how much time you want to spend.

### 2. Primerly builds your roadmap
Behind the scenes, Primerly's AI assembles a structured course just for you: clear modules, lessons in the right order, hand-picked videos and reading material, and quizzes to lock in what you learn. No more "where do I even start?"

### 3. You learn at your own pace, with help on tap
Each lesson has a curated video plus written notes. If something doesn't click, you tap **Explain this ✨** and an AI tutor breaks the concept down for you, in plain language, without making you feel silly for asking.

### 4. You prove you've learned it
At the end of every module, Primerly generates a short quiz to make sure the ideas actually stuck. You get instant feedback on what you got right, what you missed, and why.

### 5. You stay motivated
Primerly tracks your **streaks** (consecutive days of study), awards **XP** for progress, and shows your activity on a heatmap - so you can see your effort building up over time. It's the Duolingo-style "I don't want to break my streak" feeling, but for any subject.

### 6. You learn alongside other people
Primerly has a built-in **community**: topic-specific channels where learners ask questions, share progress, and cheer each other on. You're never the only person stuck on the same concept.

---

## Why Primerly exists

The internet has more learning material than any human could finish in a lifetime. The problem isn't access - it's *direction*. Most people who try to teach themselves something hit the same three walls:

1. **The "where do I start?" wall.** Ten browser tabs, three YouTube playlists, no plan.
2. **The "I don't get this part" wall.** A tutorial moves on; you don't, and there's no one to ask.
3. **The "I'll come back tomorrow" wall.** Tomorrow becomes next week, then next month.

Primerly is designed specifically to break those three walls - with an AI that gives you a real plan, an AI tutor that answers "explain this again, simpler", and gamification + community that make coming back tomorrow feel like a small win, not a chore.

---

## What's inside this repository

The project is split into two parts that work together:

### `studyflow-frontend/` - the website
This is what you actually see and click on. It's the homepage, the course view, the quiz screens, the community feed, your dashboard with streaks and XP, the login/signup pages - everything visual.

It's built with **Next.js** (a popular framework for modern websites) and **React**. The animated explainer videos on the homepage (the "How it works" section) are made with **Remotion**, a tool for creating videos in code.

### `studyflow-backend/` - the brain
This is the part you don't see but couldn't live without. It does all the thinking and remembering:

- Generates your personalized course when you submit a topic
- Generates the quiz at the end of each module
- Stores your progress, your streak, your XP, your community posts
- Handles signing up, logging in, and password resets
- Sends you welcome emails and password reset emails

The backend uses **FastAPI** (a Python web framework) and connects to a **PostgreSQL database** to remember everything. The AI that builds courses and quizzes is powered by **Google Gemini** through a tool called **LangChain**.

---

## How the pieces fit together

Here's the simple picture:

```
You (in your browser)
        │
        ▼
 ┌────────────────┐    asks for courses, quizzes,    ┌────────────────┐
 │   Frontend     │  ───────────────────────────▶    │    Backend     │
 │  (the website) │  ◀───────────────────────────    │  (the brain)   │
 └────────────────┘    sends back content & data     └────────────────┘
                                                              │
                                                              ▼
                                                    ┌──────────────────┐
                                                    │   AI (Gemini)    │
                                                    │  Builds courses  │
                                                    │  Writes quizzes  │
                                                    └──────────────────┘
                                                              │
                                                              ▼
                                                    ┌──────────────────┐
                                                    │    Database      │
                                                    │ Saves progress,  │
                                                    │ streaks, posts,  │
                                                    │ accounts...      │
                                                    └──────────────────┘
```

You click around the website. The website asks the backend for things ("build me a course on Python", "save that I finished this lesson", "give me my XP"). The backend talks to the AI when it needs to *create* something new, and to the database when it needs to *remember* something. Then the answer travels back to your screen.

---

## What can you do today?

The platform currently supports:

- Generating a complete personalized course from a single topic prompt
- Watching curated lessons inside a clean, distraction-free player
- Asking the AI tutor to explain any concept on demand
- Taking AI-generated quizzes at the end of each module
- Tracking your progress through every lesson, module, and course
- Building daily learning streaks and earning XP
- Signing up with email or with Google, GitHub, or Apple
- Joining topic-based communities, posting, commenting, and liking
- Recovering forgotten passwords by email
- Joining a waitlist for new features

---

## Glossary (for the curious)

If you're poking around the codebase or talking to engineers, here are the words you'll see:

- **Frontend** - the part of the app you see in your browser.
- **Backend** - the server-side part that stores data and runs the AI.
- **API** - the "menu" the frontend uses to ask the backend for things.
- **Database** - where all your account info, progress, and posts are saved.
- **AI / LLM** - the large language model (Google Gemini) that writes courses and quizzes.
- **Curriculum / Playlist** - Primerly's word for one personalized course.
- **Module** - a section of a course (a course has several modules).
- **Lesson / Resource** - a single video or note inside a module.
- **Quiz** - a short test the AI generates after each module.
- **XP** - experience points; you earn them by completing lessons and quizzes.
- **Streak** - how many days in a row you've studied.

---

## A note on the name

You may see the project referred to as **StudyFlow** in some places (folder names, internal labels). **Primerly** is the public-facing brand name. They're the same product - Primerly is what users see, StudyFlow is the internal codename it grew up with.

---

## Want to learn more?

- The frontend has its own technical README in `studyflow-frontend/README.md`
- The backend has its own technical README in `studyflow-backend/README.md`
- The homepage itself is the best demo - it explains the product visually with animated walkthroughs of every feature.

Built with the belief that anyone can learn anything, given the right plan, the right help, and a little encouragement to come back tomorrow. 💜
