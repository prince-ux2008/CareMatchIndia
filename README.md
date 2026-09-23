# CAREMATCH INDIA — FINAL MASTER IMPLEMENTATION PROMPT

## AI-POWERED HEALTHCARE DISCOVERY, HOSPITAL MATCHING & COMPARISON PLATFORM

You are a senior full-stack engineer, AI engineer, database architect, UI/UX designer, product architect and hackathon engineer.

I already have an existing healthcare/hospital discovery project.

Your task is to **inspect, upgrade, complete, stabilize and polish the existing project** into a production-style, hackathon-ready platform called:

# CAREMATCH INDIA

### “Find hospitals that match your healthcare needs.”

The final product must feel like a **premium AI healthcare intelligence platform**, not a basic college project or static hospital listing website.

---

# 1. MOST IMPORTANT RULE — EXISTING PROJECT FIRST

Before changing anything:

1. Inspect the complete existing project.
2. Inspect `package.json`.
3. Inspect the current folder structure.
4. Inspect existing pages/routes.
5. Inspect existing components.
6. Inspect existing API routes.
7. Inspect Supabase/database integration.
8. Inspect authentication.
9. Inspect AI implementation.
10. Inspect search implementation.
11. Inspect matching logic.
12. Inspect Google Maps integration.
13. Inspect existing types and utilities.
14. Identify reusable code.
15. Identify broken/incomplete functionality.

### DO NOT:

* unnecessarily rebuild the project
* delete working functionality
* delete existing data
* rewrite working backend logic
* rename working API routes unnecessarily
* create duplicate components
* create duplicate API routes
* create duplicate utilities
* create unnecessary folders
* create unnecessary files
* install duplicate libraries
* replace working architecture without a real reason

If the existing implementation is good, **reuse it**.

If something is broken, fix it.

If something is missing, implement it.

If something must be refactored, keep the refactor minimal.

---

# 2. BEFORE CODING

First create a concise internal implementation plan containing:

* Current architecture
* Existing folder structure
* Database architecture
* Authentication architecture
* AI architecture
* Search architecture
* Matching architecture
* Google Maps architecture
* Admin architecture
* Required changes
* Files to reuse
* Files that genuinely need modification
* Files that genuinely need creation
* Dependencies that are actually required

Then begin implementation.

Do not blindly generate hundreds of files.

---

# 3. CORE PRODUCT PURPOSE

CareMatch India helps citizens discover and compare hospitals based on their healthcare requirements.

Users should be able to:

* Register/Login
* Create a profile
* Set location
* Search using natural language
* Search by disease/condition
* Search by treatment/specialty
* Find nearby hospitals
* Filter by distance
* Filter by budget/cost
* Filter by facilities
* View hospital information
* View overall hospital rating where reliable data exists
* View condition/specialty suitability
* View AI requirement match
* Understand why a hospital matched
* Understand what does not match
* Compare 2–4 hospitals
* View hospitals on Google Maps
* Get directions
* Save hospitals
* View search history
* Use what-if searches
* Use multilingual UI

The platform is a **healthcare discovery and comparison system**.

It is NOT a diagnosis system.

---

# 4. PRIMARY USER FLOW

The complete user journey should be:

Landing / Welcome

↓

Register / Login

↓

Profile Setup

↓

Member ID

↓

Dashboard

↓

AI Natural-Language Search

↓

AI Requirement Extraction

↓

Clarification if Required

↓

Structured Requirement Summary

↓

Confirm Search

↓

Hybrid Hospital Search

↓

Disease / Treatment Filtering

↓

Location / Radius Filtering

↓

Budget / Cost Filtering

↓

Facilities / Services Filtering

↓

Matching Engine

↓

Data Verification / Provenance

↓

Hospital Results

↓

Why This Match

↓

What Doesn't Match

↓

Hospital Details

↓

Google Maps

↓

Get Directions

↓

Compare

↓

Save

↓

What-if Search

---

# 5. ADMIN FLOW

Create a separate secure admin system.

Flow:

Admin Login

↓

Admin Dashboard

↓

Hospital Records

↓

Add / Upload / Edit

↓

Review

↓

Verify Source

↓

Approve / Reject

↓

Publish

↓

Citizen Search

Normal users must never receive admin permissions.

Use role-based access control.

---

# 6. CORE MVP — MUST WORK

Prioritize these before advanced visual effects:

### P0 — REQUIRED

1. Login/Register
2. User Profile
3. Dashboard
4. AI natural-language search
5. AI → structured requirements
6. Hospital database
7. Disease/treatment filtering
8. Location/radius search
9. Cost/budget filtering
10. Hospital results
11. Hospital comparison
12. At least 2 verifiable comparison metrics where data exists
13. Admin dashboard
14. Hospital record management
15. Data provenance
16. Google Maps
17. Google Maps directions
18. Responsible AI
19. No fabricated healthcare information

### P1

* Semantic search
* Hybrid search
* Why This Match
* What Doesn't Match
* Save Hospital
* Search History

### P2

* What-if search
* Multilingual UI
* Advanced analytics
* Advanced statistics
* Enhanced admin tools

Do not spend most development time on animation before P0 functionality works.

---

# 7. AUTHENTICATION

Use:

* Supabase Auth
* PostgreSQL
* Row Level Security

Registration fields:

Required:

* Full Name
* Email
* Phone Number
* Password
* Confirm Password
* State
* District
* City
* Preferred Language

