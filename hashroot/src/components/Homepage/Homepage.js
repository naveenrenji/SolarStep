import React from "react";
import "./Homepage.css";

const Homepage = () => {
  return (
    <div className="homepage">
      <div className="primary-image-container">
        <img
          src="https://www.solarreviews.com/content/images/blog/post/focus_images/3214_bff853c5-9791-458e-836f-f6123011deb0.jpg"
          alt="Primary solar panel"
          className="primary-image"
        />
      </div>
      <div className="text-center">
        Welcome to Solar Step, the ultimate solution for hassle-free solar panel
        installation. Our web app is designed to help you embrace the power of
        solar energy without the stress and complexities of traditional
        installation methods. At Solar Step, we believe that sustainable living
        should be convenient and affordable, and our platform is built to make
        that a reality for you. Our innovative approach to solar panel
        installation will not only provide you with luxury and comfort but also
        help you save money on your energy bills. Join us today and take the
        first step towards a brighter, greener future with Solar Step.
      </div>
      <div className="image-grid">
        <img
          src="https://e360.yale.edu/assets/site/Bavaria_solar-panels_web.jpg"
          alt="Solar panels"
          className="secondary-image"
        />
        <img
          src="https://cdn.imaggeo.egu.eu/media/uploads/2019/02/05/fdde6bb54e39c5489fd17c97be7faaf9.jpg"
          alt="Solar farm"
          className="secondary-image"
        />
        <img
          src="https://cdn.shopify.com/s/files/1/0011/4102/files/grid-tie-solar-system-components.png?v=1636486347"
          alt="Solar system components"
          className="secondary-image"
        />
      </div>
      <div className="info-image-container">
        <div className="text-center">
          The Process of Solar Step Converting Sunlight to Energy in Your Homes.
        </div>
        <img
          src="https://cdn.greenmatch.co.uk/cdn-cgi/image/format=auto/2/2022/10/how-solar-panels-work.png"
          alt="Solar production cycle"
          className="info-image"
        />
      </div>
    </div>
  );
};

export default Homepage;
