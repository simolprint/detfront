/* import React from "react";
import { Route, Redirect } from "react-router-dom";
import AuthService from "../AuthService";

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) {
          // если пользователь не авторизован, перенаправляем его на страницу входа
          return (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          );
        }

        // проверяем, есть ли у пользователя необходимая роль
        if (roles && !roles.includes(currentUser.role)) {
          // если у пользователя нет необходимой роли, перенаправляем его на страницу 403 Forbidden
          return <Redirect to={{ pathname: "/403" }} />;
        }

        // если пользователь авторизован и у него есть необходимая роль, возвращаем компонент
        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
 */