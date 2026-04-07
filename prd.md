# Product Requirements Document (PRD)
## Project Title: Freelance Service Marketplace

**Version:** 2.0  
**Prepared For:** Full Stack Development Project  
**Prepared By:** [Your Name / Team Name]  
**Date:** April 2026  

---

# 1. Introduction

## 1.1 Overview
The **Freelance Service Marketplace** is a role-based full stack web application designed to connect **clients** and **freelancers** on a single platform.

The platform allows:
- **Clients** to post projects and hire freelancers.
- **Freelancers** to explore available projects, send service requests/proposals, and manage their work activity.
- Both users to monitor interactions, feedback, and profiles through dedicated dashboards.

This version of the PRD is specifically aligned with the **navigation structure and user flow** you defined for both **Freelancer** and **Client**.

---

# 2. Problem Statement

Freelancers often struggle to find clients and showcase their work in a structured way. Similarly, clients face difficulty in identifying trustworthy professionals and managing project requests effectively.

There is a need for a platform where:
- clients can post projects and manage freelancer interactions,
- freelancers can browse projects and send requests,
- both users can track all activity and feedback in one place.

---

# 3. Product Vision

To build a **simple, organized, and role-based freelance marketplace** where freelancers and clients can easily interact through project requests, activity tracking, reviews, and profile management.

---

# 4. Product Goals

## Primary Goals
- Enable freelancers to discover client-posted projects.
- Allow clients to create and manage project listings.
- Provide separate dashboards for freelancers and clients.
- Track requests and interactions through a dedicated activity system.
- Build trust through reviews and profile visibility.

## Secondary Goals
- Ensure a clean and simple navigation flow.
- Make the system easy for students and beginners to use.
- Build a scalable architecture for future additions such as chat and payments.

---

# 5. User Roles

The system will support the following user roles:

## 5.1 Freelancer
A user who explores projects, sends requests to clients, tracks activity, views reviews, and manages profile.

## 5.2 Client
A user who posts projects, views available freelancers, receives requests, tracks activity, and manages profile.

## 5.3 Admin (Optional Future Scope)
A superuser who can manage users, projects, and moderation.

---

# 6. Navigation Requirements (Top Navbar)

The application must provide **role-based top navigation bars**.

---

# 7. Freelancer Navigation Structure

When a user logs in as a **Freelancer**, the top navbar must contain the following menu items:

1. **Dashboard**
2. **View Projects**
3. **My Activity**
4. **My Reviews & Feedbacks**
5. **Profile**
6. **Logout**

---

## 7.1 Freelancer Navbar Details

### 1. Dashboard
This page serves as the freelancer’s home page after login.

### Dashboard should display:
- Welcome message
- Number of available projects
- Number of requests sent
- Number of accepted/rejected requests
- Recent activity summary
- Recent reviews summary

### Acceptance Criteria
- Freelancer should land on dashboard after login.
- Dashboard should show personalized data.

---

### 2. View Projects
This page allows freelancers to view all projects posted by clients.

### Features:
- View all active client-posted projects
- Search and filter projects
- View project details
- Send request/proposal to client

### Project Card Should Include:
- Project title
- Client name/company (optional)
- Budget
- Deadline
- Required skills
- Project description
- Status (Open/Closed)

### Actions:
- **View Details**
- **Send Request**

### Acceptance Criteria
- Only client-posted projects should be visible.
- Freelancer should be able to send request for a project.
- Closed projects should not accept requests.

---

### 3. My Activity
This page is a very important module for freelancers.

It should show:
- **Requests sent by freelancer to clients**
- **Requests/Responses received from clients**
- Status of each request

### My Activity Sections
#### A. Sent Requests
Shows all requests/proposals submitted by freelancer.

Each record should include:
- Project title
- Client name
- Request date
- Proposed budget
- Status:
  - Pending
  - Accepted
  - Rejected

#### B. Client Responses / Received Activity
Shows the actions taken by clients on the freelancer’s requests.

Examples:
- Client accepted request
- Client rejected request
- Client shortlisted freelancer
- Client invited freelancer for project

### Acceptance Criteria
- Freelancer should be able to track all requests from one page.
- Activity should be shown in reverse chronological order.
- Status should update correctly.

---

### 4. My Reviews & Feedbacks
This page allows freelancers to see feedback from clients.

### Features:
- View all received reviews
- View average rating
- View client feedback comments
- Sort by latest/highest rating

### Review Data Should Include:
- Client name
- Project name
- Rating (1–5 stars)
- Feedback text
- Date

### Acceptance Criteria
- Only completed projects can generate reviews.
- Reviews should be visible in freelancer dashboard and dedicated page.

