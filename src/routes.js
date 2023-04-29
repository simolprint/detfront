 

import Dashboard from "views/Dashboard.js";
import UserProfile from "views/UserProfile.js";
import TableList from "views/TableList.js";
import Typography from "views/Typography.js";
import Maps from "views/Maps.js";
import Notifications from "views/Notifications.js";
import Procedures from "views/Procedures.js";
import ProcedureRoom from "views/ProcedureRoom.js";


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
  {
    path: "/maps",
    name: "Номера и койки",
    icon: "nc-icon nc-bank",
    component: Maps,
    layout: "/admin",
    roles: ["admin"],
  },
  {
    path: "/notifications",
    name: "Процедуры и печать",
    icon: "nc-icon nc-align-left-2",
    component: Notifications,
    layout: "/admin",
    roles: ["admin"],
  },
/*   {
    path: "/icons",
    name: "Icons",
    icon: "nc-icon nc-atom",
    component: Icons,
    layout: "/admin",
    roles: ["user", "admin"],
  }, */
  {
    path: "/procedures",
    name: "Procedures",
    component: Procedures,
    layout: "/admin",
    roles: ["user", "admin"],
  },
  {
    path: "/ProcedureRoom",
    name: "ProcedureRoom",
    component: ProcedureRoom,
    layout: "/admin",
    roles: ["user", "admin"],
  },
];

export default dashboardRoutes;
