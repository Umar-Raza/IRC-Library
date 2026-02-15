import React from "react";
import { Link } from "react-router";

export const NoPage = () => {
  return (
    <div className=" text-neutral flex-1 flex items-center justify-center">
      <div className="flex items-center justify-center px-2">
        <div className="text-center">
          <h1 className="text-9xl font-bold">404</h1>
          <p className="text-3xl font-medium mt-4">Oops! Page not found</p>
          <p className="mt-4 mb-5">The page you're looking for doesn't exist or has been moved.</p>
          <Link to="/" className="btn  btn-dash btn-neutral font-semibold rounded-full px-4 py-2 ">
            back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
