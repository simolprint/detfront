import Dashboard from "views/Dashboard.js";
import UserProfile from "views/UserProfile.js";
import TableList from "views/TableList.js";
import Typography from "views/Typography.js";
import Icons from "views/Icons.js";
import Maps from "views/Maps.js";
import Notifications from "views/Notifications.js";
import Upgrade from "views/Upgrade.js";
import Procedures from "views/Procedures.js";
import ProcedureRoom from "views/ProcedureRoom.js";
import Login from "views/Login.js";
import PrivateRoute from "components/PrivateRoute.js";
import Logout from "views/Logout.js";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Главная",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin",
    roles: ["user", "admin"],
  },
  {
    path: "/user",
    name: "Добавить пациента",
    icon: "nc-icon nc-circle-09",
    component: UserProfile,
    layout: "/admin",
    roles: ["admin"],
  },
  {
    path: "/table",
    name: "Список пациентов",
    icon: "nc-icon nc-notes",
    component: TableList,
    layout: "/admin",
    roles: ["user", "admin"],
  },
  {
    path: "/typography",
    name: "Номера",
    icon: "nc-icon nc-paper-2",
    component: Typography,
    layout: "/admin",
    roles: ["user", "admin"],
  },

];

export default dashboardRoutes;
