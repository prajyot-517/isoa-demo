type CheckboxProps = {
  label?: string;
  name: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
};

const Checkbox = ({
  label,
  name,
  checked,
  onChange,
  id = "",
}: CheckboxProps) => {
  return (
    <label className="inline-flex items-center space-x-2">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="text-primaryBg focus:outline-none rounded border-primaryBg h-6 w-6"
        style={{ accentColor: "#C496FF" }}
        id={id}
      />
      {label && <span className="text-grayCustom">{label}</span>}
    </label>
  );
};

export default Checkbox;
