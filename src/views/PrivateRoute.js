import React from "react";
import { Route, Redirect } from "react-router-dom";
import AuthService from "../AuthService";

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) {
          // Если пользователь не авторизован, перенаправляем на страницу входа
          return (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          );
        }

        // Проверяем, есть ли у пользователя нужная роль для доступа к странице
        if (roles && !roles.includes(currentUser.role)) {
          // Если у пользователя нет нужной роли, перенаправляем на страницу главной страницы
          return (
            <Redirect to={{ pathname: "/", state: { from: props.location } }} />
          );
        }

        // Если у пользователя есть нужная роль или роли не указаны, показываем страницу
        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