Optional:

* Pincode

Do NOT collect unnecessary sensitive information.

Do NOT collect:

* Aadhaar
* Bank details
* unnecessary medical records
* unnecessary medical history

---

# 8. MEMBER ID

Generate an application-specific identifier.

Example:

`CM-PB-104582`

This is only an application account identifier.

It is NOT:

* Aadhaar
* Government ID
* Medical record number

---

# 9. USER PROFILE

Show:

* Name
* Email
* Phone
* State
* District
* City
* Preferred Language
* Member ID

Actions:

* Edit Profile
* Change Language
* Logout

---

# 10. DASHBOARD

Create:

# AI HEALTHCARE COMMAND CENTER

Greeting:

“Good Morning, [Name]”

Main heading:

“How can we help you find the right healthcare option?”

Main AI search:

> “Describe what healthcare you need…”

Examples:

> “Find kidney treatment hospitals near Chandigarh under ₹2 lakh.”

> “Find a cardiology hospital within 5 km with emergency facilities.”

Quick actions:

* Find a Hospital
* Nearby Hospitals
* Search Treatment
* Compare Hospitals
* Saved Hospitals
* Recent Searches
* Emergency Care

Keep the dashboard clean and not overcrowded.

---

# 11. DASHBOARD METRICS

Show animated metrics only from actual backend data.

Examples:

* Hospitals Indexed
* Nearby Hospitals
* Emergency Facilities
* Available Specialists

If data is unavailable:

**Data unavailable**

Never invent numbers.

---

# 12. AI NATURAL-LANGUAGE SEARCH

This is one of the core features.

Example:

> “Find a budget-friendly cardiology hospital within 5 km with emergency facilities.”

The system should extract:

* Specialty → Cardiology
* Radius → 5 km
* Budget → Affordable
* Emergency → Required
* Location → User location if available

Another example:

> “Find a hospital for diabetes treatment near me.”

Extract:

* Condition → Diabetes
* Relevant specialty → Endocrinology/Diabetology where supported by data
* Location → User location

The AI must NOT diagnose the user.

---

# 13. AI REQUIREMENT EXTRACTION

Use:

* OpenAI API / LLM
* Structured Outputs
* Zod validation

The structured requirement can contain:

```text
condition
treatment
specialty
location
state
district
city
pincode
radius
budget_min
budget_max
priority
coverage
facilities
emergency
```

The LLM must NOT directly construct unrestricted database queries.

AI output must be validated before entering search/matching logic.

---

# 14. CLARIFICATION ENGINE

If required information is missing, ask the user.

Example:

> “What search radius would you prefer?”

Options:

* 10 km
* 30 km
* 50 km
* 100 km

Then:

> “What matters most to you?”

Options:

* Treatment
* Cost
* Distance
* Facilities
* Coverage
* Verified Information

Never invent missing requirements.

---

# 15. REQUIREMENT SUMMARY

Before executing a complex search, show:

## YOUR SEARCH REQUIREMENT

Condition:
Kidney-related

Treatment:
Kidney Treatment

Location:
Chandigarh

Radius:
30 km

Budget:
₹2 lakh

Priority:
Treatment + Cost

Button:

**Confirm Search**

Allow the user to edit the requirement.

---

# 16. HYBRID SEARCH

Implement three search layers:

### 1. Keyword Search

PostgreSQL Full-Text Search

### 2. Semantic Search

Embeddings + pgvector

### 3. Structured Filtering

Filter by:

* Disease
* Treatment
* Specialty
* Location
* Radius
* Budget
* Facilities
* Emergency
* Coverage
* Accreditation
* Availability

Combine these into a **Hybrid Search** system.

---

# 17. DISEASE / TREATMENT NORMALIZATION

Support normalized treatment/procedure records.

Example:

User phrase:

> “Gurdi ki pathri ka operation”

Possible normalized concept:

> Kidney Stone Surgery

Store aliases/synonyms only where medically appropriate and supported.

If the mapping is uncertain:

Ask for clarification.

Do not invent medical equivalences.

---

# 18. DATABASE

Use the existing Supabase PostgreSQL architecture.

Prefer normalized tables such as:

```text
users
profiles
roles
states
districts
cities
hospitals
hospital_locations
departments
diseases
treatments
procedures
hospital_treatments
facilities
hospital_facilities
cost_estimates
coverage
accreditations
statistics
outcomes
data_sources
verification_records
search_sessions
chat_sessions
saved_hospitals
comparisons
preferences
```

Do not create duplicate tables if equivalent tables already exist.

Modify existing schema minimally when possible.

---

# 19. HOSPITAL DATA

Hospital fields may include:

```text
hospital_id
name
country
state
state_code
district
city
pincode
address
latitude
longitude
website
phone
data_status
```

Treatment availability:

```text
hospital_id
treatment_id
availability_status
source_id
verification_status
verified_at
```

Only show information supported by backend/API/database data.

---

# 20. COST INFORMATION

Support:

* Minimum Cost
* Maximum Cost
* Currency
* Cost Type
* Procedure
* Source
* Verification Status
* Last Verified

If the source only provides a range, show a range.

Use labels such as:

* Verified Cost Range
* Estimated
* Not Available
* Demo Data

Never invent exact prices.

---

# 21. FACILITIES

Support relevant facilities such as:

