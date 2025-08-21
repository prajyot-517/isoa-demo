type FormSectionHeaderProps = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
};

const FormSectionHeader = ({
  icon,
  title,
  subtitle = "",
}: FormSectionHeaderProps) => {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center space-x-2">
        <div>{icon}</div>
        <h1 className="text-primaryBg font-bold text-2xl">
          {title}{" "}
          {subtitle !== "" && (
            <span className="text-primaryBg text-lg">{subtitle}</span>
          )}
        </h1>
      </div>
      <div className="border border-secondaryBg"></div>
    </div>
  );
};

export default FormSectionHeader;
