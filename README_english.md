# ArmTours Dashboard

## Project Description

As part of my Bachelor's thesis, I developed a dashboard called **"ArmTours"**. This system is aimed at tourists or solo travelers who wish to plan their trip to Armenia independently and efficiently. It provides all the necessary information to help plan a trip. While the focus is currently on Armenia, the system is designed in such a way that it can be easily extended to other countries.

The dashboard displays Armenia's oldest churches and culturally significant landmarks. In addition to historical information, practical travel data such as addresses, opening hours, and additional tips are provided. The goal of the project is to spark interest in Armenia among people who know little about the country. Since Armenia was the first country to adopt Christianity as a state religion, a special focus is placed on presenting the oldest churches. However, other notable places are also included to further attract travelers' interest.

---

## Installation Guide

Currently, the system works only locally. To run the system, the following tools need to be installed:

- **Docker Desktop**: To run all three containers (_Frontend_, _Backend_, _Database_) simultaneously.
- **Docker Compose**: To define and manage multi-container applications.
- **npm**: Node Package Manager for managing frontend dependencies.

### Steps to Run:

1. **Start Docker Containers:**

```bash
docker-compose build
docker-compose up -d
```

After running the following commands, the containers for **Frontend**, **Backend**, and **Database** will be visible in **Docker Desktop**.

### Start Frontend:

```bash
cd frontend
npm install
npm run serve
```

The application will then be available at http://localhost:8080.

---

## Using the Dashboard

Upon the first launch, the interface will be empty, as no migrations have been run, and the database is empty. The home page at [http://localhost:8080](http://localhost:8080) initially shows a scrollable area and a map of Armenia, divided into provinces.

When you click on a province, recommendations for places (e.g., churches or landmarks) appear. To fully test the system:

1. Register as a user.
2. Open the local database and manually change the user's role from `user` to `supersuperuser`.

Now, you can add new places, comment, reply to comments, rate places, and create collections. You can also add churches to your own collection in the profile section.

Users can edit their first name, last name, birthdate, and profile picture. The added places in a collection are visible in the profile and can be directly deleted or visited. All comments made by the user are also listed in the profile, each with a link to the associated place.

## User Roles

There are three roles in the system:

- **supersuperuser**: Admin with access to the admin panel. Can promote, demote, or delete users.
- **superuser**: Moderator without access to the admin panel, but with rights to moderate (e.g., delete comments/reviews).
- **user**: Regular users who can comment, rate, and create collections.

## Comments and Reviews

By default, only the three most recent comments and reviews are shown on a detail page. If more are available, a button appears to open a popup displaying all existing comments and reviews.

---

## Additional Features

The application offers extra features beyond basic requirements. Users can edit their first name, last name, and birth date — the username remains unchanged. They can also upload a profile picture which appears throughout the dashboard.

The profile page shows all comments made by the user, along with direct links to the commented site.

Superusers (moderators) can delete inappropriate comments and ratings. Ratings include a comment field, which is also subject to moderation.

## Non-Functional Requirements

### User-Friendliness

The dashboard is user-friendly with an intuitive navigation system. Each page includes a brief textual introduction. Visual cues such as color-coded buttons (e.g., red delete buttons) enhance the user experience.

### Responsive Layout

Thanks to responsive design, the dashboard adapts to various screen sizes:

- On standard screens, content is evenly distributed.
- On large screens, content scales down to show more information.
- On small screens (e.g., mobile devices), content is stacked vertically for readability and clarity.

### Access Control

The system uses a role-based access model:

- Unregistered users cannot access protected features like commenting, rating, or creating collections.
- Attempting these actions redirects the user to the login page or shows an informational message.
- Only Superusers and Supersuperusers can access the admin panel and moderation tools.

---

## Implementation Details

Due to the complexity of both functional and non-functional requirements, appropriate technologies were selected to ensure an efficient and maintainable implementation.

### Frontend with Vue 3

The frontend is built with Vue 3, a modern JavaScript framework ideal for creating interactive web interfaces. Its modular structure enables the development of self-contained components, simplifying testing and prioritization. This is especially useful for the dashboard, which consists of clearly separated features.

### Navigation with Vue Router

Vue Router handles navigation between different views (e.g., main page, detail pages for churches/landmarks, profile, login/register). It supports dynamic routing based on the current URL, ensuring a user-friendly and scalable navigation experience.

### State Management with Vuex

Vuex is used to manage global application state (e.g., ratings, comments, user data, church and landmark data). Thanks to Vuex modules, the state store is divided into manageable sections, improving clarity and maintainability.

### Backend with Node.js

The backend is powered by Node.js, a server-side JavaScript runtime. It allows for a unified language across the frontend and backend. Node.js is ideal for real-time applications and asynchronous operations, such as API fetches. With the support of the npm ecosystem, development is accelerated with access to a wide range of libraries.

### Data Storage with MySQL

The system uses MySQL, a reliable relational database, ideal for handling structured data like user profiles, comments, ratings, and church info. Its stability and popularity make it a solid choice for this project.



