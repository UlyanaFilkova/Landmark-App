import LoginView from '@/views/LoginView.vue'
import RegistrationView from '@/views/RegistrationView.vue'
import GeneralMapView from '@/views/GeneralMapView.vue'
import AddPlaceView from '@/views/AddPlaceView.vue'
import PlaceView from '@/views/PlaceView.vue'
import EditPlaceView from '@/views/EditPlaceView.vue'

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
    name: 'addPlace',
    component: AddPlaceView,
    meta: { requiresAuth: true },
  },
  {
    path: '/edit/:id',
    name: 'edit',
    component: EditPlaceView,
    meta: { requiresAuth: true },
  },
  {
    path: '/place/:id',
    name: 'place',
    component: PlaceView,
    meta: { requiresAuth: true },
  },
]
