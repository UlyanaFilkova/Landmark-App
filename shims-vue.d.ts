declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module '*.jpg' {
  const value: string
  export default value
}

declare module '*.jpeg' {
  const value: string
  export default value
}

declare module '*.png' {
  const value: string
  export default value
}

declare module '*.gif' {
  const value: string
  export default value
}
declare module '@/router' {
  import { Router } from 'vue-router'
  const router: Router
  export default router
}

declare module 'vue3-star-ratings' {
  import { DefineComponent } from 'vue'
  const VueStarRatings: DefineComponent<{}, {}, any>
  export default VueStarRatings
}
