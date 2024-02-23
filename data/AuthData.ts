//https://us-central1-userdata-cbeb1.cloudfunctions.net/app
interface SignUpDataProps {
  account: string;
  email: string;
  password: string;
}

export async function SignUp({ account, email, password }: SignUpDataProps) {
  try {
    const options = {
      method: "POST",
      json: true, // if truthy, parse *response* as JSON
      headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type/json",
      },
      body: JSON.stringify({
        // have to manually stringify object in bod
        account: email,
        email: email,
        password: password,
        username: email,
      }),
    };
    const response = await fetch(
      "https://rexlogin.herokuapp.com/signup",
      options
    );

    return response;
  } catch (error) {
    console.log(error);
  } finally {
  }
}
interface VerificationProps {
  email: string;
  password: string;
}
export async function VerifyAccount({ email, password }: VerificationProps) {
  try {
    const options = {
      method: "POST",
      json: true, // if truthy, parse *response* as JSON
      headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type/json",
      },

      body: JSON.stringify({
        // have to manually stringify object in bod
        email: email,
        password: password,
      }),
    };
    const response = await fetch(
      "https://rexlogin.herokuapp.com/verify ",
      options
    );
    const data = response;
    return data;
  } catch (error) {
    console.log(error);
  } finally {
  }
}
interface SigininProps {
  email: string;
  password: string;
}

export async function SigninAccount({ email, password }: SigininProps) {
  try {
    const options = {
      method: "POST",
      json: true, // if truthy, parse *response* as JSON
      headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type/json",
      },

      body: JSON.stringify({
        // have to manually stringify object in bod
        email: email,
        password: password,
      }),
    };
    const result = await fetch(
      "https://rexlogin.herokuapp.com/signin",
      options
    );
      console.log(result)
    return true;
  } catch (error) {
    console.log(error);
    return false;
  } finally {
  }
}
export async function FetchAccounts() {
  try {
    const response = await fetch(
      "https://rexlogin.herokuapp.com/ ",
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }
    );
    const data = await response.json();
    const awaitdata = await data;
    return awaitdata;
  } catch (error) {
    console.log(error);
  } finally {
  }
}
