import { logoutUserAction } from "lib/redux/auth/actions";
import { selectUser } from "lib/redux/auth/selectors";
import { useDispatch } from "lib/redux/store";
import Link from "next/link";
import { useSelector } from "react-redux";

const Navbar = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  return (
    <div className="py-2">
      <div className="container mx-auto flex justify-between rounded-lg bg-white p-4">
        <Link
          className="flex flex-row overflow-hidden rounded-full font-bold shadow-lg"
          href="/"
        >
          <div className="bg-white py-1 pl-2 pr-0.5 text-gray-900">Plan de</div>
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 py-1 pr-2 pl-0.5 text-white">
            prise
          </div>
        </Link>
        <div>
          {user?.display_name}
          <button onClick={() => dispatch(logoutUserAction())}>
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
