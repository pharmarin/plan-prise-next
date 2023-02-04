"use client";

import ApproveButton from "app/admin/users/ApproveButton";
import DeleteButton from "app/admin/users/DeleteButton";
import Avatar from "components/icons/Avatar";
import Pill from "components/Pill";
import AsyncTable from "components/table/AsyncTable";
import User from "lib/redux/models/User";
import { setNavigation } from "lib/redux/navigation/actions";
import { useDispatch } from "lib/redux/store";
import { useEffect } from "react";

const Users = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setNavigation("Utilisateurs", {
        component: { name: "arrowLeft" },
        path: "/admin",
      })
    );
  });

  return (
    <div className="flex flex-col space-y-6">
      <AsyncTable
        columns={{
          avatar: "",
          lastName: "Nom",
          firstName: "Prénom",
          status: "Statut",
          rpps: "RPPS",
          signup_date: "Date d'inscription",
          actions: "",
        }}
        filters={{
          pending: {
            label: "Utilisateurs à approuver",
            filter: {
              field: "activeAt",
              value: "",
            },
          },
          all: { label: "Tous les utilisateurs", filter: undefined },
        }}
        renderData={(filter, columnId, user, forceReload) => {
          switch (columnId) {
            case "avatar":
              return (
                <Avatar
                  lastName={user.lastName || ""}
                  firstName={user.firstName || ""}
                />
              );
            case "lastName":
              return user.lastName || "";
            case "firstName":
              return user.firstName || "";
            case "status":
              return user.admin ? (
                <Pill className="bg-red-400">Admin</Pill>
              ) : (
                <Pill className="bg-green-400">
                  {user.student ? "Étudiant" : "Pharmacien"}
                </Pill>
              );
            case "rpps":
              return user.rpps?.toString() || "";
            case "signup_date":
              return new Date(user?.createdAt || "").toLocaleDateString(
                "fr-FR"
              );
            case "actions":
              return (
                <div className="flex flex-row justify-end space-x-2">
                  {filter === "pending" && (
                    <ApproveButton user={user} onSuccess={forceReload} />
                  )}
                  <DeleteButton user={user} onSuccess={forceReload} />
                </div>
              );
            default:
              return "";
          }
        }}
        searchKey="lastName"
        sortBy="createdAt"
        type={User}
      />
    </div>
  );
};

export default Users;
