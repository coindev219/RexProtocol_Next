
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import * as Auth from "../../data/AuthData";
import Swal from "sweetalert2";
import Link from "next/link";
import FooterComponent from "../../components/Footer/FooterComponent";
import HeaderComponent from "../../components/Header/HeaderComponent";
export default function SignUp() {
  /*
  const { data: session } = useSession();

  const handleGoogleSignUp = () => {
    signIn("google", { callbackUrl: "/callback" });
  };
  const handleCredentialSignUp = () => {
    signIn("credentials", { callbackUrl: "/callback" });
  };
  */

  const SigninPage = () => {
    return (
      <>
      "
        <Link href="/SignIn/SignInPage">
          <a className="font-medium text-primary-600 hover:underline dark:text-primary-500">
            Login here
          </a>
        </Link>
        ""
      </>
    );
  };

  const handleSignUp = async (e: any) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;
    const account = e.target.email.value;

    if(confirmedpassword != password){
      Swal.fire({
        icon: "warning",
        title: `Please check that your passwords match`,
        
      });
    }else{

    const accountCreation = await Auth.SignUp({ email, account, password });

    if (accountCreation?.status == 200) {
      Swal.fire({
        icon: "success",
        title: `Your account has been created!`,
        html: '<a className="cursor-pointer" href="/SignIn/SignInPage" class="link">Login</a>',
      });
      return;
    }if (accountCreation?.status == 401) {
      Swal.fire({
        icon: "error",
        title: `You already have an account with that email`,
      });
      return;
    }
    else {
      Swal.fire({
        icon: "error",
        title: "There was an error creating your account",
      });
      return;
    }
  }
  };

  const [confirmedpassword, SetConfirmedPassword] = useState(String);
  const [termsaccepted, settermsaccepted] = useState(false);
  const [password, SetPassword] = useState(String);

  const handleInput = (event: any) => {
    SetConfirmedPassword(event.target.value);
  };
  const handlepassInput = (event: any) => {
    SetPassword(event.target.value);
  };

  return (
    <>
      <HeaderComponent />
      <div className="flex flex-col w-full py-6 bg-black items-center justify-center text-center">
        <div className="flex flex-col w-full items-center justify-center   mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create an account
              </h1>
              <form
                onSubmit={handleSignUp}
                className="space-y-4 md:space-y-6"
                action="#"
              >
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    onInput={handlepassInput}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm password
                  </label>
                  <input
                    onInput={handleInput}
                    type="confirm-password"
                    name="confirm-password"
                    id="confirm-password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      aria-describedby="terms"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required
                      onClick={() => settermsaccepted(!termsaccepted)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="terms"
                      className="font-light text-gray-500 dark:text-gray-300"
                    >
                      I accept the{" "}
                      <a
                        className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                        href="#"
                      >
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                </div>
                <button
                  type="submit"

                  className={` w-full text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center `}
                >
                  Create an account
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link href="/SignIn/SignInPage">
                    <a className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                      Login here
                    </a>
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </>
  );
}
