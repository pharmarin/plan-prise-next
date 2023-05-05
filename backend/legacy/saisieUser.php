<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Ajout d'un utilisateur</title>
        <link rel="stylesheet" href="css/bootstrap.min.css">
    </head>
    <body>
        <form action="ajoutUser.php" method="POST">
            <table class="table table-bordered table-striped">
                <caption>Saisie d'un nouvel utilisateur</caption>
                <thead>
                    <tr>
                        <th>Administrateur</th>
                        <th>Nom d'utilisateur</th>
                        <th>Mot de passe</th>
                        <th colspan="2">Nom Complet</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="text-align:center;">
                            <select name="admin">
                                <option value="0">Non</option>
                                <option value="1">Oui</option>
                            </select>
                        </td>
                        <td>
                            <input type="text" name="login" maxlength="20">
                        </td>
                        <td>
                            <input type="text" name="password" maxlength="100">
                        </td>
                        <td>
                            <input type="text" name="fullname" maxlength="100">
                        </td>
                        <td>
                            <input type="submit" value="Ajouter">
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="10"></td>
                    </tr>
                </tfoot>
            </table>
        </form>
        <p><a href="index.php">Retour</a></p>
    </body>
</html>