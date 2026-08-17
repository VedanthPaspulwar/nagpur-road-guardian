# Nagpur Guardian

Build a Complete AI-Based Traffic Risk Heatmap & Police Deployment Decision Support System for Nagpur City

Create a modern, professional, responsive AI-powered Traffic Risk Heatmap and Police Deployment Decision Support System for Nagpur Traffic Police.

The system should act as a control-room dashboard that helps traffic commanders answer:

“Where should limited traffic-police personnel be deployed right now, why are they needed there, and how should deployment change when traffic conditions change?”

Use simulated/anonymized data for the prototype. Do not require access to confidential police systems or live CCTV feeds.

1. DESIGN & UI

Create a premium Smart City / AI Control Room interface.

Theme

Dark navy / blue technology theme

Professional police control-room appearance

White/light text

Blue primary buttons

Red = High Risk

Orange/Yellow = Medium Risk

Green = Low Risk

Cyan = information/AI elements

Modern glassmorphism panels where appropriate

Subtle shadows and borders

Smooth hover animations

Responsive on desktop, tablet and mobile

The interface must look like a real government traffic command center, not like a basic student website.

2. MAIN DASHBOARD

Create a left sidebar with:

Nagpur Traffic Police logo/icon

Dashboard

Risk Heatmap

Risk Analysis

Deployment Planner

Incidents

CCTV Monitor

Reports

Personnel

Settings

At the bottom of the sidebar show:

Quick Stats

Total Junctions: 126

High Risk Locations: 18

Active Incidents: 7

Available Officers: 42

Deployed Officers: 58

3. TOP KPI CARDS

At the top of the dashboard display four large cards:

High Risk Locations

Example:
18

Show:
“↑ 3 from yesterday”

Use red.

Active Incidents

Example:
7

Show:
“↑ 2 from last hour”

Use orange.

Available Officers

Example:
42

Show:
“64% of total force”

Use yellow.

Average Response Time

Example:
12.4 min

Show:
“↓ 2.1 min improvement”

Use green.

These values must update dynamically when simulated events occur.

4. REAL NAGPUR INTERACTIVE MAP

This is a very important feature.

Use Leaflet.js + OpenStreetMap to create a real interactive map centered on:

Nagpur, Maharashtra, India

Coordinates approximately:
21.1458, 79.0882

The map must support:

Zoom in

Zoom out

Pan

Map controls

Location markers

Risk visualization

Clickable locations

Popups

Do NOT create only a fake CSS map.

Use an actual interactive geographical map.

5. TRAFFIC RISK HEATMAP

Display traffic-risk locations on the Nagpur map.

Use color-coded markers/heat zones:

🔴 High Risk

Risk score:
80–100

🟠 Medium Risk

Risk score:
60–79

🟢 Low Risk

Risk score:
0–59

Use glowing circular markers or heatmap-style circles.

Example locations:

Sitabuldi Junction

Sadar Square

Mankapur Road

Dharampeth Junction

Reshimbagh Square

MIHAN Road

Each location should contain:

Location name

Risk score

Risk level

Number of incidents

Traffic congestion level

Violations

Road obstruction status

Police coverage

Recommended officers

6. MAP POPUP

When the user clicks a location marker, show a detailed popup.

Example:

Sitabuldi Junction

Risk Score: 92/100

Risk Level:
🔴 HIGH

Reasons:

Heavy congestion

Frequent traffic violations

Recent accidents

High pedestrian density

Current Police Coverage:
1 Officer

Recommended Deployment:
4 Officers

Status:
⚠️ Under-covered

Buttons:

View Details

Deploy Officers

7. AI RISK SCORING MODEL

Create a simulated AI risk-scoring system.

Calculate the risk score using factors such as:

Traffic congestion

Accident frequency

Traffic violations

Illegal parking

Road obstruction

Pedestrian density

Weather

Road work

Public events

Current police coverage

Example conceptual scoring:

Risk Score =
Congestion × Weight
+
Accidents × Weight
+
Violations × Weight
+
Obstructions × Weight
+
Pedestrian Density × Weight
+
Weather × Weight
+
Events × Weight

Police Coverage × Safety Factor

Normalize the final result to:

0–100

Make the scoring explainable.

Do not just show:

“Risk = 92”

Instead show:

Why is this location high risk?

Example:

Congestion: +25

Recent accidents: +22

Violations: +18

Road obstruction: +12

Pedestrian density: +10

Current police coverage: -5

Final Risk Score: 82/100

8. AI DEPLOYMENT RECOMMENDATION

Create an AI Deployment Recommendations panel.

Rank locations according to risk.

Example:

1. Sitabuldi Junction

🔴 High Risk

Risk Score:
92/100

Reason:
Heavy congestion, frequent violations and recent accidents.

