interface ToggleButtonProps {
  handleToggleChange: any;
  name: string;
  value: string;
  id?: string;
  disabled?: boolean;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  handleToggleChange,
  name,
  value,
  id = "",
  disabled = false,
}) => {
  const OPT_KEY = "opt";
  const FTS_KEY = "fts";
  return (
    <div className="flex justify-center font-bold items-center bg-white rounded-full">
      <button
        type="button"
        onClick={() => handleToggleChange(name, OPT_KEY)}
        className={`w-1/2 py-2 rounded-l-3xl border-y-2 border-l-2 border-r border-primaryBg ${
          value === OPT_KEY
            ? "bg-primaryBg text-white border-0"
            : `text-primaryBg ${
                disabled
                  ? "cursor-not-allowed"
                  : "text-primaryBg dark:border-primaryBg dark:hover:text-white dark:hover:bg-primaryBg dark:focus:ring-primaryBg"
              } `
        }`}
        id={`${id}_opt`}
        disabled={disabled}
      >
        I'm on OPT
      </button>
      <button
        type="button"
        onClick={() => handleToggleChange(name, FTS_KEY)}
        className={`w-1/2 py-2 rounded-r-3xl border-y-2 border-r-2 border-l border-primaryBg ${
          value === FTS_KEY
            ? "bg-primaryBg text-white"
            : `text-primaryBg ${
                disabled
                  ? "cursor-not-allowed"
                  : "text-primaryBg dark:border-primaryBg dark:hover:text-white dark:hover:bg-primaryBg dark:focus:ring-primaryBg"
              } `
        }`}
        id={`${id}_fts`}
        disabled={disabled}
      >
        I'm a FTS
      </button>
    </div>
  );
};

export default ToggleButton;