---

### 5. Profile
This page allows freelancers to manage personal and professional details.

### Freelancer Profile Should Include:
- Profile photo
- Full name
- Professional title
- Skills
- Experience
- Bio
- Education
- Portfolio links/files
- Availability
- Contact details

### Features:
- Edit profile
- Upload portfolio
- Update skills
- Save changes

### Acceptance Criteria
- Freelancer can edit and update profile details.
- Client can view freelancer profile publicly.

---

### 6. Logout
This option logs the freelancer out of the platform securely.

### Acceptance Criteria
- Session/token should be cleared.
- User should be redirected to login/home page.

---

# 8. Client Navigation Structure

When a user logs in as a **Client**, the top navbar must contain the following menu items:

1. **Dashboard**
2. **Create New Project**
3. **View Freelancers**
4. **My Activity**
5. **Profile**
6. **Logout**

---

## 8.1 Client Navbar Details

### 1. Dashboard
This page serves as the client’s home page after login.

### Dashboard should display:
- Welcome message
- Number of projects posted
- Number of freelancer requests received
- Number of active projects
- Recent freelancer activity
- Quick action buttons

### Quick Actions:
- Add Project
- View Freelancers
- View Activity

### Acceptance Criteria
- Client should land on dashboard after login.
- Dashboard should show client-specific summary.

---

### 2. Create New Project
This page allows the client to create and manage new project postings.

### Features:
- Add Project button
- Create new project form
- Edit/delete existing projects
- View all projects posted by client

### Project Form Fields:
- Project title
- Project category
- Description
- Budget
- Deadline
- Required skills
- Project type (Fixed / Hourly)
- Optional attachment

### Actions:
- Save Draft
- Publish Project
- Edit Project
- Delete Project

### Acceptance Criteria
- Only clients can create projects.
- New projects should appear in freelancer View Projects page after publishing.

---

### 3. View Freelancers
This page allows clients to browse all available freelancers.

### Features:
- View all freelancer profiles
- Search and filter freelancers
- View freelancer details
- View skills and experience
- View portfolio (optional)
- Send project invitation/request (optional advanced feature)

### Freelancer Card Should Include:
- Freelancer name
- Professional title
- Skills
- Rating
- Experience
- Availability

### Actions:
- **View Profile**
- **Invite / Connect** (optional future enhancement)

### Acceptance Criteria
- Client should be able to browse and filter freelancers.
- Freelancer profiles should show updated information.

---

### 4. My Activity
This page allows the client to monitor all project-related activity.

It should show:
- Requests received from freelancers
- Actions taken by the client
- Status of freelancer interactions

### My Activity Sections
#### A. Freelancer Requests Received
This section shows requests sent by freelancers to client-posted projects.

Each record should include:
- Freelancer name
- Project title
- Request date
- Proposed budget
- Proposal text
- Status:
  - Pending
  - Accepted
  - Rejected

#### B. My Actions
This section shows what actions the client has taken.

Examples:
- Accepted freelancer request
- Rejected freelancer request
- Shortlisted freelancer
- Closed project

### Actions Available to Client
- Accept request
- Reject request
- Shortlist freelancer
- Mark project as closed

### Acceptance Criteria
- Client should be able to manage all incoming freelancer requests.
- Activity should be easy to track from one page.

---

### 5. Profile
This page allows the client to manage account details.

### Client Profile Should Include:
- Profile photo
- Full name / company name
- Email
- Phone number
- About / business description
- Posted projects summary

### Features:
- Edit profile
- Update contact details
- Save changes

### Acceptance Criteria
- Client can update profile information.
- Freelancer may view limited client profile details.

---

### 6. Logout
This option logs the client out of the platform securely.

### Acceptance Criteria
- Session/token should be cleared.
- User should be redirected to login/home page.

---

# 9. Core Functional Modules

This section defines the main functional modules of the platform based on the navigation system.

---

## 9.1 Authentication Module

### Description
The system must support secure authentication for both freelancer and client roles.

### Features
- Register
- Login
- Logout
- Forgot password
- Role selection during signup

### Fields
- Name
- Email
- Password
- Phone number
- Role (Freelancer / Client)

### Acceptance Criteria
- User should be redirected to correct dashboard after login.
- Role-based navbar should load correctly.

---

## 9.2 Project Management Module

### Description
Clients can create and manage projects, and freelancers can browse them.

### Features
- Project creation
- Project publishing
- Project browsing
- Project details view
- Project status updates

### Acceptance Criteria
- Projects must be visible to freelancers only after publishing.
- Clients should only manage their own projects.

