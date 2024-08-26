# SimpleNote App

SimpleNote is a React-based note-taking application that allows users to create, organize, and share notes. It's built using modern web technologies and provides a clean, intuitive interface for managing personal and public notes.

## Features

- User authentication with Google Sign-In
- Create, edit, and delete notes
- Organize notes into folders
- Mark notes as public or private
- View a feed of public notes from all users
- Responsive design for mobile and desktop use

## How It Was Created

SimpleNote was developed using the following technologies:

- React: A JavaScript library for building user interfaces
- TypeScript: A typed superset of JavaScript that compiles to plain JavaScript
- Firebase: A platform developed by Google for creating mobile and web applications
- Vite: A modern frontend build tool that provides a faster and leaner development experience
- Tailwind CSS: A utility-first CSS framework for rapidly building custom user interfaces

The app was initially created using a Replit React template and then customized to implement the SimpleNote features.

## How It Works

### Authentication

- Users sign in using their Google account through Firebase Authentication.
- Upon first sign-in, default folders (Ideas, Tasks, Journal) are created for the user.

### Notes Management

- Users can create notes by providing a title, content, and selecting a folder.
- Notes can be marked as public or private using a checkbox.
- Users can edit or delete their own notes.

### Folders Management

- Users can create, edit, and delete folders to organize their notes.
- Each folder has a name and description.

### Public Notes Feed

- The home page displays a feed of public notes from all users.
- Public notes are shown in chronological order, with the most recent notes appearing first.

### Data Storage

- All data (notes and folders) is stored in Firebase Firestore, a cloud-hosted NoSQL database.
- Real-time updates are implemented using Firestore's onSnapshot listeners.

## Getting Started

To run SimpleNote locally:

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up a Firebase project and add your configuration to the app
4. Run the development server with `npm run dev`

## Running on Replit

SimpleNote is configured to run on Replit:

* Hit the "Run" button to start the development server
* Edit `App.tsx` or other component files and watch them update in real-time!

By default, Replit runs the `dev` script, but you can configure it by changing the `run` field in the `.replit` configuration file.

For deploying a production version, refer to the [Vite documentation](https://vitejs.dev/guide/build.html) for serving production websites.