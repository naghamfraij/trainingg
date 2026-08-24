type LocationButtonProps = {
  onLocation: (latitude: number, longitude: number) => void;
  onError: (message: string) => void;
};

function LocationButton({ onLocation, onError }: LocationButtonProps) {
  const getLocation = () => {
    if (!navigator.geolocation) {
      onError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocation(position.coords.latitude, position.coords.longitude);
      },
      () => {
        onError("Could not access your location");
      },
    );
  };

  return <button onClick={getLocation}>Use My Location</button>;
}

export default LocationButton;
