interface ToggleButtonGroupProps {
  handleToggleChange: any;
  name: string;
  value: string;
  id?: string;
  disabled?: boolean;
}

const ToggleButtonGroup: React.FC<ToggleButtonGroupProps> = ({
  handleToggleChange,
  name,
  value,
  id = "",
  disabled = false,
}) => {
  return (
    <div className="flex justify-center font-bold items-center bg-white rounded-full">
      <button
        type="button"
        onClick={() => handleToggleChange(name, "yes")}
        className={`w-1/2 py-2 rounded-l-3xl border-y-2 border-l-2 border-r border-primaryBg ${
          value?.toLowerCase() === "yes"
            ? "bg-primaryBg text-white border-0"
            : `text-primaryBg ${
                disabled ? "cursor-not-allowed" : "text-primaryBg dark:border-primaryBg dark:hover:text-white dark:hover:bg-primaryBg dark:focus:ring-primaryBg"
              } `
        }`}
        id={`${id}_yes`}
        disabled={disabled}
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => handleToggleChange(name, "no")}
        className={`w-1/2 py-2 rounded-r-3xl border-y-2 border-r-2 border-l border-primaryBg ${
          value?.toLowerCase() === "no"
            ? "bg-primaryBg text-white"
            : `text-primaryBg ${
                disabled ? "cursor-not-allowed" : "text-primaryBg dark:border-primaryBg dark:hover:text-white dark:hover:bg-primaryBg dark:focus:ring-primaryBg"
              } `
        }`}
        id={`${id}_no`}
        disabled={disabled}
      >
        No
      </button>
    </div>
  );
};

export default ToggleButtonGroup;
