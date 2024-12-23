import { createApp } from 'vue'
import { Place } from '@/types/interfaces'
import router from '@/router'
import PopUp from '@/components/map/PopUp.vue'

export function usePopup() {

  const createPopUp = (place: Place) => {
    const popupContainer = document.createElement('div')

    const app = createApp(PopUp, { place })
    app.use(router)
    app.mount(popupContainer)
    return popupContainer
  }

  return {
    createPopUp,
  }
}
