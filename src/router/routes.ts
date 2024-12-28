import LoginView from '@/views/LoginView.vue'
import RegistrationView from '@/views/RegistrationView.vue'
import GeneralMapView from '@/views/GeneralMapView.vue'
import AddPlaceView from '@/views/AddPlaceView.vue'
import PlaceView from '@/views/PlaceView.vue'

export const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/registration',
    name: 'registration',
    component: RegistrationView,
  },
  {
    path: '/general-map',
    name: 'generalMap',
    component: GeneralMapView,
    meta: { requiresAuth: true },
  },
  {
    path: '/add-place',
    name: 'AddPlace',
    component: AddPlaceView,
    meta: { requiresAuth: true },
  },
  {
    path: '/place/:id',
    name: 'place',
    component: PlaceView,
    meta: { requiresAuth: true },
  },
]