AI Recommendation:
Deploy 4 Officers

2. Sadar Square

🔴 High Risk

Risk Score:
87/100

Reason:
Road obstruction, high pedestrian density and signal jumping.

AI Recommendation:
Deploy 3 Officers

3. Mankapur Road

🟠 Medium Risk

Risk Score:
68/100

Reason:
Market congestion and parking problems.

AI Recommendation:
Deploy 2 Officers

9. OPERATOR CONTROL

Every AI recommendation must have three options:

Accept

Accept the AI recommendation.

Modify

Allow the authorized operator to change the number of officers.

Example:

AI Recommendation:
4 Officers

Operator changes:
3 Officers

Then:
Confirm Deployment

Reject

Reject the AI recommendation.

Show a reason field:

“Why are you rejecting this recommendation?”

This demonstrates manual override functionality.

10. PERSONNEL DEPLOYMENT PLANNER

Create a dedicated Deployment Planner section.

Show:

Available Officers

42

Currently Deployed

58

Officers Required

11

Show a table:

LocationRiskCurrent OfficersRecommendedDifferenceSitabuldi9214+3Sadar8713+2Mankapur6812+1

Highlight locations that are:

HIGH RISK + UNMANNED

with a red warning:

⚠️ HIGH PRIORITY — CURRENTLY UNMANNED

11. OPTIMIZED POLICE ALLOCATION

Create a simple personnel allocation algorithm.

The algorithm should:

Rank locations by risk score.

Check current police coverage.

Detect under-covered locations.

Check available officers.

Prioritize high-risk locations.

Allocate officers.

Avoid allocating more officers than available.

Recalculate allocation when an incident occurs.

Example:

Available Officers = 8

Recommendations:

Sitabuldi → 4
Sadar → 3
Mankapur → 2

Total Required = 9

The system must intelligently prioritize the highest-risk locations instead of allocating 9 officers.

12. DYNAMIC INCIDENT SIMULATION

Add a button:

+ Simulate Incident

When clicked, simulate a new event such as:

Accident

Road obstruction

Heavy congestion

Illegal parking

Signal failure

Public event

Road work

Example:

New Incident Detected

Location:
Sitabuldi Junction

Type:
Accident

Severity:
High

The system must automatically:

Increase the risk score.

Update the heatmap.

Update the ranking.

Update active incidents.

Detect whether the location is under-covered.

Recalculate police deployment.

Update AI recommendation.

Show a notification.

Example:

Before:
Sitabuldi Risk = 82

After Accident:
Sitabuldi Risk = 94

AI Recommendation:
Deploy 4 Officers Immediately

13. RECENT INCIDENTS PANEL

Create a Recent Incidents panel.

Example:

Accident Reported

Sitabuldi Junction
10:15 AM
🔴 High

Road Obstruction

Sadar Square
09:58 AM
🔴 High

Illegal Parking

Dharampeth Road
09:41 AM
🟠 Medium

Road Work

Mankapur Road
09:20 AM
🟢 Low

Add:

View All

14. HIGH-RISK LOCATION TABLE

Create a ranked table:

#LocationRisk ScoreMain ReasonsTrendAction1Sitabuldi Junction92Congestion, Accidents↑Details2Sadar Square87Obstruction, Violations↑Details3Mankapur Road68Market, Parking↑Details4Dharampeth Junction63Peak Congestion—Details5Reshimbagh Square58School Zone↑Details

Add a Details button for every row.

15. RISK ANALYSIS PAGE

Create a Risk Analysis page containing:

Risk score trends

Hourly traffic risk

Daily incident trends

Accident trends

Violation trends

Congestion trends

High-risk location comparison

Use attractive charts.

Example charts:

Risk by Location

Bar chart

Incidents by Hour

Line chart

Risk Trend

Line chart

Incident Types

Donut/Pie chart

16. CCTV MONITOR PAGE

Create a simulated CCTV monitoring page.

Do NOT require real CCTV.

Use simulated camera cards:

Camera 01 — Sitabuldi

Camera 02 — Sadar

Camera 03 — Mankapur

Camera 04 — Dharampeth

Each camera should show a simulated traffic image/video placeholder and:

Traffic density

Vehicle count

Pedestrian count

Detected violations

AI status

Example:

AI Detection
Vehicles: 84
Pedestrians: 31
Violations: 7
Congestion: HIGH

17. REPORTS PAGE

Create reports such as:

Daily Risk Report

Police Deployment Report

Incident Report

High-Risk Location Report

Add buttons:

Generate Report

Export CSV

Print Report

18. PERSONNEL PAGE

Show police personnel statistics:

Total Officers

Available

Deployed

On Leave

Emergency Reserve

Create a table:

Officer ID
Name
Current Location
Status
Assigned Area

