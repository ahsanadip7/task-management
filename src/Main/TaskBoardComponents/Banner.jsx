import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { FaSignOutAlt } from "react-icons/fa";

const Banner = () => {
    const { user, signOutUser } = useContext(AuthContext);
    const navigate = useNavigate();
    console.log(user);

    const handleSignOut = () => {
        signOutUser()
          .then(() => {
            navigate("/login");
          })
          .catch((error) => {
            console.error(error.message);
          });
      };
    
    return (
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16 px-6 text-center flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Task Management App</h1>
        <p className="text-lg md:text-xl mb-6">Organize. Prioritize. Achieve.</p>
  
        {
        user ? (
            <button 
                onClick={handleSignOut} 
                className="w-[140px] absolute top-[15px] right-[5px] px-6 py-3 text-white bg-red-600 rounded-lg font-semibold shadow-lg flex items-center justify-center hover:bg-red-700 transition-all duration-300 ease-in-out transform hover:scale-105">
                <FaSignOutAlt className="inline mr-2" /> Sign Out
            </button>
        ) : (
            <div className="flex gap-4 justify-center">
                <Link to="login">
                    <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-200 transition duration-300 ease-in-out transform hover:scale-105">
                        Login
                    </button>
                </Link>
                <Link to="signUp">
                    <button className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-yellow-500 transition duration-300 ease-in-out transform hover:scale-105">
                        Sign Up
                    </button>
                </Link>
            </div>
        )}
      </div>
    );
};

export default Banner;
