import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./Addlisting.css";
import runAnimations, { allLinks, allFunctions } from "./scripts";

const App = () => {
  const [photos, setPhotos] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const updatedPhotos = [...photos, ...files.slice(0, 6 - photos.length)];
    setPhotos(updatedPhotos);
  };

  const rectangles = [
    "rectangle-21",
    "rectangle-122",
    "rectangle-125",
    "rectangle-120",
    "rectangle-123",
    "rectangle-124",
  ];

  useEffect(() => {
    runAnimations();
  }, []);

  return (
    <div className="parent-div">
      <div className="add-listings-2308 pos-abs">
        <img
          src="https://s3-alpha-sig.figma.com/img/7db9/5335/422da9e1d905c1ad2acd8413a907c00b?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=UW1s9VaUaRWiEHsgbC9X3yyWvfTK9wE9wlu7ygfrKKokxt6OY-t4eEVCBegzekcmz0lGfIP6vNB~TgZfB~O8IWbn57uG8hvN-AIAOrrLpW82Sk3-vAgSs2-f7TtxZkXlZf31eAga~W9C25m7D5Mp4Z5gwc5riOahAPQxGdTPz6vv8VYsFJrCzpCvjOY2MBSU828caFyG5310qB0jLYKdUHy8xFnI4i4W8MZAwncRb2UxfzyFmnzogvHu-Zd33DOPns4-TIkzQUkf59JAWHIeHKHUxbpt5FGtex4gVrpaxWfMbG5wL0Sx1ZlPXpPFPi8b3yUFBdrWgSSaJEHQgc60FQ__"
          className="pos-abs image-div bg-no-repeat fill-parent bg-cover nodeBg-2308"
          alt="2308-ALT"
        />

        <div className="minimalist-logo-23010 pos-abs">
          <img
            src="https://s3-alpha-sig.figma.com/img/f410/f876/4db65d8f5f63c517855805c8ca639b46?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=R6SWRwsXfGXZ26HWRMFuFOKqGvVq5KzjyFqGuIOp57J3zBYTrmHZRR2jcxMDLcSULtTyd9z6ot2oZUceSemqmAtLHowlXOCUlXC2FlXiAm9QWvCRCjcUdOfgA1MxXrNuMxT41ha6mDbK~J0ZUVwvI6xlMHTpW5ZJ4-IZinwJ3k2LSE6XFEnDCSMO7cJfdSCqaWJp7N-fgCJiN2-QHkGZx031J-mmeWqLWJEbQrUNeG2Knl8P49AmzfZYEqYVKzB55e0LOVoOj9AInHI4nB0S6ZpNlKhFNWpJ6M~7riUmV9mjKuti2LSYqb6~uTy1w~b3OiDK01SyBwWZKDIZAc8dbA__"
            className="pos-abs image-div bg-no-repeat fill-parent bg-cover nodeBg-23010"
            alt="23010-ALT"
          />
        </div>

        {/* Your Existing Components Here */}

        {/* Updated Group 21 */}
        <section
          className="group-21-23058 pos-abs"
          onClick={() => document.getElementById("file-input").click()}
        >
          <input
            id="file-input"
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <div className="rectangle-30-23059 pos-abs"></div>
          <div className="insert-photo-23060 pos-abs">
            <span className="insert-photo-23060-0">{`Insert photo`}</span>
          </div>
          <div className="insert-maximum--23052 pos-abs">
            <span className="insert-maximum--23052-0">{`*insert maximum of 6 photos`}</span>
          </div>
        </section>

        {/* Rectangles */}
        {rectangles.map((rect, index) => (
          <div
            key={rect}
            className={`${rect} pos-abs`}
            style={{
              backgroundImage: photos[index]
                ? `url(${URL.createObjectURL(photos[index])})`
                : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: photos[index] ? "transparent" : "#e0e0e0",
            }}
          ></div>
        ))}

        {/* Remaining Components */}
        <div className="room-title-23032 pos-abs">
          <span className="room-title-23032-0">{`Room Title`}</span>
        </div>

        <section className="rectangle-121-241103 pos-abs">
          <div className="rectangle-121-24193 pos-abs"></div>
        </section>

        <div className="rectangle-122-24195 pos-abs"></div>

        <div className="rectangle-125-241101 pos-abs"></div>

        <div className="rectangle-120-23092 pos-abs"></div>

        <div className="rectangle-123-24197 pos-abs"></div>

        <div className="rectangle-124-24199 pos-abs"></div>

        <div className="rectangle-20-23035 pos-abs">
          <input
            type="text"
            className="input-rectangle rectangle-20"
            placeholder="Type here..."
          />
        </div>

        <div className="description-23033 pos-abs">
          <span className="description-23033-0">{`Description`}</span>
        </div>

        <div className="rectangle-28-23038 pos-abs">
          <input
            type="text"
            className="input-rectangle rectangle-28"
            placeholder="Type here..."
          />
        </div>

        <div className="price-23037 pos-abs">
          <span className="price-23037-0">{`Price`}</span>
        </div>

        <div className="rectangle-23-23051 pos-abs">
          <input
            type="text"
            className="input-rectangle rectangle-23"
            placeholder="Type here..."
          />
        </div>

        <div className="address-23050 pos-abs">
          <span className="address-23050-0">{`Address`}</span>
        </div>

        <div className="rectangle-32-23054 pos-abs">
          <input
            type="text"
            className="input-rectangle rectangle-32"
            placeholder="Type here..."
          />
        </div>

        {/* Contact Information Section */}
        <div className="contact-informa-23063 pos-abs">
          <span className="contact-informa-23063-0">{`Contact Information`}</span>
        </div>

        <div className="contact-informa-23066 pos-abs">
          <span className="contact-informa-23066-0">{`Contact Information`}</span>
        </div>

        {/* Confirm Section */}
        <section className="group-8-23044 pos-abs">
          <div className="rectangle-30-23048 pos-abs"></div>

          <div className="confirm-23049 pos-abs">
            <span className="confirm-23049-0">{`Confirm`}</span>
          </div>
        </section>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("dualite-root")).render(<App />);
