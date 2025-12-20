"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import { PlayIcon, ClockIcon, ChevronDown, ChevronUp, ZapIcon, HeartIcon, ShareIcon, MenuIcon, CheckCircleIcon, BookOpenIcon, VideoIcon } from "@/components/Icons";

export default function PlaylistPage({ params }) {
    const searchParams = useSearchParams();
    
    // Detailed Mock Data from JSON
    const curriculumData = {
    "curriculum_title": "Foundations of Data Analysis: From Spreadsheets to Code",
    "overview": "This 4-week intensive curriculum is designed to take a beginner from zero knowledge to a functional understanding of the modern data analyst toolkit. Learners will progress through the data analysis lifecycle, mastering Excel for data manipulation, SQL for database querying, Data Visualization principles for communication, and a basic introduction to Python for automated analysis.",
    "learning_objectives": [
        "Understand the six stages of the data analysis life cycle: Ask, Prepare, Process, Analyze, Share, and Act.",
        "Master advanced spreadsheet functions (VLOOKUP, Pivot Tables) for data cleaning and initial analysis.",
        "Write SQL queries to extract, filter, and aggregate data from relational databases.",
        "Apply data visualization best practices to create compelling charts and dashboards.",
        "Comprehend the basics of Python programming and the Pandas library for data handling."
    ],
    "modules": [
        {
            "module_id": 1,
            "module_title": "Week 1: Data Fundamentals & Spreadsheet Mastery",
            "lessons": [
                {
                    "lesson_title": "The Data Analysis Process",
                    "topics_covered": [
                        "Data Analysis vs. Data Science",
                        "Structured vs. Unstructured Data",
                        "The 6 Steps of Analysis",
                        "Data Ethics and Bias"
                    ],
                    "estimated_time": "2 hours",
                    "resources": [
                        {
                            "type": "Article",
                            "label": "The Data Analysis Process",
                            "description": "A comprehensive guide on the 5-6 steps of data analysis (Ask, Prepare, Process, Analyze, Share, Act).",
                            "resource_url": "https://www.coursera.org/articles/data-analysis-process"
                        },
                        {
                            "type": "Video",
                            "label": "What is Data Analysis?",
                            "description": "A high-level overview of what data analysts actually do day-to-day.",
                            "resource_url": "https://www.youtube.com/watch?v=5DKRk1Y2_XE"
                        }
                    ]
                },
                {
                    "lesson_title": "Excel Essentials: Cleaning and Formulas",
                    "topics_covered": [
                        "Data Cleaning (Removing duplicates, text to columns)",
                        "Logical Functions (IF, IFS)",
                        "Lookup Functions (VLOOKUP, XLOOKUP)",
                        "Conditional Formatting"
                    ],
                    "estimated_time": "4 hours",
                    "resources": [
                        {
                            "type": "Interactive",
                            "label": "Excel Formulas and Functions",
                            "description": "Hands-on tutorials for the most critical Excel functions.",
                            "resource_url": "https://edu.gcfglobal.org/en/excelformulas/"
                        },
                        {
                            "type": "Video",
                            "label": "Data Cleaning in Excel",
                            "description": "Techniques for preparing messy data for analysis.",
                            "resource_url": "https://www.youtube.com/watch?v=PrE3tJvWfGw"
                        }
                    ]
                },
                {
                    "lesson_title": "Aggregation with Pivot Tables",
                    "topics_covered": [
                        "Creating Pivot Tables",
                        "Slicers and Timelines",
                        "Calculated Fields",
                        "Pivot Charts"
                    ],
                    "estimated_time": "3 hours",
                    "resources": [
                        {
                            "type": "Article",
                            "label": "Create a PivotTable to Analyze Worksheet Data",
                            "description": "Official Microsoft guide to one of the most powerful tools in Excel.",
                            "resource_url": "https://support.microsoft.com/en-us/office/create-a-pivottable-to-analyze-worksheet-data-a9a84538-bfe9-40a9-a8e9-f99134456576"
                        }
                    ]
                }
            ]
        },
        {
            "module_id": 2,
            "module_title": "Week 2: Databases and SQL",
            "lessons": [
                {
                    "lesson_title": "Relational Databases & SQL Syntax",
                    "topics_covered": [
                        "What is a RDBMS?",
                        "Primary and Foreign Keys",
                        "SELECT, FROM, DISTINCT",
                        "Ordering Results"
                    ],
                    "estimated_time": "3 hours",
                    "resources": [
                        {
                            "type": "Interactive",
                            "label": "Intro to SQL: Querying and managing data",
                            "description": "Khan Academy's interactive environment to learn database concepts.",
                            "resource_url": "https://www.khanacademy.org/computing/computer-programming/sql"
                        }
                    ]
                },
                {
                    "lesson_title": "Filtering and Aggregating Data",
                    "topics_covered": [
                        "WHERE clauses and Operators",
                        "Aggregate Functions (COUNT, SUM, AVG, MIN, MAX)",
                        "GROUP BY and HAVING"
                    ],
                    "estimated_time": "3 hours",
                    "resources": [
                        {
                            "type": "Article",
                            "label": "SQL Aggregate Functions",
                            "description": "Reference and examples for summarizing data in SQL.",
                            "resource_url": "https://www.w3schools.com/sql/sql_count_avg_sum.asp"
                        }
                    ]
                },
                {
                    "lesson_title": "Joining Tables",
                    "topics_covered": [
                        "Understanding Joins (Inner vs. Outer)",
                        "LEFT JOIN, RIGHT JOIN",
                        "Unions"
                    ],
                    "estimated_time": "3 hours",
                    "resources": [
                        {
                            "type": "Video",
                            "label": "Visualizing SQL Joins",
                            "description": "A visual explanation of how Venn diagrams map to SQL join types.",
                            "resource_url": "https://www.youtube.com/watch?v=9yeOJ0ZMUYw"
                        },
                        {
                            "type": "Interactive",
                            "label": "SQL Joins Interactive Tutorial",
                            "description": "Practice writing queries that combine multiple tables.",
                            "resource_url": "https://sqlbolt.com/lesson/select_queries_with_joins"
                        }
                    ]
                }
            ]
        },
        {
            "module_id": 3,
            "module_title": "Week 3: Data Visualization and Storytelling",
            "lessons": [
                {
                    "lesson_title": "Principles of Data Visualization",
                    "topics_covered": [
                        "Choosing the Right Chart Type",
                        "Color Theory in Data",
                        "Decluttering Visuals",
                        "Cognitive Load"
                    ],
                    "estimated_time": "3 hours",
                    "resources": [
                        {
                            "type": "Article",
                            "label": "Data Visualization 101",
                            "description": "HubSpot's guide to designing charts and graphs.",
                            "resource_url": "https://blog.hubspot.com/marketing/data-visualization-guide"
                        },
                        {
                            "type": "Article",
                            "label": "Choosing the Right Chart",
                            "description": "A catalogue of chart types and when to use them.",
                            "resource_url": "https://datavizcatalogue.com/"
                        }
                    ]
                },
                {
                    "lesson_title": "Introduction to BI Tools (Tableau Public)",
                    "topics_covered": [
                        "Connecting to Data Sources",
                        "Dimensions vs. Measures",
                        "Building Basic Charts",
                        "Creating a Dashboard"
                    ],
                    "estimated_time": "5 hours",
                    "resources": [
                        {
                            "type": "Video",
                            "label": "Tableau for Beginners",
                            "description": "A full tutorial on getting started with the free version of Tableau.",
                            "resource_url": "https://www.youtube.com/watch?v=TPtlYQt9QB4"
                        },
                        {
                            "type": "Interactive",
                            "label": "Tableau Public Training Videos",
                            "description": "Official free training videos from Salesforce/Tableau.",
                            "resource_url": "https://www.tableau.com/learn/training/20214"
                        }
                    ]
                }
            ]
        },
        {
            "module_id": 4,
            "module_title": "Week 4: Introduction to Python for Data",
            "lessons": [
                {
                    "lesson_title": "Python Basics",
                    "topics_covered": [
                        "Variables and Data Types",
                        "Lists and Dictionaries",
                        "Loops and Functions",
                        "Jupyter Notebook Environment"
                    ],
                    "estimated_time": "3 hours",
                    "resources": [
                        {
                            "type": "Interactive",
                            "label": "Learn Python 3",
                            "description": "Codecademy or similar free interactive basic syntax course.",
                            "resource_url": "https://www.kaggle.com/learn/python"
                        }
                    ]
                },
                {
                    "lesson_title": "Data Analysis with Pandas",
                    "topics_covered": [
                        "Importing Pandas",
                        "DataFrames and Series",
                        "Reading CSV files",
                        "Basic filtering and descriptive statistics"
                    ],
                    "estimated_time": "4 hours",
                    "resources": [
                        {
                            "type": "Article",
                            "label": "10 Minutes to pandas",
                            "description": "The official documentation's quick start guide for new users.",
                            "resource_url": "https://pandas.pydata.org/docs/user_guide/10min.html"
                        },
                        {
                            "type": "Video",
                            "label": "Pandas Tutorial for Data Analysis",
                            "description": "A walk-through of analyzing real data using Python.",
                            "resource_url": "https://www.youtube.com/watch?v=vmEHCJofslg"
                        }
                    ]
                },
                {
                    "lesson_title": "Capstone: Putting it All Together",
                    "topics_covered": [
                        "Selecting a Dataset",
                        "Formulating Questions",
                        "Execution of Analysis",
                        "Final Presentation Structure"
                    ],
                    "estimated_time": "3 hours",
                    "resources": [
                        {
                            "type": "Article",
                            "label": "Data Analysis Portfolio Project Ideas",
                            "description": "Inspiration for a final project to verify learning.",
                            "resource_url": "https://www.dataquest.io/blog/data-science-portfolio-project/"
                        }
                    ]
                }
            ]
        }
    ]
};

    const [expandedModules, setExpandedModules] = useState({ 1: true });
    // isStarted state: initially false (hides progress bar, shows "Start Learning")
    const [isStarted, setIsStarted] = useState(false);
    
    // Mock state for liking
    const [isLiked, setIsLiked] = useState(false);
    const [highlightResource, setHighlightResource] = useState(false);

    const toggleModule = (id) => {
        setExpandedModules(prev => ({ ...prev, 1: true }));
    };

    const handlePlay = () => {
        if (!isStarted) {
            setIsStarted(true);
        }
        
        // Ensure first module is expanded
        setExpandedModules(prev => ({ ...prev, 1: true }));

        // Scroll and highlight
        setTimeout(() => {
            const firstResource = document.getElementById("first-resource");
            if (firstResource) {
                firstResource.scrollIntoView({ behavior: "smooth", block: "center" });
                setHighlightResource(true);
                setTimeout(() => setHighlightResource(false), 4500); // Remove highlight after user has definitely seen it
            }
        }, 100);
    };

    // Calculate Completion (Mock logic)
    const completionPercentage = 0; // Example value

    return (
        <div className={styles.container}>
            <div className={styles.headerBg}></div>
            <div className={styles.header}>
                <div className={styles.playlistImage}>
                    <ZapIcon size={64} fill="white" />
                </div>
                <div className={styles.playlistInfo}>
                    <span className={styles.type}>Curriculum</span>
                    <h1 className={styles.title}>{curriculumData.curriculum_title}</h1>
                    <p className={styles.description}>{curriculumData.overview}</p>
                    <div className={styles.meta}>
                        <div className={styles.metaItem}>
                            <span>By <strong>StudyFlow AI</strong></span>
                        </div>
                        <div className={styles.metaItem}>
                            <span>•</span>
                            <span>Last updated today</span>
                        </div>
                        <div className={styles.metaItem}>
                            <span>•</span>
                            <span>{curriculumData.modules.length} modules</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.controls}>
                <button className={styles.playButton} onClick={handlePlay}>
                    <PlayIcon size={24} fill="white" />
                    {isStarted ? "Continue Learning" : "Start Learning"}
                </button>
                
                <button 
                  className={styles.iconButton} 
                  onClick={() => setIsLiked(!isLiked)}
                  title={isLiked ? "Remove from Library" : "Save to Library"}
                  style={{ color: isLiked ? "var(--primary)" : "inherit" }}
                >
                    <HeartIcon fill={isLiked ? "currentColor" : "none" } />
                </button>
                
                <button className={styles.iconButton} title="Share Playlist">
                    <ShareIcon />
                </button>
                
                <button className={styles.iconButton} title="More Options">
                    <MenuIcon />
                </button>
            </div>
            
            {/* Progress Bar only shown if started */}
            {isStarted && (
                <div className={styles.progressContainer}>
                    <div className={styles.progressLabel}>
                        {/* ... existing progress UI kept simple for now */}
                        <span>Playlist Progress</span>
                        <span>{completionPercentage}% completed</span>
                    </div>
                    <div className={styles.progressBarBg}>
                        <div className={styles.progressBarFill} style={{ width: `${completionPercentage}%` }}></div>
                    </div>
                </div>
            )}

            <div className={styles.content}>
                
                {/* Learning Objectives Section */}
                <div className={styles.objectivesSection}>
                    <h2 className={styles.sectionTitle}>What You'll Learn</h2>
                    <ul className={styles.objectivesList}>
                        {curriculumData.learning_objectives.map((objective, idx) => (
                            <li key={idx} className={styles.objectiveItem}>
                                <div className={styles.checkIcon}><CheckCircleIcon size={20} /></div>
                                <span>{objective}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={styles.modulesContainer}>
                    <h2 className={styles.sectionTitle}>Curriculum Content</h2>
                    {curriculumData.modules.map(module => (
                        <div key={module.module_id} className={styles.module}>
                            <div className={styles.moduleHeader} onClick={() => toggleModule(module.module_id)}>
                                <span className={styles.moduleTitle}>{module.module_title}</span>
                                {expandedModules[module.module_id] ? <ChevronUp /> : <ChevronDown />}
                            </div>
                            
                            {expandedModules[module.module_id] && (
                                <div className={styles.moduleContent}>
                                    {module.lessons.map((lesson, lessonIdx) => (
                                        <div key={lessonIdx} className={styles.lesson}>
                                            <div className={styles.lessonHeader}>
                                                <h3 className={styles.lessonTitle}>{lesson.lesson_title}</h3>
                                                <span className={styles.lessonDuration}>
                                                    <ClockIcon size={14} /> {lesson.estimated_time}
                                                </span>
                                            </div>
                                            
                                            <div className={styles.lessonTopics}>
                                                <span className={styles.topicsLabel}>Topics:</span>
                                                <div className={styles.topicsContainer}>
                                                    {lesson.topics_covered.map((topic, tIdx) => (
                                                        <span key={tIdx} className={styles.topicBadge}>{topic}</span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className={styles.resourcesList}>
                                                {lesson.resources.map((resource, rIdx) => (
                                                    <a 
                                                        href={resource.resource_url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        key={rIdx} 
                                                        id={module.module_id === 1 && lessonIdx === 0 && rIdx === 0 ? "first-resource" : null}
                                                        className={`${styles.resourceCard} ${module.module_id === 1 && lessonIdx === 0 && rIdx === 0 && highlightResource ? styles.highlight : ""}`}
                                                    >
                                                        <div className={styles.resourceIcon}>
                                                            {resource.type === "Video" ? <VideoIcon size={20} /> : <BookOpenIcon size={20} />}
                                                        </div>
                                                        <div className={styles.resourceInfo}>
                                                            <div className={styles.resourceHeaderRow}>
                                                                <span className={styles.resourceLabel}>{resource.label}</span>
                                                                <span className={styles.resourceTypeBadge}>{resource.type}</span>
                                                            </div>
                                                            <p className={styles.resourceDescription}>{resource.description}</p>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
