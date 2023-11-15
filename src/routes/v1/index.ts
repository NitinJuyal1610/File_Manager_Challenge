import express from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import folderRoute from './folder.route';
import fileRoute from './file.route';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute
  },
  {
    path: '/users',
    route: userRoute
  },
  {
    path: '/folders',
    route: folderRoute
  },
  {
    path: '/files',
    route: fileRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
