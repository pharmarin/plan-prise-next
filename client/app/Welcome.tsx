import LoginForm from "app/LoginForm";
import RegisterForm from "app/RegisterForm";
import Button from "components/forms/inputs/Button";
import { useState } from "react";

const Welcome = () => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="flex min-h-screen items-center p-4">
      <div className="container mx-auto flex flex-col-reverse overflow-hidden rounded-lg bg-white sm:flex-row">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-8 text-white sm:w-1/2">
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
        <div className="flex flex-col items-center justify-center bg-white sm:w-1/2">
          {showRegister ? (
            <RegisterForm className="my-8 flex w-full flex-col px-4 md:w-2/3" />
          ) : (
            <LoginForm className="my-8 flex w-full flex-col px-4 md:w-2/3" />
          )}
          <Button
            className="mb-4"
            color="link"
            onClick={() => setShowRegister(!showRegister)}
          >
            {showRegister
              ? "J'ai déjà un compte : Se connecter"
              : "Je n'ai pas de compte : S'inscrire"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
