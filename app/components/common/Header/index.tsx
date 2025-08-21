import isoa_logo from "app/assets/icon/isoa_logo.png";

const Header = () => {
  return (
    <header className="w-full h-24 px-0 py-4 m-0 flex items-center leading-normal text-black bg-brown-blue-gradient shadow-xl border border-b-1">
      <div className="mx-auto max-w-[1536px] px-5 sm:px-10 flex justify-between items-center w-full md:px-28 3xl:px-40">
        <div className="flex items-center">
          <a
            href="https://www.isoa.org"
            target="_blank" rel="noreferrer"
          >
            <img
              src={isoa_logo}
              alt="Logo"
              className="w-[95px] h-[44px] md:w-[250px] md:h-[50px]"
            />
          </a>
        </div>
        {/* <div className="text-right">
          <div className="text-xs sm:text-sm font-normal text-primaryBg">Need help?</div>
          <div className="text-xl font-semibold sm:text-2xl text-primaryBg">
            Call (800) 244-1180
          </div>
          <div className="text-xs sm:text-sm font-normal text-primaryBg">
            Monday to Friday, 9am-5pm
          </div>
        </div> */}
      </div>
    </header>
  );
};

export default Header;
