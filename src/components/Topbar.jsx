const Topbar = ({ hidden }) => {
  return (
    <div
      className={`fixed left-0 top-0 z-50 flex h-10 w-full items-center justify-center bg-black px-4 text-center text-[11px] font-medium leading-tight text-white transition-all duration-300 sm:text-xs md:text-sm ${
        hidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}>
      BUY FOR RS.2499 & MORE, GET FLAT RS.100 OFF | USE CODE: SALE100
    </div>
  );
};

export default Topbar;
