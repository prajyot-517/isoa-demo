import SystemMaintenaceIcon from "~/assets/SVGIcons/SystemMaintenaceIcon";

const SystemMaintenace = () => {
  return (
    <div className="flex py-28 px-6 justify-center my-3  text-primaryBg">
      <div className="flex flex-col space-y-10 md:space-y-14 items-center">
        <div>
          <SystemMaintenaceIcon />
        </div>

        <div className="flex flex-col items-center space-y-4 md:space-y-8 w-full">
          <h1 className="font-black text-center text-[1.625rem] md:text-4xl">
            We'll be right back
          </h1>
          <p className="font-bold text-center md:text-lg">
            Our system is currently under maintenance.
            <br />
            we'll be up and running soon.
            <br /> <br />
            Please try again later. If you have any questions, give us a call on
            <br />
            <span className="cursor-pointer text-secondary">
              {" "}
              1300 555 123
            </span>{" "}
            (Mon-Fri 9am-5pm) and we’ll get you sorted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemMaintenace;