* ICU
* Emergency
* Specialized Units
* Diagnostic Facilities
* Operation Theatre
* Imaging
* Blood Bank
* Pharmacy
* Other verified services

Only display facilities supported by data.

---

# 22. ACCREDITATION

Support:

```text
accreditation_name
issuing_body
valid_from
valid_until
source
verification_status
```

Never invent accreditation.

If unavailable:

**Not Available**

---

# 23. STATISTICS / OUTCOMES

Where reliable data exists, support:

* Procedure volume
* Patient volume
* Outcome metrics
* Other public hospital statistics

Every metric should show:

* Metric Name
* Value
* Time Period
* Sample Size where available
* Source
* Verification Status
* Last Updated

Never fabricate:

* success rates
* mortality rates
* patient volume
* outcome statistics
* procedure counts

If unavailable:

**Not Available**

---

# 24. DATA PROVENANCE

Important data should support:

* Source
* Source Type
* Publisher
* Source URL
* Retrieved At
* Last Verified
* Last Updated
* Verification Status

Possible statuses:

```text
VERIFIED
OFFICIAL/PUBLIC SOURCE
ESTIMATED
NOT AVAILABLE
POSSIBLY OUTDATED
DEMO DATA
SYNTHETIC DATA
```

Data provenance must be visible where appropriate.

---

# 25. DEMO / SYNTHETIC DATA

If real data is unavailable:

Clearly label:

**DEMO DATA**

or

**SYNTHETIC DATA**

Never present synthetic data as verified real-world information.

The admin dashboard should demonstrate how verified/public data can later be imported and reviewed.

---

# 26. MATCHING ENGINE

Create/reuse a separate matching service.

Inputs:

```text
User Requirements
+
Hospital Data
```

Consider:

* Disease/condition relevance
* Treatment relevance
* Specialty relevance
* Department availability
* Specialist/service availability
* Semantic similarity
* Distance
* Budget compatibility
* Facilities
* Emergency
* Coverage
* Accreditation where relevant
* User priority
* Data availability
* Verification status
* Data freshness
* Hospital rating where reliable

Output:

* Strong Match
* Good Match
* Partial Match

Do NOT call any hospital:

**“Best Hospital”**

Do not create an unexplained medical quality score.

---

# 27. THREE DIFFERENT METRICS — MUST REMAIN SEPARATE

### Overall Hospital Rating

General rating from actual available data.

Example:

⭐ 4.5 / 5

### AI Requirement Match

How well the hospital matches the user's requested criteria.

Example:

94%

### Condition/Specialty Suitability

How strongly the hospital's available departments/services/facilities match the searched condition or specialty.

Example:

92%

These must NEVER be merged.

Condition suitability is NOT:

* probability of cure
* treatment success probability
* survival probability
* medical outcome prediction

---

# 28. CONDITION MATCH BREAKDOWN

Where actual matching data supports it, show:

```text
Department Match
Specialist Match
Facility Match
Location Match
Emergency Support
```

Example:

```text
Department Match     98%
Specialist Match     92%
Facility Match       90%
Location Match       88%
Emergency Support    84%
```

These values MUST come from actual matching logic.

Never generate random percentages.

Document the calculation logic.

---

# 29. WHY THIS HOSPITAL?

Every suitable result should explain the match.

Example:

## WHY THIS HOSPITAL?

94% AI Requirement Match

✓ Requested specialty available

✓ Condition-related department available

✓ Within requested distance

✓ Required facility available

✓ Emergency service available

✓ Budget requirement matched

Every reason must be derived from actual backend data.

---

# 30. WHAT DOESN'T MATCH?

Show missing or mismatched requirements.

Example:

## WHAT DOESN'T MATCH?

⚠ Cost is estimated

⚠ Required facility information unavailable

⚠ Distance is higher than preferred

Only show genuine mismatches.

---

# 31. HOSPITAL RESULT CARD

Premium hospital card should contain where data exists:

* Hospital Name
* Overall Rating
* AI Requirement Match
* Condition/Specialty Suitability
* Distance
* Relevant Treatment
* Departments
* Facilities
* Emergency
* Cost Range
* Accreditation
* Available Metrics
* Data Status
* Last Verified

Actions:

* View Details
* Directions
* Compare
* Save
* View on Map

Never display unavailable data as if it exists.

---

# 32. MAP + RESULTS

Use a split-screen layout:

LEFT:

Google Maps

RIGHT:

Hospital results

Selecting a hospital card should highlight its marker when supported.

Selecting a marker should highlight the corresponding hospital card when supported.

Never fabricate coordinates.

---

# 33. GOOGLE MAPS

Use Google Maps Platform:

* Google Maps JavaScript API
* Google Places API
* Google Geocoding API
* Google Directions API / appropriate Google Maps Directions URL

Use environment variables.

Never expose unrestricted/private API secrets client-side.

---

# 34. USER LOCATION

Support:

**Use My Current Location**

using browser geolocation.

Also support manual:

* State
* District
* City
* Pincode

Do not continuously track users.

If location permission is denied:

allow manual location.

Do not request location permission until location-based functionality is needed.

---

# 35. GET DIRECTIONS

When user clicks:

**Get Directions**

Open Google Maps with:

Origin:

User location or selected origin

Destination:

Selected hospital

Do not build fake turn-by-turn navigation.

Let Google Maps handle actual route/navigation information.

---

# 36. HOSPITAL DETAILS

