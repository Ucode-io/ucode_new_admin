import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import LockIcon from "@mui/icons-material/Lock";

const routes = [
  {
    id: "auth",
    title: "Авторизация",
    path: "/settings/auth",
    icon: LockIcon,
    children: [
      {
        id: "users",
        title: "Пользователи",
        path: "/settings/auth/users",
        isChild: true,
      },
      // {
      //   id: 'matrix',
      //   title: 'Матрица',
      //   path: `/settings/auth/matrix/${import.meta.env.VITE_AUTH_PROJECT_ID}`,
      //   isChild: true
      // },
      {
        id: "matrix_v2",
        title: "Матрица",
        path: `/settings/auth/matrix_v2`,
        isChild: true,
      },
    ],
  },
  {
    id: "constructor",
    title: "Конструктор",
    path: "/settings/constructor",
    icon: DashboardCustomizeIcon,
    slug: "app",
    children: [
      {
        id: "apps",
        title: "Приложение",
        path: `/settings/constructor/apps`,
        isChild: true,
        slug: "app",
      },
      {
        id: "microfrontend",
        title: "Микрофронтенд",
        path: `/settings/constructor/microfrontend`,
        isChild: true,
      },
    ],
  },
];

export default routes;
