type LocationButtonProps = {
  onLocation: () => void;
};

function LocationButton({ onLocation }: LocationButtonProps) {
  return (
    <button onClick={onLocation}>
      Use My Location
    </button>
  );
}

export default LocationButton;