Create a premium hospital details page.

Show:

* Name
* Overall Rating
* Location
* Distance
* Emergency
* Departments
* Facilities
* Opening Status
* Contact
* Directions
* AI Requirement Match
* Condition/Specialty Suitability

Tabs:

* Overview
* Facilities
* Departments
* AI Match
* Location
* Reviews/Rating

Never create fake reviews.

---

# 37. COMPARISON

Allow comparison of 2–4 hospitals.

Compare factual information:

* Overall Rating
* Condition/Specialty Suitability
* AI Requirement Match
* Distance
* Treatment
* Departments
* Emergency
* Facilities
* Cost
* Coverage
* Accreditation
* Patient volume if verified
* Outcome metrics if verified
* Data Status
* Last Verified

Use:

✓ Available

⚠ Estimated

— Not Available

Heading:

**Compare based on your requirements**

Do not declare a universal winner.

The final healthcare decision remains with the citizen.

---

# 38. ADMIN DASHBOARD

Create:

`/admin`

Sections where applicable:

* Overview
* Hospitals
* Treatments
* Facilities
* Costs
* Statistics
* Sources
* Verification
* Users
* Data Imports

Dashboard metrics:

* Total Hospitals
* Verified Records
* Pending Reviews
* Outdated Records
* Demo/Synthetic Records

Only show real database values.

---

# 39. ADMIN HOSPITAL MANAGEMENT

Admin can, where implemented:

* Add hospital
* Edit hospital
* Delete hospital
* Add treatments
* Add facilities
* Add costs
* Add statistics
* Add accreditation
* Add source
* Set verification status
* Set last verified date
* Review records
* Approve/reject
* Mark demo/synthetic
* Mark outdated

Normal users must not access these operations.

---

# 40. CSV IMPORT

Support CSV upload if feasible.

Validate every row before insertion.

Show:

* Rows Imported
* Rows Rejected
* Validation Errors

Uploaded data must NOT automatically become verified.

Admin must review/verify it.

---

# 41. SEARCH HISTORY

Store only necessary information:

* Search query
* Structured requirement
* Timestamp
* Result IDs

Allow:

* Reopen Search
* Delete Search History

Do not unnecessarily store sensitive medical information.

---

# 42. SAVE HOSPITAL

Users can:

* Save
* Unsave
* Compare
* Open Directions

Dashboard can show:

* Saved Hospitals
* Recent Searches
* Saved Comparisons

---

# 43. WHAT-IF SEARCH

Allow users to modify:

* Budget
* Radius
* Priority
* Coverage
* Treatment requirement

Example:

> “Increase budget to ₹3 lakh.”

Then:

Changed Requirement

↓

Matching Engine

↓

Updated Results

Do not rebuild the entire search unnecessarily.

---

# 44. MULTILINGUAL

Support:

* English
* Hindi
* Punjabi

Translate the entire UI where implemented:

* Navigation
* Buttons
* Dashboard
* Forms
* Search
* AI interface
* Hospital results
* Comparison
* Admin UI where appropriate

Do not translate only the landing page.

---

# 45. EMERGENCY SAFETY

CareMatch India is NOT a diagnostic system.

If a user describes potentially severe symptoms:

Show a safety-oriented message such as:

**Possible Emergency**

Recommend seeking immediate emergency medical care/local emergency services.

Do not diagnose.

Do not claim certainty.

Do not make treatment decisions.

---

# 46. RESPONSIBLE AI

Implement:

* Structured AI outputs
* Zod validation
* Grounded hospital data
* Source attribution
* Data status
* Uncertainty labels
* Human/admin verification
* No fabricated hospital facts
* No fabricated statistics
* No fabricated ratings
* No diagnosis
* No universal “best hospital”
* No unsupported medical outcome predictions
* Clear demo/synthetic data labels

The LLM must never invent hospital facts.

---

# 47. PREMIUM UI / UX IDENTITY

Brand:

# NEURALCARE

Tagline:

**“Intelligent Healthcare. Simplified.”**

Theme:

**Futuristic Healthcare AI**

Visual style:

* Premium
* Clean
* Intelligent
* Futuristic
* Professional
* Medical technology
* AI command center
* Premium SaaS

NOT:

* Gaming
* Cyberpunk
* Childish
* Excessively neon

---

# 48. DESIGN COLORS

Primary background:

`#050A14`

Secondary:

`#0B1220`

Surface:

`#0F192A`

Cards:

`rgba(15,25,42,0.65)`

Accent:

`#22D3EE`

Electric Blue:

`#3B82F6`

AI Violet:

`#8B5CF6`

Success:

`#22C55E`

Warning:

`#F59E0B`

Danger:

`#EF4444`

Use colors selectively.

---

# 49. DESIGN LANGUAGE

Use:

* subtle glassmorphism
* soft borders
* controlled blur
* radial gradients
* subtle grid
* depth
* clean spacing
* premium typography
* restrained glow

Avoid:

* excessive glow
* excessive rounded cards
* random gradients
* too many colors
* excessive 3D
* unnecessary decorative elements
* clutter

Futuristic ≠ excessive neon.

---

# 50. TYPOGRAPHY

Use:

Inter / Geist / equivalent modern sans-serif.

Important information must be easy to scan:

* Hospital Name
* Rating
* AI Match
* Condition Suitability
* Distance
* Emergency
* Cost

---

