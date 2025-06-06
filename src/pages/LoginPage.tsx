import { Link } from "react-router-dom";
import Meta from "../components/Meta";
import useAuthStore from "../store/authStore";
import { useState, useEffect } from "react";

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, clearError } = useAuthStore();

    // Clear any previous errors when component mounts
    useEffect(() => {
        clearError();
    }, [clearError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate inputs
        if (!email || !password) {
            return;
        }
        
        // Attempt login
        await login(email, password);
    };
    
    return (
        <>
            <Meta title="Facebook - log in or sign up" />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="flex md:items-start items-center justify-center gap-8 max-w-5xl md:flex-row flex-col px-2">
                    <div className="space-y-2 w-[80%] md:w-[60%] py-10 px-6">
                        <h1 className="text-blue-600 font-bold text-4xl md:text-6xl md:text-start text-center">facebook</h1>
                        <p className="text-xl md:text-3xl md:text-start text-center">Facebook helps you connect and share with the people in your life.</p>
                    </div>
                    <div className="w-[80%] md:w-[40%]">
                        <div className="rounded-lg bg-white px-4 pt-4 shadow-xl border border-gray-200"> 
                            <form className="border-b-2 border-gray-200 pb-4 space-y-4" onSubmit={handleSubmit}>
                                <div className="border-2 border-gray-200 w-full rounded-md focus-within:border-blue-500">
                                    <input 
                                        type="text" 
                                        className="w-full py-2 px-4 outline-none" 
                                        placeholder="Email address or phone number"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="border-2 border-gray-200 w-full rounded-md focus-within:border-blue-500">
                                    <input 
                                        type="password" 
                                        className="w-full py-2 px-4 outline-none" 
                                        placeholder="Password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    className="py-2 cursor-pointer px-4 text-center bg-blue-500 hover:bg-blue-600 text-white w-full rounded-md font-bold text-xl"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Logging in...' : 'Log in'}
                                </button>
                                <div className="flex items-center justify-center">
                                    <Link to="#" className="text-blue-500 hover:underline-offset-2 hover:underline">Forgotten password?</Link>
                                </div>
                            </form>
                            <div className="p-6 flex items-center justify-center">
                                <Link to="/signup" className="text-white text-[17px] font-semibold px-4 py-3 hover:bg-green-700 bg-green-600 rounded-md">Create new account</Link>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-center">
                                <span className="font-bold">Create a Page </span>
                                <span>for a celebrity, brand or business.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginPage;
