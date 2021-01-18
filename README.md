This is the repository for Jungle - the Agile Project Management Tool with focus on simplicity and speed.
This project is built on top of the [Taiga Backend](https://github.com/taigaio/taiga-back) and provides a simplified, yet faster and more modern interface.

# General

This application is built with Next.JS and React. For simple deplyoment, please visit [Vercel](https://vercel.com).

# Installation

To install the dependencies and run the project locally, simply run `npm install`. You must have **Node.js** installed.

# Run

To run the project, simply type `npm run dev`. You can build the project with `npm run build`. More scripts are available in `package.json`.

# Environment

In order for this project to work, it needs to be connected with a running instance of [Taiga Backend](https://github.com/taigaio/taiga-back). To connect the application, define the `NEXT_PUBLIC_TAIGA_API_URL` variable in your `.env` file. An example is given in `.env.example`.

# Functionality

Jungle provides a modern, mobile-first interface around some of the primitives defined by the Taiga Backend. It does however drive a more simplistic approach which does not include all features of Taiga. 
Missing Features include:

- Wiki Functionality
- Issues Functionality (Focus lies on Userstory and Tasks instead)
- Epics
- Pure Kanban Projects

Missing functionalities can be added over time to complement the features. However, most of the listed features were left out on purpose to simplify the platform and keep it tidy.

This project is focused on an easy Scrum process, featuring:
- The creation of Scrum projects
- A Backlog consisting of User Stories and Tasks
![Backlog Image](https://raw.githubusercontent.com/fewhnhouse/jungle/master/screenshots/backlog.png "Backlog Screenshot")
- The possibility to create Sprints which contain User Stories and Tasks
- A Sprint Taskboard with a sophisticated filter functionality, allowing the users to update their task status
![Board Image](https://raw.githubusercontent.com/fewhnhouse/jungle/master/screenshots/board.png "Backlog Screenshot")
- Commenting, Mentioning and Assigning people to tasks, alongside a Notification System
- [SWR](https://tools.ietf.org/html/rfc5861)-inspired caching strategy which always keeps the UI up to date

Jungle additionally features a Gamification System with a focus on motivating its users on a team level, awarding them with Medals and a Team-Score.
![Project Image](https://raw.githubusercontent.com/fewhnhouse/jungle/master/screenshots/project.png "Project Screenshot")

Please keep in mind that this project is in a prototype stage and not ready for production usage yet. 
Contributions are welcome.