Use simulated data only.

19. NOTIFICATIONS

Create notification system.

Examples:

🔴 New accident detected

🟠 Risk score increased at Sadar Square

⚠️ High-risk location currently unmanned

🟢 Deployment accepted

🔵 AI recommendation updated

Show a notification badge in the header.

20. SEARCH & FILTERS

Add filters:

Risk Level

All

High

Medium

Low

Time

Live Now

Morning Peak

Afternoon

Evening Peak

Night

Incident Type

Accident

Congestion

Violation

Parking

Obstruction

Road Work

Event

Police Coverage

Covered

Under-covered

Unmanned

21. LIVE STATUS

Header should display:

🟢 System Online

Current time

Weather:
32°C

Operator:
Control Room

Data Source:
Simulated / Anonymized Data

Clearly mention that this is a prototype and does not connect to confidential police systems.

22. AI EXPLANATION PANEL

Create an AI assistant panel called:

Traffic AI Assistant

It should answer questions using the simulated dashboard data.

Example questions:

“Where should officers be deployed right now?”

Answer:

“Sitabuldi Junction has the highest risk score of 92/100 and is currently under-covered. Deploy 4 officers.”

Another:

“Why is Sadar high risk?”

Answer:

“Sadar has high pedestrian density, road obstruction and frequent signal violations.”

Another:

“What changed after the accident?”

Answer:

“Sitabuldi's risk increased from 82 to 94. The system recommends immediate deployment of 4 officers.”

23. DATABASE / DATA STRUCTURE

For the prototype, use simulated JSON data.

Create data structures for:

Locations

id

name

latitude

longitude

riskScore

congestion

accidents

violations

parking

obstruction

pedestrianDensity

policeCoverage

recommendedOfficers

Incidents

id

type

location

severity

timestamp

status

Officers

id

name

status

currentLocation

24. TECHNOLOGY

Use:

Frontend

HTML5

CSS3

JavaScript

or preferably:

React

Tailwind CSS

Map

Leaflet.js + OpenStreetMap

Charts

Use Chart.js.

Icons

Use Lucide Icons or Font Awesome.

For the prototype, simulated data is sufficient.

Keep the architecture ready for a future backend/API.

25. IMPORTANT FUNCTIONAL REQUIREMENTS

The prototype must actually work.

Do not create static buttons.

These must work:

Map zoom

Map markers

Marker popups

Risk filters

Incident simulation

Risk score update

AI recommendation update

Officer count update

Accept recommendation

Modify recommendation

Reject recommendation

Deployment calculation

Search

Table sorting/filtering

Charts

Notifications

26. BASELINE VS AI DEPLOYMENT COMPARISON

Create a section:

Current Deployment vs AI Recommended Deployment

Example:

Current Deployment

Average response time:
18.5 min

Uncovered high-risk locations:
5

Coverage efficiency:
61%

AI Recommended

Average response time:
12.4 min

Uncovered high-risk locations:
1

Coverage efficiency:
84%

Display this using comparison cards and charts.

Clearly label these as simulated prototype metrics, not real Nagpur Police performance data.

27. PRIVACY & ETHICS

Add a small footer/info section:

Privacy & Ethics

Uses simulated/anonymized data.

No confidential police information required.

No facial recognition.

No individual-level profiling.

AI recommendations are decision-support only.

Authorized operators retain final control.

Every AI recommendation should be explainable.

Manual override is always available.

28. FOOTER

Footer:

Nagpur Traffic Police — AI Decision Support System

“AI Powered • Safer Roads”

Data Source:
Simulated Data

System Status:
🟢 Online

Prototype Version:
v1.0

29. FINAL GOAL

The final website should demonstrate all of the following:

✅ Traffic-risk scoring model
✅ Interactive Nagpur map
✅ Color-coded risk heatmap
✅ High/Medium/Low risk areas
✅ Ranked high-risk locations
✅ Detection of unmanned locations
✅ Detection of under-covered locations
✅ Limited-officer allocation algorithm
✅ Dynamic incident simulation
✅ Automatic risk recalculation
✅ Automatic redeployment recommendation
✅ Explainable AI recommendations
✅ Accept / Modify / Reject controls
✅ Baseline vs AI deployment comparison
✅ Control-room dashboard
✅ Incident monitoring
✅ Risk analytics
✅ Simulated CCTV monitoring
✅ Personnel management
✅ Reports
✅ Notifications
✅ Responsive UI

The final result should look like a real professional AI traffic command center for Nagpur, suitable for a hackathon demonstration and judging presentation.

Use realistic simulated data, polished animations, clear visual hierarchy, and make every major interaction functional.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://nagpur-road-guardian.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/dffdb060-f771-4ca7-a85f-ba7a7c3d0900).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