# 51. GLOBAL BACKGROUND

Create a subtle healthcare AI background using:

* Dark navy
* Subtle grid
* Radial blue/cyan glow
* Very subtle particles
* Optional healthcare network nodes
* Slow background movement

The background must never reduce readability.

---

# 52. LOGIN SCREEN

First screen should be impressive.

LEFT:

NEURALCARE

“Intelligent Healthcare Discovery”

RIGHT:

Premium glass authentication card.

Use:

* Name
* Email/Phone
* Location
* appropriate authentication fields

Primary CTA:

**Enter Healthcare AI**

Use subtle:

* background animation
* focus animation
* button animation
* page transition

Do not overcomplicate authentication.

---

# 53. AI PROCESSING UI

Create:

## AI UNDERSTANDING

Pipeline:

Intent Detection

↓

Disease / Specialty Extraction

↓

Location

↓

Filters

↓

Hybrid Search

↓

Hospital Matching

↓

Explainable Results

Show actual supported stages.

Do not fake operations.

---

# 54. ANIMATION SYSTEM

Primary:

**Motion for React**

Use for:

* page transitions
* section entrance
* card hover
* buttons
* dialogs
* sidebar
* AI processing
* loading states
* counters
* match scores
* map interactions

Use:

**GSAP**

ONLY for complex effects where Motion is insufficient.

Do NOT use both libraries for the same animation.

Use:

**Lenis**

for smooth scrolling only where useful.

Respect:

`prefers-reduced-motion`

Avoid:

* bouncing everything
* spinning everything
* long transitions
* excessive animations

---

# 55. FRONTEND TECH STACK

Use existing compatible versions whenever possible.

Core:

* Next.js
* React
* TypeScript
* Tailwind CSS

UI:

* shadcn/ui
* Aceternity UI
* Magic UI

Icons:

* Lucide React

Animation:

* Motion for React
* GSAP only when genuinely necessary
* Lenis

Charts:

* Recharts

Maps:

* Google Maps Platform

Next.js should continue using the project's existing router architecture. Do not migrate App Router ↔ Pages Router unless genuinely required.

---

# 56. AI / SEARCH STACK

AI:

* OpenAI API / LLM
* Embeddings
* pgvector
* Zod

Search:

* PostgreSQL Full-Text Search
* pgvector Semantic Search
* Hybrid Search

Matching:

* Explainable Matching Engine

---

# 57. BACKEND / DATABASE STACK

Backend:

* Next.js Route Handlers
* TypeScript

Database:

* Supabase
* PostgreSQL
* pgvector

Authentication:

* Supabase Auth

Security:

* Supabase RLS
* RBAC
* Environment Variables
* Zod
* Server-side secret protection

---

# 58. API ARCHITECTURE

Reuse existing API routes.

Possible routes:

```text
/api/chat
/api/requirements
/api/search
/api/hospitals
/api/match
/api/compare
/api/maps
/api/verification
/api/locations
/api/saved
/api/history
/api/admin/hospitals
/api/admin/import
/api/admin/verification
```

Only create a route if the functionality genuinely does not already exist.

Protect private/admin endpoints.

---

# 59. SERVICE ARCHITECTURE

Keep business logic outside UI components.

Logical services:

* AI Service
* Embedding Service
* Search Service
* Hospital Service
* Matching Service
* Verification Service
* Maps Service
* Location Service
* Authentication Service
* Admin/Data Import Service

Reuse existing service architecture if present.

---

# 60. MINIMAL FILE ARCHITECTURE

The project must remain easy to maintain.

A possible structure:

```text
app/
components/
features/
services/
lib/
types/
utils/
hooks/
database/
public/
```

But this is NOT mandatory.

If the existing structure is good:

**KEEP IT.**

Do not reorganize the entire project simply for appearance.

### FILE CREATION RULE

Before creating a new file, ask:

> Can this functionality reasonably live in an existing file?

If yes:

Reuse the existing file.

If no:

Create a new file.

Never create:

* duplicate components
* duplicate hooks
* duplicate utilities
* duplicate API routes
* duplicate types
* duplicate CSS
* unnecessary configs

---

# 61. DEPENDENCY RULE

Before installing a package:

1. Check `package.json`.
2. Check existing dependencies.
3. Check whether the functionality already exists.
4. Reuse existing dependency if possible.

Do not install multiple libraries for:

* icons
* animation
* charts
* UI components
* maps
* validation

Only add a dependency when genuinely necessary.

---

# 62. DATA INTEGRITY — ABSOLUTE RULE

NEVER fabricate:

* hospital names
* ratings
* distances
* coordinates
* facilities
* departments
* specialists
* emergency availability
* opening status
* cost
* statistics
* patient volumes
* outcome metrics
* accreditation
* reviews
* AI scores
* disease suitability

If unavailable:

**Data unavailable**

The UI must not turn missing data into fake data.

---

# 63. MEDICAL SAFETY — ABSOLUTE RULE

Do NOT:

* diagnose users
* predict treatment success
* claim cure
* claim medical outcomes
* fabricate medical information
* present suitability as treatment probability

Use:

* Healthcare Requirement Match
* Condition/Specialty Suitability
* Available Services
* Verified Information

Add appropriate disclaimer:

> “Information is provided for healthcare discovery and comparison and does not replace professional medical advice.”

---

# 64. RESPONSIVE DESIGN

Support:

