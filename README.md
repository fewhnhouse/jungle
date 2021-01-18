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
