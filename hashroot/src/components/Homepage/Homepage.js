import React from "react";
import "./Homepage.css";

const Homepage = () => {
  return (
    <div className="homepage">
      <div className="header-section">
        <div className="solar-animation"></div>
        <h1 className="welcome-message">
          Welcome to <span className="solar-step">Solar Step</span>
        </h1>
        <div className="primary-image-container">
          <img
            src="https://www.solarreviews.com/content/images/blog/post/focus_images/3214_bff853c5-9791-458e-836f-f6123011deb0.jpg"
            alt="Primary solar panel"
            className="primary-image"
          />
        </div>
        <br></br>
        <p className="intro-text">
          Welcome to our Solar Step! Our mission is to make the process of
          installing solar panels hassle-free for you. We understand that solar
          panel installation can be overwhelming and time-consuming, and that's
          why we're here to help. Our goal is to provide you with a luxurious
          and cost-effective alternative to traditional energy sources. With our
          company, you can enjoy the benefits of solar energy without the stress
          of installation. Let us help you save money while taking care of your
          home and the planet.
        </p>
      </div>
      <div className="gallery-section">
        <h2 className="gallery-title">Explore Our Solar Solutions</h2>
        <div className="image-grid">
          {/* Add more images as desired */}
          {[
            "https://e360.yale.edu/assets/site/Bavaria_solar-panels_web.jpg",
            "https://cdn.imaggeo.egu.eu/media/uploads/2019/02/05/fdde6bb54e39c5489fd17c97be7faaf9.jpg",
            "https://cdn.shopify.com/s/files/1/0011/4102/files/grid-tie-solar-system-components.png?v=1636486347",
            "https://solarmetric.com/wp-content/uploads/2021/03/Solar-Powered-Smart-Homes.jpg",
            "https://www.electricchoice.com/wp-content/uploads/2017/02/solar-panels-for-home.jpg",
            "https://cdn.mos.cms.futurecdn.net/ZJ8VBgoGArXCv7KdDDzRUC-415-80.jpg",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXMHOsuegLEhtSEvZ8s3yNua9XAsnDrJZ0AQ&usqp=CAU",
            "https://amazingarchitecture.com/storage/2626/solar_panel_home.jpg",
          ].map((imageUrl, index) => (
            <div className="image-card" key={index}>
              <img src={imageUrl} alt={`Solar image ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
      <div className="info-image-container">
        <h1 className="welcome-message">
          The Solar Process by <span className="solar-step">Solar Step</span>
        </h1>{" "}
        <br></br>
        <p>
          Solar panels absorb the sun's rays and convert them into usable
          electricity. This electricity can be used to power your home or
          business, and any excess energy can be sold back to the grid. Solar
          energy is a clean and renewable source of power, and installing solar
          panels can significantly reduce your energy costs.
        </p>
        <img
          src="https://cdn.greenmatch.co.uk/cdn-cgi/image/format=auto/2/2022/10/how-solar-panels-work.png"
          alt="Solar production cycle"
          className="info-image"
        />
      </div>
      <div className="footer">
        <p>
          © 2023 Solar Step. All rights reserved by CS555 Professor Dr Yu, Mrs
          Hester and her Team - Naveen, Anirudh, Anmol, Atishay, Rajguru and
          Vaibhav.
        </p>
      </div>
    </div>
  );
};

export default Homepage;