* Desktop
* Laptop
* Tablet
* Mobile

Do not simply shrink desktop.

Mobile should include:

* collapsible sidebar
* touch-friendly controls
* stacked cards
* map/results toggle
* responsive AI search
* readable comparison layout

---

# 65. ACCESSIBILITY

Implement:

* semantic HTML
* keyboard navigation
* visible focus states
* accessible contrast
* ARIA labels where needed
* accessible dialogs
* reduced-motion support
* readable text
* accessible buttons/forms

---

# 66. PERFORMANCE

Keep the application fast.

Use where appropriate:

* dynamic imports
* lazy loading
* optimized images
* code splitting
* efficient rendering
* minimal unnecessary client-side JavaScript
* server-side operations for sensitive/backend tasks

Do not add libraries just for decorative effects.

---

# 67. LOADING STATES

Never leave blank screens.

Create reusable loading states for:

* Dashboard
* Hospital cards
* Search results
* Hospital details
* Charts
* Comparison
* Admin tables
* AI processing
* Maps

Use skeleton loaders where appropriate.

---

# 68. ERROR HANDLING

Handle:

* AI unavailable
* Database unavailable
* Google Maps unavailable
* Location denied
* No results
* Invalid query
* Network errors
* Authentication errors
* Unauthorized admin access
* Invalid CSV
* API failures

Use user-friendly messages.

Example:

> “No matching hospitals were found with the current requirements. Try increasing the radius or changing your criteria.”

Never expose raw stack traces to users.

---

# 69. MAIN DEMO SCENARIO

Create one polished end-to-end hackathon demo.

User enters:

> “Find kidney treatment hospitals near Chandigarh under ₹2 lakh.”

AI extracts:

Condition → Kidney-related

Treatment → Kidney Treatment

Location → Chandigarh

Budget → ₹2 lakh

AI asks:

> “Preferred radius?”

User selects:

30 km

System searches.

Results show relevant hospitals with available:

* Treatment
* Distance
* Cost
* Facilities
* Rating
* Verification
* Why Match
* What Doesn't Match

User clicks:

**Get Directions**

→ Google Maps opens with destination/route.

User selects 2 hospitals.

→ Comparison page opens.

This should be the primary live demonstration flow.

---

# 70. LANDING PAGE

Hero:

# Find Hospitals That Match Your Healthcare Needs

Subtitle:

> “Describe your healthcare requirement in your own words. Discover and compare relevant hospitals using disease, treatment, location, cost and available verified information.”

Buttons:

**Find a Hospital**

**How It Works**

Visual pipeline:

User Requirement

→

AI Understanding

→

Structured Filters

→

Hospital Search

→

Matching

→

Verified Comparison

---

# 71. WHAT THE PRODUCT MUST COMMUNICATE

### UNDERSTAND

AI understands the citizen's healthcare requirement.

### SEARCH

The system searches structured and semantic hospital information.

### MATCH

The system identifies relevant hospitals.

### VERIFY

The system communicates source, verification and uncertainty.

### COMPARE

The citizen compares factual information.

### NAVIGATE

Google Maps helps the citizen navigate.

### DECIDE

The final healthcare decision remains with the citizen.

---

# 72. IMPLEMENTATION PHASES

Implement in this order:

### PHASE 1

Existing project audit

### PHASE 2

Architecture confirmation

### PHASE 3

Design system

### PHASE 4

Authentication

### PHASE 5

Profile + Member ID

### PHASE 6

Dashboard

### PHASE 7

AI Search UI

### PHASE 8

AI Requirement Extraction + Zod

### PHASE 9

Hospital Data/Search

### PHASE 10

Location + Radius

### PHASE 11

Hybrid Search

### PHASE 12

Matching Engine

### PHASE 13

Data Provenance

### PHASE 14

Hospital Results

### PHASE 15

Why Match / What Doesn't Match

### PHASE 16

Hospital Details

### PHASE 17

Google Maps

### PHASE 18

Directions

### PHASE 19

Comparison

### PHASE 20

Admin Dashboard

### PHASE 21

Admin Upload/Review

### PHASE 22

Statistics/Accreditation where verified

### PHASE 23

Save + History

### PHASE 24

What-if Search

### PHASE 25

Multilingual

### PHASE 26

Emergency Safety

### PHASE 27

Accessibility

### PHASE 28

Performance

### PHASE 29

Testing

### PHASE 30

Deployment

Do not attempt all phases blindly in one step.

Work incrementally.

---

# 73. TEST AFTER EACH MAJOR PHASE

After each major implementation:

1. Run the application.
2. Check TypeScript.
3. Check build.
4. Check browser console.
5. Check API errors.
6. Check database calls.
7. Check responsive layout.
8. Fix errors.
9. Only then continue.

Do not leave known errors unresolved.

---

# 74. FINAL TESTING CHECKLIST

## Authentication

* Register
* Login
* Logout
* Password recovery if implemented
* Protected routes

## Profile

* Profile
* Member ID
* Location
* Language

## AI

* Natural language
* Requirement extraction
* Clarification
* Zod validation
* No hallucinated data

## Search

* Disease
* Treatment
* Specialty
* Location
* Radius
* Budget
* Facilities

## Matching

* Requirement match
* Condition suitability
* Explanation
* Mismatch explanation

## Database

* Hospital records
* Sources
* Verification
* Demo data

## Admin

