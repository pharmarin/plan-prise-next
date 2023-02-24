const Home = () => {
  //useSetTitle("Bienvenue");

  return (
    <div className="flex h-[80vh] flex-col justify-center">
      <h1 className="mb-4 text-center text-xl font-bold">
        Que souhaitez-vous créer ?
      </h1>
      <div className="flex w-full flex-row justify-center text-center">
        <a
          className="m-4 h-48 flex-1 overflow-hidden rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-xl hover:bg-opacity-90"
          href={process.env.NEXT_PUBLIC_APP_URL + "/plan"}
        >
          <div className="flex h-full w-full cursor-pointer items-center justify-center font-bold text-white hover:bg-white hover:bg-opacity-10">
            <span>Plan de prise</span>
          </div>
        </a>
        <a
          className="m-4 h-48 flex-1 overflow-hidden rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-xl hover:bg-opacity-90"
          href={process.env.NEXT_PUBLIC_APP_URL + "/calendrier"}
        >
          <div className="flex h-full w-full cursor-pointer items-center justify-center font-bold text-white hover:bg-white hover:bg-opacity-10">
            <span>Calendrier de prise</span>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
