type UnitToggleProps = {
  unit: "metric" | "imperial";
  onChange: () => void;
};

function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <button onClick={onChange}>
      Switch to {unit === "metric" ? "Fahrenheit" : "Celsius"}
    </button>
  );
}

export default UnitToggle;