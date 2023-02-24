"use client";

import { User } from "@prisma/client";
import ApproveButton from "app/(auth)/admin/users/ApproveButton";
import ApproveStudent from "app/(auth)/admin/users/ApproveStudent";
import DeleteButton from "app/(auth)/admin/users/DeleteButton";
import Button from "components/forms/inputs/Button";
import Pill from "components/Pill";
import AsyncTable from "components/table/AsyncTable";
import { useEffect, useState } from "react";

const Users = () => {
  const [studentToApprove, setStudentToApprove] = useState<User | undefined>();

  useEffect(() => {
    /* // TODO: useContext
    dispatch(
      setNavigation("Utilisateurs", {
        component: { name: "arrowLeft" },
        path: "/admin",
      })
    ); */
  });

  if (studentToApprove) {
    return (
      <ApproveStudent
        close={() => setStudentToApprove(undefined)}
        user={studentToApprove}
      />
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <AsyncTable
        columns={{
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
              field: "approvedAt",
              value: "",
            },
          },
          all: { label: "Tous les utilisateurs", filter: undefined },
        }}
        renderData={(filter, columnId, user, forceReload) => {
          switch (columnId) {
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
              if (filter === "pending" && user.student && !user.active) {
                return (
                  <Button
                    color="link"
                    onClick={() => setStudentToApprove(user)}
                  >
                    Justificatif
                  </Button>
                );
              }
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
