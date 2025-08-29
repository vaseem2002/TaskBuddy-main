# TaskBuddy

![TaskBuddy Logo](./public/task.png) <!-- Add your logo here if you have one -->

TaskBuddy is a **task management application** built with **React** and **Firebase**. It allows users to create, organize, and track tasks in a simple and intuitive interface. Tasks can be categorized into **To-Do**, **In Progress**, and **Completed** sections, and users can sign in with **Google Authentication** to save their tasks securely.

---

## Features

- **Task Management**:
  - Add, edit, and delete tasks.
  - Drag-and-drop tasks between **To-Do**, **In Progress**, and **Completed** sections.
  - Filter tasks by category (Work, Personal, etc.).
  - Search tasks by title.

- **User Authentication**:
  - Sign in with **Google**.
  - Securely store user data in **Firebase**.

- **Responsive Design**:
  - Works seamlessly on desktop, tablet, and mobile devices.

- **Real-Time Updates**:
  - Tasks are synced in real-time using **Firestore**.

---

## Technologies Used

- **Frontend**:
  - React
  - React Icons (for icons)
  - React Beautiful DnD (for drag-and-drop functionality)

- **Backend**:
  - Firebase Authentication (for user authentication)
  - Firestore (for database)
  - Firebase Hosting (for deployment)

- **Styling**:
  - Tailwind CSS (for responsive and modern UI)

---

## Live Demo

Check out the live demo of TaskBuddy: [TaskBuddy Live Demo](https://taskbuddy-bee3f.web.app/) 

---


## Getting Started

Follow these steps to set up and run TaskBuddy on your local machine.

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- Firebase account (for Firebase configuration)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/TaskBuddy.git
   cd TaskBuddy

2. **Install dependencies:**:
   ```bash
    npm install

3. **Set up Firebase:**:
    Create a Firebase project at Firebase Console.

    Add a web app to your Firebase project and copy the Firebase configuration.

    Create a .env file in the root of your project and add the Firebase configuration:
    ```bash
    REACT_APP_FIREBASE_API_KEY=your-api-key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
    REACT_APP_FIREBASE_PROJECT_ID=your-project-id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
    REACT_APP_FIREBASE_APP_ID=your-app-id
    REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id

4. **Run the development server:**:
    ```bash
        npm run dev
    The app will open at http://localhost:5173/.

**Deployment**

TaskBuddy is deployed using Firebase Hosting. To deploy your own version:
1. **Install Firebase CLI:**
    ```bash
    npm install -g firebase-tools

2. **Login to Firebase:**
    ```bash
    firebase login

3. **Initialize Firebase Hosting:**
    ```bash
   firebase init

    Select Hosting.
    Choose your Firebase project.
    Set the public directory to build.

4. **Build the project:**
    ```bash
    npm run build

5. **Deploy to Firebase Hosting:**
    ```bash
    firebase deploy

Your app will be live at the Firebase Hosting URL provided in the terminal.

**Folder Structure**

    ```bash
    TaskBuddy/
    ├── public/                  # Static assets
    ├── src/                     # Source code
    │   ├── assets/              # Images and icons
    │   ├── components/          # Reusable components
    │   ├── config/              # Firebase configuration
    │   ├── App.js               # Main application component
    │   ├── index.js             # Entry point
    │   └── styles/              # Global styles
    ├── .env                     # Environment variables
    ├── .gitignore               # Files to ignore in Git
    ├── package.json             # Project dependencies
    ├── README.md                # Project documentation
    └── firebase.json            # Firebase Hosting configuration

## License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

---

## Acknowledgments

- [Firebase](https://firebase.google.com/) for backend services.
- [React Beautiful DnD](https://github.com/atlassian/react-beautiful-dnd) for drag-and-drop functionality.
- [Tailwind CSS](https://tailwindcss.com/) for styling.

---

## Contact

If you have any questions or feedback, feel free to reach out:

- **Your Name**  
- **Email**: balajikarthik004@gmail.com  
- **GitHub**: [balajikarthik2004](https://github.com/balajikarthik2004)  
- **LinkedIn**: [Balaji](https://www.linkedin.com/in/balaji-k-894031258/)

---

Thank you for checking out **TaskBuddy**! 🚀
