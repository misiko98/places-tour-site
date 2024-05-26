import { useEffect, useRef, useState } from 'react';
import logoImg from './assets/logo.png';
import DeleteConfirmation from './components/DeleteConfirmation';
import Modal from './components/Modal';
import Places from './components/Places';
import { AVAILABLE_PLACES } from './data';
import { sortPlacesByDistance } from './loc';

const getItemsFromStorage = (key, defaultValue) => {
  const storedItems = localStorage.getItem(key);

  return storedItems ? JSON.parse(storedItems) : defaultValue;
};

const App = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(
    getItemsFromStorage('selectedPlaces', [])
  );

  const selectedPlace = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        pos.coords.latitude,
        pos.coords.longitude
      );

      setAvailablePlaces(sortedPlaces);
    });
  }, []);

  const handleStartRemovePlace = (id) => {
    setModalIsOpen(true);
    selectedPlace.current = id;
  };

  const handleStopRemovePlace = () => {
    setModalIsOpen(false);
  };

  const handleSelectPlace = (id) => {
    setPickedPlaces((prevPickedPlaces) => {
      //previously selected
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }

      const place = AVAILABLE_PLACES.find((place) => place.id === id);

      return [place, ...prevPickedPlaces];
    });

    // const stored
    if (storedIds.indexOf(id) === -1) {
      localStorage.setItem(
        'selectedPlaces',
        JSON.stringify([id, ...storedIds])
      );
    }
  };

  const handleRemovePlace = () => {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );

    setModalIsOpen(false);

    const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    localStorage.setItem(
      'selectedPlaces',
      JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current))
    );
  };

  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        {modalIsOpen && (
          <DeleteConfirmation
            onCancel={handleStopRemovePlace}
            onConfirm={handleRemovePlace}
          />
        )}
      </Modal>
      <header>
        <img src={logoImg} alt="" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="sorting places by distance..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
};

export default App;