* Add
* Edit
* CSV import
* Review
* Approve
* Reject
* Verify

## Results

* Hospital information
* Rating
* Match
* Suitability
* Distance
* Data status

## Comparison

* 2–4 hospitals
* Cost
* Distance
* Facilities
* Metrics where verified

## Maps

* Current location
* Hospital marker
* Directions
* Route
* Fallback

## Advanced

* Save
* History
* What-if
* Multilingual

## Security

* Authentication
* RLS
* Role permissions
* API key protection
* No secrets in client

## Quality

* No major TypeScript errors
* No major console errors
* Responsive
* Accessible
* Fast enough
* Vercel-compatible

---

# 75. ENVIRONMENT VARIABLES

Create/update `.env.example` only.

Possible variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
GOOGLE_MAPS_API_KEY
```

Only include variables actually required.

Never commit:

```text
.env
.env.local
.env.*.local
```

---

# 76. GIT-FRIENDLY PROJECT

Maintain a proper `.gitignore`.

Do NOT commit:

```text
node_modules/
.next/
.env
.env.local
.env.*.local
```

Also avoid committing:

* API keys
* secrets
* temporary files
* debug files
* unnecessary generated files
* screenshots
* huge local datasets unless genuinely required

Keep the project easy to push to GitHub and deploy to Vercel.

---

# 77. FINAL TECH STACK

## Frontend

Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
Aceternity UI
Magic UI
Lucide React
Motion for React
GSAP — selective only
Lenis
Recharts

## AI

OpenAI API / LLM
Structured Outputs
Embeddings
pgvector
Zod

## Search

PostgreSQL Full-Text Search
pgvector Semantic Search
Hybrid Search
Explainable Matching Engine

## Backend

Next.js Route Handlers
TypeScript

## Database

Supabase
PostgreSQL
pgvector
Supabase Auth
Row Level Security

## Maps

Google Maps JavaScript API
Google Places API
Google Geocoding API
Google Directions API

## Deployment

Vercel

## Version Control

GitHub

---

# 78. FINAL ARCHITECTURE

The core architecture should be:

```text
Citizen
   ↓
AI / NLP
   ↓
Structured Requirements
   ↓
Validation
   ↓
Hybrid Search
   ↓
Hospital Database
   ↓
Matching Engine
   ↓
Verification / Data Provenance
   ↓
Explainable Results
   ↓
Hospital Details
   ↓
Comparison
   ↓
Google Maps
   ↓
Navigation
```

---

# 79. FINAL ONE-LINE PRODUCT FLOW

**Register → Login → Profile → Dashboard → AI Search → Requirement Extraction → Confirm Requirement → Hybrid Search → Matching → Explainable Hospital Results → Hospital Details → Google Maps → Compare → Save**

Admin:

**Admin Login → Hospital Records → Upload/Edit → Source → Review → Verify → Approve → Publish**

---

# 80. FINAL INSTRUCTION TO THE CODING AGENT

Build a **real connected application**, not a collection of static screens.

The final project must demonstrate:

**AI Natural-Language Healthcare Search**

*

**Structured Hospital Discovery**

*

**Hybrid Search**

*

**Explainable Matching**

*

**Condition/Specialty Suitability**

*

**Verified/Traceable Data**

*

**Transparent Comparison**

*

**Google Maps Navigation**

*

**Admin Data Management**

*

**Responsible AI**

The most important priorities are:

1. Functionality
2. Data integrity
3. Search quality
4. Explainability
5. Security
6. Stability
7. UX
8. Performance
9. Visual polish

Do NOT sacrifice functionality for animations.

Do NOT fabricate healthcare data.

Do NOT fabricate AI scores.

Do NOT fabricate hospital ratings.

Do NOT fabricate distances.

Do NOT fabricate medical outcomes.

Do NOT call a hospital universally “best”.

Do NOT expose API keys.

Do NOT allow the LLM to invent hospital facts.

Do NOT create unnecessary files.

Do NOT install unnecessary dependencies.

Do NOT rewrite working backend logic without a reason.

FIRST inspect the existing project.

THEN create a concise implementation plan.

THEN reuse existing code.

THEN implement missing functionality.

THEN test each major phase.

THEN fix errors.

THEN polish the UI.

FINALLY provide a concise implementation report containing:

### Modified Files

List only genuinely modified files.

### Created Files

List only genuinely created files.

### Dependencies Added

List each dependency and why it was required.

### Backend/API Changes

Explain only actual changes.

### Database Changes

Explain only actual schema/data changes.

### Remaining Issues

Clearly list anything that could not be completed.

The final product must be **functional, stable, responsive, Git-friendly, Vercel-compatible, easy to edit, and suitable for a live hackathon demonstration.**
# CareMatch India 🇮🇳
### AI-Powered Hospital Discovery, Matching & Comparison Platform

> **Tagline**: *“Find hospitals that match your healthcare needs.”*  
> **Positioning**: *“Punjab-first prototype with an India-scalable architecture.”*

---

## 🚀 Overview

**CareMatch India** is a national-grade, AI-driven hospital discovery and transparent matching platform. Rather than acting as a generic directory that spits out static lists, CareMatch India understands natural language citizen requirements, structures them using Zod validation, retrieves relevant candidates through hybrid semantic filtering, applies a multi-factor compatibility engine, and transparently explains **"Why This Match?"** and **"What Doesn't Match?"** with strict data trust verification.

---

## 🏛️ Core Product Architecture

```
               CITIZEN / USER
                      │
         Natural Language Query (EN / HI / PA)
                      │
                      ▼
        ┌───────────────────────────┐
        │   AI / NLP Understanding  │
        │   (OpenAI / Local Parser) │
        └─────────────┬─────────────┘
                      │
              Requirement Extraction
                      │
                      ▼
        ┌───────────────────────────┐
        │   Zod Schema Validation   │
        │   & Missing Info Detector │
        └─────────────┬─────────────┘
                      │ (Clarification Question Loop)
                      ▼
        ┌───────────────────────────┐
        │    Structured Requirement │
        └─────────────┬─────────────┘
                      │
       ┌──────────────┴──────────────┐
       ▼                             ▼
