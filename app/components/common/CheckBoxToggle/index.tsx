import { useEffect, useState } from "react";

interface Props {
  initialChecked?: boolean | null;
  isEnabled?: boolean | null;
  setValue: React.Dispatch<React.SetStateAction<any>>;
  handleToggleOptionalExtension: (index: any, checked: any) => void;
  index: number;
}

const CheckBoxToogle: React.FC<Props> = ({
  initialChecked = false,
  isEnabled = true,
  setValue,
  handleToggleOptionalExtension,
  index,
}) => {
  const [checked, setChecked] = useState(initialChecked);

  useEffect(() => {
    setChecked(initialChecked);
  }, [initialChecked]);

  const handleChange = (e: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setValue((data: any) => {
      return { ...data, checked: e.target.checked };
    });
    setChecked(e.target.checked);
    handleToggleOptionalExtension(index, e.target.checked);
  };

  return (
    <label className="inline-block w-[50px] lg:w-[65px] h-6 lg:h-8 relative cursor-pointer">
      <input
        type="checkbox"
        className="opacity-0 absolute w-full h-full"
        checked={checked ?? false}
        onChange={handleChange}
        disabled={!isEnabled}
      />
      <div
        className={`flex items-center rounded-full transition-all duration-300 ease-in-out border ${
          checked
            ? "bg-softBg border-[#4DBFB3]"
            : "bg-[#D8D8D8] border-[#B1B1B1]"
        } w-[50px] lg:w-[65px] h-full relative`}
      >
        <div
          style={{
            transform: checked ? "translateX(calc(100%))" : "translateX(0)",
            transition: "transform 0.3s ease-in-out",
          }}
          className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full ${
            checked ? "bg-primaryBg" : "bg-white"
          } absolute left-0 transition-all duration-300 ease-in-out`}
        ></div>
      </div>
    </label>
  );
};

export default CheckBoxToogle;