---

## 9.3 Request / Proposal Module

### Description
Freelancers can send requests to client projects.

### Features
- Send request/proposal
- View request history
- Accept/reject requests
- Track request status

### Proposal Fields
- Proposal text
- Budget quote
- Delivery time
- Request date

### Acceptance Criteria
- Freelancer can only send one active request per project.
- Client can accept/reject requests.
- Status should update in both freelancer and client activity pages.

---

## 9.4 Activity Tracking Module

### Description
This module tracks all request-related actions for both roles.

### Freelancer Activity Includes:
- Requests sent
- Client responses
- Accepted/rejected status

### Client Activity Includes:
- Requests received
- Actions taken on requests
- Project closure activity

### Acceptance Criteria
- Both roles should see their activity history clearly.
- Activity should be updated dynamically.

---

## 9.5 Review & Feedback Module

### Description
This module supports feedback collection after project completion.

### Features
- Client gives review to freelancer
- Freelancer views all reviews
- Rating summary shown

### Acceptance Criteria
- Reviews should only be allowed after accepted/completed project flow.
- Reviews should be visible in freelancer review page.

---

## 9.6 Profile Management Module

### Description
Users should be able to maintain their profiles.

### Freelancer Profile Includes:
- title
- bio
- skills
- experience
- portfolio
- availability

### Client Profile Includes:
- name/company name
- business details
- contact info

### Acceptance Criteria
- Both roles should be able to update profile information.
- Profile changes should reflect immediately.

---

# 10. User Stories

## Freelancer User Stories
- As a freelancer, I want to view all posted projects so that I can apply to relevant work.
- As a freelancer, I want to send requests to clients so that I can get hired.
- As a freelancer, I want to track my request history so that I know project status.
- As a freelancer, I want to see my reviews so that I can build trust.
- As a freelancer, I want to update my profile so that clients can evaluate me.

## Client User Stories
- As a client, I want to create a new project so that freelancers can apply.
- As a client, I want to browse freelancers so that I can choose suitable candidates.
- As a client, I want to view freelancer requests so that I can accept or reject them.
- As a client, I want to manage all my activity in one place so that project handling becomes easy.
- As a client, I want to update my profile so that freelancers can know who they are working with.

---

# 11. Functional Requirements Summary

The system must support:

## Freelancer Side
- dashboard
- project browsing
- request submission
- activity tracking
- reviews page
- profile management
- logout

## Client Side
- dashboard
- project creation
- freelancer browsing
- request/activity management
- profile management
- logout

---

# 12. Non-Functional Requirements

## Performance
- Pages should load quickly.
- Requests and activity should update properly.

## Security
- Passwords must be hashed.
- Protected routes must require authentication.
- Role-based route protection must be implemented.

## Usability
- Top navbar should be simple and role-specific.
- UI should be beginner-friendly and responsive.

## Reliability
- Requests and statuses must be stored accurately.
- Activity history should not be lost.

---

# 13. MVP Scope

The first version (MVP) should include:

## Freelancer Side
- dashboard
- view projects
- send request
- my activity
- my reviews & feedbacks
- profile
- logout

## Client Side
- dashboard
- create new project
- view freelancers
- my activity
- profile
- logout

## Common
- authentication
- role-based navigation
- protected routes
- CRUD operations

---

# 14. Future Enhancements

Future versions may include:
- real-time chat
- notifications
- payment integration
- project milestone tracking
- portfolio gallery
- AI-based freelancer recommendations
- admin dashboard
- dispute management

---

# 15. Suggested Tech Stack

## Frontend
- React.js
- Tailwind CSS / Bootstrap
- React Router
- Axios

## Backend
- Node.js
- Express.js

## Database
- MongoDB

## Authentication
- JWT
- bcrypt

## File Upload (Future)
- Cloudinary

---

# 16. High-Level Database Entities

The system should include:

- Users
- FreelancerProfiles
- ClientProfiles
- Projects
- Requests / Proposals
- Reviews
- ActivityLogs

---

# 17. Success Metrics

The system is successful if:
- freelancers can view and request projects,
- clients can post and manage projects,
- activity is visible to both users,
- profile pages work correctly,
- the role-based navbar is functioning as intended.

---

# 18. Conclusion

The **Freelance Service Marketplace** is a clean and practical full stack project designed around a simple but useful workflow between freelancers and clients.

This role-based version focuses on:
- clear navigation,
- project posting,
- request management,
- activity tracking,
- reviews,
- and profile handling.

It is highly suitable for:
- college final year projects,
- MERN stack development,
- portfolio showcase,
- and real-world system design learning.

---