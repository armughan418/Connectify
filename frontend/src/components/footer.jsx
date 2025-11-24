import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="bg-orange-500 text-white py-8 mt-10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold">Food E-Commerce</span>. All rights
            reserved.
          </p>
          <div className="flex justify-center mt-3 space-x-6 text-sm">
            <a
              href="#"
              className="hover:text-gray-100 transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-gray-100 transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="hover:text-gray-100 transition-colors duration-200"
            >
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
