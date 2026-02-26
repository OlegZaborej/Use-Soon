import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../pages/LoginPage.vue';
import RegisterPage from '../pages/RegisterPage.vue';
import HomePage from '../pages/HomePage.vue';
import InventoryListPage from '../pages/InventoryListPage.vue';
import AddItemPage from '../pages/AddItemPage.vue';
import EditItemPage from '../pages/EditItemPage.vue';
import ItemDetailsPage from '../pages/ItemDetailsPage.vue';
import NotificationsPage from '../pages/NotificationsPage.vue';
import StatsPage from '../pages/StatsPage.vue';
import SettingsPage from '../pages/SettingsPage.vue';
import OnboardingPage from '../pages/OnboardingPage.vue';

const routes = [
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/onboarding', component: OnboardingPage },
  { path: '/', component: HomePage, meta: { auth: true } },
  { path: '/inventory', component: InventoryListPage, meta: { auth: true } },
  { path: '/items/new', component: AddItemPage, meta: { auth: true } },
  { path: '/items/:id/edit', component: EditItemPage, meta: { auth: true } },
  { path: '/items/:id', component: ItemDetailsPage, meta: { auth: true } },
  { path: '/notifications', component: NotificationsPage, meta: { auth: true } },
  { path: '/stats', component: StatsPage, meta: { auth: true } },
  { path: '/settings', component: SettingsPage, meta: { auth: true } },
];

const router = createRouter({ history: createWebHistory(), routes });
router.beforeEach((to) => {
  const token = localStorage.getItem('token');
  if (to.meta.auth && !token) return '/login';
});
export default router;
