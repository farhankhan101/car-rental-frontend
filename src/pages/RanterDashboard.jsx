import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import SweetAlert from "sweetalert2";
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies

const RenterDashboard = () => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [rentalDetails, setRentalDetails] = useState({
    startDate: "",
    endDate: "",
    contactInfo: { phone: "", email: "" },
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const getAuthToken = () => {
    return Cookies.get('authToken'); // Ensure this returns the token correctly
  };
  const api = axios.create({
    baseURL: "http://localhost:5000/api", 
  });
  const fatchCars = () =>{
    api
      .get("/cars")
      .then((response) => setCars(response.data))
      .catch((error) => console.error("Error fetching cars:", error));
  }

  useEffect(() => {
    fatchCars()
  }, []);

  const openModal = (car) => {
    setSelectedCar(car);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCar(null);
    setRentalDetails({
      startDate: "",
      endDate: "",
      contactInfo: { phone: "", email: "" },
    });
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" || name === "email") {
      setRentalDetails((prev) => ({
        ...prev,
        contactInfo: { ...prev.contactInfo, [name]: value },
      }));
    } else {
      setRentalDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRentCar = () => {
    if (
      !rentalDetails.startDate ||
      !rentalDetails.endDate ||
      !rentalDetails.contactInfo.phone ||
      !rentalDetails.contactInfo.email
    ) {
      return SweetAlert.fire("Error", "Please fill in all fields", "error");
    }

    api
      .post("/rentals", {
        carId: selectedCar._id,
        ...rentalDetails,
      },
      {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`, // Corrected line
        },
      }
      )
      .then(() => {
        SweetAlert.fire("Success", "Car rented successfully", "success");
        fatchCars()
        closeModal();
      })
      .catch((error) => {
        console.error("Error renting car:", error);
        SweetAlert.fire(
          "Error",
          error.response?.data?.message || "Failed to rent car",
          "error"
        );
      });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Available Cars</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div
            key={car._id}
            className="border border-gray-300 rounded-lg p-4 shadow-md"
          >
             <img
              src={car.images.length ? `http://localhost:5000/${car.images[0]}` : '/default-image.jpg'}
              alt="Car"
              className="w-full h-40 object-cover rounded mb-4"
            />
            <h3 className="text-xl font-semibold">
              {car.make} {car.model}
            </h3>
            <p className="text-gray-600">Year: {car.year}</p>
            <p className="text-gray-600">Price: ${car.price}</p>
            <button
              onClick={() => openModal(car)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Rent This Car
            </button>
          </div>
        ))}
      </div>

      {selectedCar && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          className="bg-white p-6 rounded-lg shadow-lg w-1/3 mx-auto mt-10"
          overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center"
        >
          <h2 className="text-xl font-bold mb-4">
            Rent {selectedCar.make} {selectedCar.model}
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={rentalDetails.startDate}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">End Date</label>
              <input
                type="date"
                name="endDate"
                value={rentalDetails.endDate}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                value={rentalDetails.contactInfo.phone}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={rentalDetails.contactInfo.email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </form>
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={handleRentCar}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Submit
            </button>
            <button
              onClick={closeModal}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RenterDashboard;
