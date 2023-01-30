import Hero from "./Hero/Hero";

import Auth0Profile from "../auth/Auth0Profile"; // DEV

export default function () {
  return (
    <>
      <Hero />
      <p className="text-center text-2xl text-gray-700">hello world</p>
      <Auth0Profile />
    </>
  );
}
