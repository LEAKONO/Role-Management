import { lazy } from 'react';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tickets = lazy(() => import('./pages/Tickets'));
const Users = lazy(() => import('./pages/Users'));

export const routes = [
  {
    path: '/login',
    component: Login,
    exact: true,
    isPublic: true
  },
  {
    path: '/register',
    component: Register,
    exact: true,
    isPublic: true
  },
  {
    path: '/',
    component: Dashboard,
    exact: true,
    isPrivate: true
  },
  {
    path: '/tickets',
    component: Tickets,
    exact: true,
    isPrivate: true
  },
  {
    path: '/admin/users',
    component: Users,
    exact: true,
    isPrivate: true,
    roles: ['admin']
  }
];