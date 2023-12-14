"use client";

const RPPSField = ({ rpps }: { rpps: string }) => {
  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        navigator.clipboard.writeText(rpps);
        window.open("https://annuaire.sante.fr");
      }}
    >
      {rpps}
    </div>
  );
};

export default RPPSField;
