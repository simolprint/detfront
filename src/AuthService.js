import jwt_decode from "jwt-decode";

const users = [
  { username: "admin", password: "12345", role: "admin" },
  { username: "user", password: "54321", role: "user" },
];

class AuthService {
  login(username, password) {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (!user) {
      return Promise.reject(new Error("Invalid username or password"));
    }

    // Сохраняем токен аутентификации в localStorage
    localStorage.setItem("authToken", "fakeAuthToken");
    localStorage.setItem("currentUser", JSON.stringify(user));

    // Возвращаем объект пользователя
    return Promise.resolve(user);
  }

  logout() {
    // Удаляем токен аутентификации из localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
  }

  isAuthenticated() {
    // Проверяем, есть ли токен аутентификации в localStorage
    return !!localStorage.getItem("authToken");
  }

  getAccessToken() {
    // Возвращаем токен аутентификации из localStorage
    return localStorage.getItem("authToken");
  }

  // Метод для получения информации о текущем пользователе
  getCurrentUser() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      return Promise.resolve(user);
    } else {
      return Promise.reject(new Error("User not authenticated"));
    }
  }

  // Метод для получения роли текущего пользователя
  getCurrentUserRole() {
    const token = this.getAccessToken();
    const decodedToken = jwt_decode(token);
    return decodedToken.role;
  }
}

export default new AuthService();
