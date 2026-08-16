type UnitToggleProps = {
  unit: "metric" | "imperial";
  onChange: () => void;
};

function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <button onClick={onChange}>
      {unit === "metric" ? "Switch to °F" : "Switch to °C"}
    </button>
  );
}

export default UnitToggle;