┌───────────────────┐         ┌───────────────────┐
│  Semantic Vector  │         │ Structured Filter │
│ Embeddings Search │         │ (State/Dist/City, │
│ (pgvector / Cos)  │         │ Budget, Radius)   │
└─────────┬─────────┘         └─────────┬─────────┘
          │                             │
          └──────────────┬──────────────┘
                         │
                         ▼
        ┌───────────────────────────┐
        │  Hospital Candidate Set   │
        │     (Retrieved from DB)   │
        └─────────────┬─────────────┘
                      │
                      ▼
        ┌───────────────────────────┐
        │    Intelligent Matching   │
        │    - RuleBasedMatcher     │
        │    - SemanticMatcher      │
        │    - FutureMLRanker       │
        │    - Priority Weighting   │
        └─────────────┬─────────────┘
                      │
                      ▼
        ┌───────────────────────────┐
        │    Verification & Trust   │
        │    - Verification Status  │
        │    - Data Freshness/Logs  │
        └─────────────┬─────────────┘
                      │
                      ▼
        ┌───────────────────────────┐
        │   Explainability Engine   │
        │   - "Why This Match?"     │
        │   - "What Doesn't Match?" │
        └─────────────┬─────────────┘
                      │
                      ▼
       Top ~5 Relevant Match Results
     ┌──────────────┼──────────────┐
     ▼              ▼              ▼
Compare (2-4)   Geo Map       What-If Search
     │              │              │
     └──────────────┼──────────────┘
                    │
                    ▼
     Save / Shortlist / Dashboard
                    │
                    ▼
              Citizen Decision
```

---

## 🎯 Key Differentiators & Principles

1. **Strict AI Layer Separation (Zero Medical Hallucination)**:
   - LLM / NLP is used strictly for natural language requirement parsing and clarification.
   - All factual medical data, tariffs, facilities, and accreditations come directly from verified database rows.
2. **Transparent Compatibility (No "Best Hospital" Fake Claims)**:
   - Uses `Strong Match` ($\ge 80\%$), `Good Match` ($60-79\%$), and `Partial Match` ($<60\%$).
   - The user remains the ultimate decision-maker.
3. **India-Scalable Location Model**:
   - Normalized `Country → State → District → City → Pincode → Hospital` schema.
   - Deep seed coverage in **Punjab** (Jalandhar, Ludhiana, Amritsar, Mohali, Patiala, Bathinda) with scalable hooks for Haryana, Delhi, HP, Rajasthan, Maharashtra, UP, and all Indian states.
4. **Interactive "What-If?" Scenario Sandbox**:
   - Real-time client & server simulation sandbox where citizens can adjust budget sliders, radius buttons, and priority weights to observe instant Before vs After score deltas.
5. **Emergency Triage Guardrail**:
   - Automatically detects life-threatening symptoms (stroke, crushing chest pain, unconsciousness, heavy bleeding) and halts routine discovery to present direct 108 / 112 emergency routing.
6. **Full Multilingual Support**:
   - English, हिन्दी (Hindi), and ਪੰਜਾਬੀ (Punjabi) supported across all UI labels, search results, and filters.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS, CSS Variables, Glassmorphism, Dark Navy `#070C18` / Electric Cyan `#00F0FF`
- **Icons & Motion**: Lucide React, Framer Motion
- **Validation**: Zod
- **Database & Auth Integration**: Supabase PostgreSQL / Supabase Auth (with instant offline in-memory fallback)

---

## 🏁 Quickstart

```bash
# Clone the repository
git clone https://github.com/your-username/carematch-india.git
cd carematch-india

# Install dependencies
npm install

# Run locally in development mode
npm run dev

# Build for production
npm run build
npm run start
```

Visit `http://localhost:3000` to interact with CareMatch India.

---

## 🩺 Primary Test Scenario

1. Type query:
   > *"My father has a heart problem. We are in Jalandhar and need a hospital for angioplasty. Our budget is around 2 lakh."*
2. System extracts:
   - **Patient**: Father
   - **Condition**: Heart-related
   - **Treatment**: Coronary Angioplasty (PTCA with Stent)
   - **Location**: Jalandhar, Punjab
   - **Budget**: ₹2,00,000
3. AI asks clarification for preferred radius & priority weights.
4. Retrieves verified hospitals (Tagore Hospital, Patel Hospital, SGL Hospital, Civil Hospital) with exact Cath Lab readiness, DES package costs, PM-JAY status, and "Why This Match?" bullet points.
5. Citizen can launch **What-If Simulation**, **Side-by-Side Comparator**, and **Vector Geo Map**.
