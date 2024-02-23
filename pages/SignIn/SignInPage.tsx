import { useSession, signIn, signOut, getSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import * as auth from "../../data/AuthData";
import Swal from "sweetalert2";
import HeaderComponent from "../../components/Header/HeaderComponent";
import FooterComponent from "../../components/Footer/FooterComponent";
export default function SignIn() {

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/callback" });
  };

  const handleSignIn = async (e: any) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      // Call signIn with the provided email and password
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      // Handle the result based on success or failure
      if (result?.status == 401) {
        // Handle sign-in error
        console.log("Sign-in error:", result.error);
        Swal.fire({
          icon: "error",
          title: "incorrect email or password",
        });
      } 
      if (result?.status == 404) {
        // Handle sign-in error
        console.log("Sign-in error:", result.error);
        Swal.fire({
          icon: "error",
          title: "You dont have an account with that email",
        });
      } 
      if(result?.status == 200){
        // Sign-in successful, do something
        console.log("Sign-in successful");
        Swal.fire({
          icon: "success",
          title: "You have been signed in ",
        });
      }
    } catch (error) {
      console.log("Sign-in error:", error);
      Swal.fire({
        icon: "error",
        title: "There was an error loggin into your account",
      });
    }
  };

  return (
    <>
      <HeaderComponent />
      <div className="flex flex-col bg-black  h-screen items-center justify-center text-center">
        <div className="w-full max-w-sm  p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
          <form  onSubmit={handleSignIn} className="space-y-6" action="#">
            <h5 className="text-xl font-medium text-gray-900 dark:text-white">
              Sign in to our platform
            </h5>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your email
              </label>
              <input
  
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your password
              </label>
              <input
  
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
              />
            </div>
            <div className="flex items-start">
              <div className="flex items-start">
                <div className="flex items-center h-5"></div>
              </div>
              <a
                href="#"
                className="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500"
              >
                Lost Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Login to your account
            </button>
            <button
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={handleGoogleSignIn}
            >
              Sign in with Google
            </button>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
              Not registered?{" "}
              <Link href="/SignIn/SignUpPage">
                <a className="text-blue-700 hover:underline dark:text-blue-500">
                  Create account
                </a>
              </Link>
            </div>
          </form>
        </div>
      </div>
      <FooterComponent />
    </>
  );
}
