import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { signInWithGoogle } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import home from '../assets/home.png';
import google from '../assets/google.png';
import task from '../assets/task.png';

function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is signed in:', user);
        setUser({
          name: user.displayName,
          email: user.email,
          profilePic: user.photoURL,
        });
        navigate('/tasks'); // Redirect to TaskListView after successful login
      } else {
        console.log('No user is signed in.');
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [navigate]); // Add navigate to the dependency array

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gray-100 overflow-x-hidden">
      {/* Left Section (40%) - Text and Button */}
      <div className="w-full lg:w-2/5 p-8 text-center lg:text-left relative">
        <h1 className="text-4xl font-bold text-fuchsia-500 mb-4 flex items-center justify-center lg:justify-start">
          <img src={task} alt="" className="w-10 h-10 mr-2" />
          TaskBuddy
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Streamline your workflow and track progress <br className="hidden lg:block" />
          effortlessly with our all-in-one task management app.
        </p>
        <button
          onClick={signInWithGoogle}
          className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded flex items-center justify-center cursor-pointer sm:text-sm mx-auto lg:mx-0"
        >
          <img src={google} alt="" className="w-6 h-6 mr-2" />
          Continue with Google
        </button>

        {/* Mobile: Circle at the Bottom of the Text */}
        <div className="lg:hidden w-[100px] h-[100px] border-2 border-fuchsia-600 rounded-full absolute -bottom-30 left-1/2 transform -translate-x-1/2"></div>
        <div className="lg:hidden w-[60px] h-[60px] border-4 border-fuchsia-600 rounded-full absolute -bottom-26 left-1/2 transform -translate-x-1/2"></div>
        <div className="lg:hidden w-[80px] h-[80px] border-3 border-fuchsia-600 rounded-full absolute -bottom-28 left-1/2 transform -translate-x-1/2"></div>
      </div>

      {/* Right Section (60%) - Circles and Image */}
      <div className="w-full lg:w-2/5 relative lg:items-start">
        {/* Circles Container */}
        <div className="relative w-full h-full flex  justify-center items-center">
          {/* Large Circle - Desktop */}
          <div className="hidden lg:block w-[700px] h-[700px] border-2 border-fuchsia-700 rounded-full absolute"></div>
          {/* Medium Circle - Desktop */}
          <div className="hidden lg:block w-[550px] h-[500px] border-3 border-fuchsia-600 rounded-full absolute"></div>
          {/* Small Circle - Desktop */}
          <div className="hidden lg:block w-[400px] h-[300px] border-4 border-fuchsia-500 rounded-full absolute"></div>

          {/* Mobile: Circle at Top-Right Corner (Half-Circle) */}
          <div className="lg:hidden w-[150px] h-[150px] border-2 border-fuchsia-600 rounded-full absolute bottom-68 -right-8"></div>
          <div className="lg:hidden w-[130px] h-[130px] border-3 border-fuchsia-600 rounded-full absolute bottom-70 -right-6"></div>
          <div className="lg:hidden w-[110px] h-[110px] border-4 border-fuchsia-600 rounded-full absolute bottom-72 -right-4"></div>

          {/* Mobile: Circle at Left Side (Half-Circle) */}
          <div className="lg:hidden w-[150px] h-[150px] border-2 border-fuchsia-500 rounded-full absolute bottom-0 -left-30 transform -translate-y-1/2"></div>
          <div className="lg:hidden w-[150px] h-[150px] border-3 border-fuchsia-500 rounded-full absolute bottom-0 -left-34 transform -translate-y-1/2"></div>
        </div>

        {/* Image Above Circles - Hidden on Mobile */}
        <img
          src={home}
          alt="TaskBuddy"
          className="hidden lg:block w-[700px] h-[600px] rounded-2xl absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-[150px]"
        />
      </div>
    </div>
  );
}

export default Home;