import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // React Icons for Edit and Delete
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies

const CarDashboard = () => {
  const [cars, setCars] = useState([]);
  const [rentals, setRentals] = useState([]);  // New state for rental details
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [showEditCarModal, setShowEditCarModal] = useState(false);
  const [newCar, setNewCar] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    availability: true,
    images: [],
    listedBy: '', // Assuming the user is logged in and you will pass the user ID
  });
  const [editingCar, setEditingCar] = useState(null); // Store car being edited

  const BASE_URL = 'http://localhost:5000/'; // Use the correct base URL

  const getAuthToken = () => {
    return Cookies.get('authToken'); // Ensure this returns the token correctly
  };

  // Fetch all cars for the logged-in user
  const fetchCars = () => {
    axios.get(`${BASE_URL}api/cars/user`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}` // Pass the auth token here
      }
    })
      .then(response => {
        setCars(response.data);
      })
      .catch(error => {
        console.error('Error fetching cars:', error);
      });
  };

  // Fetch rental details for each car
  const fetchRentals = () => {
    axios.get(`${BASE_URL}api/rentals`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}` // Pass the auth token here
      }
    })
      .then(response => {
        setRentals(response.data);
        console.log('rantel detail',response.data)
      })
      .catch(error => {
        console.error('Error fetching rentals:', error);
      });
  };

  useEffect(() => {
    fetchCars();
    fetchRentals();  // Fetch rental details when component mounts
  }, []);

  const addCar = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('make', newCar.make);
    formData.append('model', newCar.model);
    formData.append('year', newCar.year);
    formData.append('price', newCar.price);
    formData.append('availability', newCar.availability);
    formData.append('listedBy', newCar.listedBy);

    newCar.images.forEach(image => {
      formData.append('images', image);
    });

    axios.post(`${BASE_URL}api/cars`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${getAuthToken()}` // Ensure the token is added here
      }
    })
      .then(() => {
        fetchCars();
        setShowAddCarModal(false);
        setNewCar({
          make: '',
          model: '',
          year: '',
          price: '',
          availability: true,
          images: [],
          listedBy: ''
        });
      })
      .catch(error => {
        console.error('Error adding car:', error);
      });
  };

  const updateCar = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('make', newCar.make);
    formData.append('model', newCar.model);
    formData.append('year', newCar.year);
    formData.append('price', newCar.price);
    formData.append('availability', newCar.availability);
    formData.append('listedBy', newCar.listedBy);

    newCar.images.forEach(image => {
      formData.append('images', image);
    });

    axios.put(`${BASE_URL}api/cars/${editingCar._id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${getAuthToken()}` // Pass the auth token here
      }
    })
      .then(() => {
        fetchCars();
        fetchRentals();  // Re-fetch rentals after updating car
        setShowEditCarModal(false);
        setEditingCar(null);
        setNewCar({
          make: '',
          model: '',
          year: '',
          price: '',
          availability: true,
          images: [],
          listedBy: ''
        });
      })
      .catch(error => {
        console.error('Error updating car:', error);
      });
  };

  // Handle delete car
  const deleteCar = (id) => {
    axios.delete(`${BASE_URL}api/cars/${id}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}` // Pass the auth token here
      }
    })
      .then(() => {
        fetchCars();
        fetchRentals();  // Re-fetch rentals after deleting a car
      })
      .catch(error => {
        console.error('Error deleting car:', error);
      });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setNewCar({ ...newCar, images: [...e.target.files] });
  };

  // Handle open edit modal
  const openEditModal = (car) => {
    setEditingCar(car);
    setNewCar({
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      availability: car.availability,
      images: [],
      listedBy: car.listedBy
    });
    setShowEditCarModal(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="text-2xl font-semibold mb-4">Car Listings Dashboard</div>

      {/* Add Car Button */}
      <button
        onClick={() => setShowAddCarModal(true)}
        className="bg-blue-500 text-white p-2 rounded mb-4 hover:bg-blue-600"
      >
        Add New Car
      </button>

      {/* Car List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cars.map((car) => {
          // Find the rental details that match the car
          const rental = rentals.find(rental => rental.carId === car._id);

          return (
            <div
              key={car._id}
              className="p-4 border rounded shadow-lg hover:shadow-xl"
            >
              <img
                src={car.images.length ? `${BASE_URL}${car.images[0]}` : '/default-image.jpg'}
                alt="Car"
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h3 className="font-bold text-xl">{car.make} {car.model}</h3>
              <p className="text-gray-600">{car.year} - ${car.price}</p>
              <p className="text-gray-600">Status: {car.paymentStatus}</p>

              {/* Rental Details */}
              {rental ? (
                <div className="mt-4">
                  <p className="text-gray-600">Renter: {rental.renterName}</p>
                  <p className="text-gray-600">Start Date: {new Date(rental.startDate).toLocaleDateString()}</p>
                  <p className="text-gray-600">End Date: {new Date(rental.endDate).toLocaleDateString()}</p>
                  <p className="text-gray-600">Payment Status: {rental.paymentStatus}</p>
                </div>
              ) : (
                <p className="text-gray-600">No rental information available.</p>
              )}

              {/* Update Payment Status */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => openEditModal(car)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex items-center"
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
                <button
                  onClick={() => deleteCar(car._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center"
                >
                  <FaTrashAlt className="mr-2" /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Car Modal */}
      {(showAddCarModal || showEditCarModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-1/3">
            <div className="text-xl font-semibold mb-4">
              {showEditCarModal ? 'Edit Car' : 'Add New Car'}
            </div>
            <form onSubmit={showEditCarModal ? updateCar : addCar}>
              <input
                type="text"
                className="w-full p-2 mb-4 border rounded"
                placeholder="Car Make"
                value={newCar.make}
                onChange={(e) => setNewCar({ ...newCar, make: e.target.value })}
                required
              />
              <input
                type="text"
                className="w-full p-2 mb-4 border rounded"
                placeholder="Car Model"
                value={newCar.model}
                onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                required
              />
              <input
                type="number"
                className="w-full p-2 mb-4 border rounded"
                placeholder="Car Year"
                value={newCar.model}
                onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                required
              />
              <input
                type="number"
                className="w-full p-2 mb-4 border rounded"
                placeholder="Year"
                value={newCar.year}
                onChange={(e) => setNewCar({ ...newCar, year: e.target.value })}
                required
              />
              <input
                type="number"
                className="w-full p-2 mb-4 border rounded"
                placeholder="Price"
                value={newCar.price}
                onChange={(e) => setNewCar({ ...newCar, price: e.target.value })}
                required
              />
              <label className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  checked={newCar.availability}
                  onChange={(e) => setNewCar({ ...newCar, availability: e.target.checked })}
                />
                <span>Available</span>
              </label>
              <input
                type="file"
                className="w-full p-2 mb-4 border rounded"
                multiple
                onChange={handleFileChange}
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => {
                    setShowAddCarModal(false);
                    setShowEditCarModal(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {showEditCarModal ? 'Update Car' : 'Add Car'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDashboard;

