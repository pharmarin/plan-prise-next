import LoginForm from "components/forms/LoginForm";

const Welcome = () => {
  return (
    <div className="flex h-screen items-center">
      <div className="container mx-auto flex flex-row overflow-hidden rounded-lg bg-white">
        <div className="w-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 p-8 text-white">
          <h1 className="mb-4 text-2xl font-bold">
            Bienvenue sur plandeprise.fr
          </h1>
          <p>
            Ce site a pour but de faciliter la réalisation de plans de prise à
            l&apos;officine. Passez moins de temps à préparer des plans de prise
            et plus de temps avec votre patient. Nous vous permettons ainsi de
            créer des plans de prise personnalisés, rapidement, et sans efforts.
          </p>
          <p>
            Grâce à des commentaires pré-remplis, la réalisation de plans de
            prise devient plus rapide avec plandeprise.fr. Et tout cela
            gratuitement !
          </p>
          <p>
            Ce site est le fruit du travail de thèse de Marion BELACHE et Marin
            ROUX, sous la direction de Béatrice BELLET (maître de conférence
            associé en pharmacie clinique à l&apos;UFR de pharmacie de
            Grenoble).
          </p>
        </div>
        <div className="flex w-1/2 flex-col items-center justify-center bg-white">
          <LoginForm className="flex w-1/2 flex-col" />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
