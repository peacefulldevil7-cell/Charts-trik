# Charts-trik
Matka game charts analysis and prediction
# Historical Chart Analysis System

## Overview

Historical Chart Analysis System is a web-based application designed to analyze historical chart data using user-defined analysis rules.

This project is built for research, visualization, and historical pattern analysis only.

**This application does NOT predict future results and does NOT generate betting recommendations.**

---

# Features

## Data Import

- Excel (.xlsx)
- CSV
- JSON
- Manual Data Entry

---

## Chart Viewer

- Historical chart display
- Zoom
- Pan
- Search numbers
- Highlight numbers
- Responsive design

---

## Analysis Modules

### Action Number Analysis

Action Mapping

0 ↔ 5

1 ↔ 6

2 ↔ 7

3 ↔ 8

4 ↔ 9

Functions

- Detect action numbers
- Highlight action relationships
- Count action occurrences
- Pattern analysis

---

### Red Figure Analysis

Recognizes

00

11

22

33

44

55

66

77

88

99

Functions

- Highlight red figures
- Count occurrences
- Frequency report
- Pattern detection

---

### Horizontal Analysis

Analyze every row

Detect

- Repeated numbers
- Action relationships
- Red figures
- Missing values
- Chains
- Sequences

---

### Vertical Analysis

Analyze every column

Detect

- Repeated values
- Action relationships
- Cycles
- Mirror patterns
- Number chains

---

### Manual Analysis

Users can

- Draw colored lines
- Circle numbers
- Highlight cells
- Add notes
- Save analysis

Supported colors

- Green
- Blue
- Red
- Yellow
- Purple

---

## Search Engine

Search by

- Number
- Date
- Week
- Month
- Year
- Pattern
- Rule

---

## Statistics

Generate

- Frequency table
- Most repeated numbers
- Least repeated numbers
- Action number count
- Red figure count
- Monthly analysis
- Yearly analysis
- Heat map

---

## Pattern Library

Save discovered patterns.

Each pattern includes

- Name
- Description
- Date
- Rule
- Notes

---

## Custom Rule Engine

The application supports custom rule modules.

New rules can be added without modifying existing code.

Example

```
rules/

actionRule.js

redFigureRule.js

horizontalRule.js

verticalRule.js

mirrorRule.js

familyRule.js

customRule.js
```

---

# Folder Structure

```
project/

│

├── index.html

├── README.md

│

├── assets/

│   ├── images/

│   ├── icons/

│

├── css/

│   ├── style.css

│   ├── dashboard.css

│

├── js/

│   ├── app.js

│   ├── ui.js

│   ├── import.js

│

├── modules/

│   ├── analysisEngine.js

│   ├── statistics.js

│   ├── search.js

│

├── rules/

│   ├── actionRule.js

│   ├── redFigureRule.js

│   ├── horizontalRule.js

│   ├── verticalRule.js

│

├── data/

│

├── exports/

│

└── docs/
```

---

# Technologies

- HTML5
- CSS3
- JavaScript ES6
- Chart.js
- SheetJS
- IndexedDB
- Local Storage

---

# Project Goals

- Analyze historical chart data
- Identify user-defined patterns
- Visualize historical relationships
- Provide flexible analysis modules
- Support custom rule creation
- Export reports

---

# Roadmap

## Version 1

- Data Import
- Chart Viewer
- Action Analysis
- Red Figure Analysis
- Horizontal Analysis
- Vertical Analysis
- Search
- Statistics

---

## Version 2

- Pattern Builder
- Manual Drawing Tools
- Pattern Library
- PDF Reports
- Excel Reports

---

## Version 3

- AI-assisted historical pattern explanation
- Automatic rule suggestions
- Pattern similarity detection
- Advanced visualization

---

# Disclaimer

This project is intended solely for historical data analysis, visualization, and educational research.

It is **not** designed to predict future outcomes, provide gambling advice, or guarantee any results. Users are responsible for how they interpret and use the analysis.

---

# License

MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy of this software to use, modify, and distribute it under the terms of the MIT License.
