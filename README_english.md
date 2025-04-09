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




