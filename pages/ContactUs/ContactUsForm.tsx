import "tailwindcss-elevation";
import React, { useEffect, useState } from "react";
import HeaderComponent from "../../components/Header/HeaderComponent";
import FooterComponent from "../../components/Footer/FooterComponent";
import emailjs from '@emailjs/browser'
import Swal from 'sweetalert2'
export default function ContactUsFormPage() {
  const [message, setmessage] = useState(String)
  const [emails, setemail] = useState(String)

  //const SERVICE_ID = 'service_2ji0cis' //rex
  const SERVICE_ID = 'service_pbjqier'
  //const TEMPLATE_ID = 'template_xds100p' //rex
  const TEMPLATE_ID = 'contact_form'
  //const USER_ID = 'm68HX1pYXIo5JCuJa' rex
  const USER_ID = 'iBjsKXibozEgEn3zJ'

  const form = React.useRef() as React.MutableRefObject<HTMLFormElement>

  const sendEmail = (e: any) => {
    e.preventDefault()

    const formData = {
      email: emails,
      message: message,
    }

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, USER_ID).then(
      (result: any) => {
        console.log(form.current)
        console.log(result.text)
        Swal.fire({
          icon: 'success',
          title: 'Message Sent Successfully',
        })
      },
      (error: any) => {
        console.log(error.text)
        Swal.fire({
          icon: 'error',
          title: 'Ooops, something went wrong',
        })
      }
    )
  }

  /*
   <form ref={form} onSubmit={sendEmail} className="space-y-8">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Your email
              </label>
              <input
              onChange={(e) => setemail(e.target.value)}
              id="from_email"
              name="from_email"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                placeholder="name@flowbite.com"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label
              
                htmlFor="message"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
              >
                Your message
              </label>
              <textarea
              onChange={(e) => setmessage(e.target.value)}
              id="message"
              name="message"
                rows={6}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Leave a comment..."
              ></textarea>
            </div>
            <button
              
              value="Submit"
              type="submit"
              className="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Send message
            </button>
          </form>
                      <div  className="w-fit h-fit m-2 p-1 bg-gradient-to-r rounded-lg from-[#FFFF00] to-[#00FFFF]">
              <Card style={{backgroundColor: "#000000"}} imgSrc="https://flowbite.com/docs/images/blog/image-1.jpg">
  */
  return (
    <>
    <div className='bg-black'>
      <HeaderComponent></HeaderComponent>
      <div className="bg-black h-screen w-full items-center justify-center flex flex-col">
        <div className="bg-gradient-to-r rounded-lg from-[#FFFF00] to-[#00FFFF] p-2 w-fit h-fit  max-w-full-md">
          <div className="bg-black w-fit h-fit">
          <h2 className="text-4xl py-5 tracking-tight font-extrabold text-center text-white dark:text-white">
            Contact Us
          </h2>
          <p className="font-light text-center text-white dark:text-gray-400 p-4 sm:text-xl">
            If you want to get in touch with our team please send an email to Info@REXExchange.io
          </p>
          </div>
        </div>
      </div>
      <FooterComponent></FooterComponent>
    </div>
  </>
  );
}
