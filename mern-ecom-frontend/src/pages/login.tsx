import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase";
import { useLoginMutation } from "../redux/api/userAPI";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../types/api-types";
import PageTitle from "../components/page-title";

const Login = () => {
    const [isNewUser, setIsNewUser] = useState(false);
    const [gender, setGender] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);

    const [login] = useLoginMutation();

    const loginHandler = async () => {
        if (isNewUser) {
            if (!gender) return toast.error("Please select your gender");
            if (!date) return toast.error("Please enter your date of birth");
        }

        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const { user } = await signInWithPopup(auth, provider);

            const res = await login({
                name: user.displayName!,
                email: user.email!,
                photo: user.photoURL!,
                gender,
                role: "user",
                dob: date,
                _id: user.uid,
            });

            if ("data" in res) {
                toast.success(res.data.message);
            } else {
                const error = res.error as FetchBaseQueryError;
                const resMsg = error.data as MessageResponse;
                toast.error(resMsg.message);
            }
        } catch (error) {
            toast.error("Sign in failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login">
            <PageTitle title="Sign In" />
            <main>
                <h1 className="heading">Welcome to Buyosphere</h1>

                <div className="login-tabs">
                    <button
                        className={!isNewUser ? "active" : ""}
                        onClick={() => setIsNewUser(false)}
                    >
                        Returning User
                    </button>
                    <button
                        className={isNewUser ? "active" : ""}
                        onClick={() => setIsNewUser(true)}
                    >
                        New User
                    </button>
                </div>

                {isNewUser && (
                    <div className="login-new-fields">
                        <div>
                            <label>Gender</label>
                            <select value={gender} onChange={(e) => setGender(e.target.value)}>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="others">Others</option>
                            </select>
                        </div>
                        <div>
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                max={new Date().toISOString().split("T")[0]}
                            />
                        </div>
                    </div>
                )}

                <button className="google-btn" onClick={loginHandler} disabled={loading}>
                    <FcGoogle />
                    <span>{loading ? "Signing in..." : "Continue with Google"}</span>
                </button>

                {!isNewUser && (
                    <p className="login-hint">
                        First time here?{" "}
                        <span onClick={() => setIsNewUser(true)}>Create an account</span>
                    </p>
                )}
            </main>
        </div>
    );
};

export default Login;
