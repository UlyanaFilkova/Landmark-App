import type { Place } from "@/types/interfaces";
import { convertBase64ToFiles } from "@/utils/typeConversion.ts";
import { useMapStore } from "@/stores/mapStore";

// если через конкатенацию строк - то событие onclick не срабатывает
// если создавать компоненту PopUp, то ее внедрить получится только через CreateApp
export function usePopup() {
  const createPopUp = (place: Place) => {
    const store = useMapStore();
    const photos = convertBase64ToFiles(place.photos || []);
    const firstPhotoUrl =
      photos.length > 0 ? URL.createObjectURL(photos[0]) : "";

    const handlePopupClick = (place: Place) => {
      store.setCurrentPlace(place);
    };

    const popupContent = document.createElement("div");
    popupContent.classList.add("popup-content");

    const linkElement = document.createElement("a");
    linkElement.classList.add("popup-title");
    linkElement.href = "/place";
    linkElement.target = "_blank";
    linkElement.textContent = place.title;

    linkElement.addEventListener("click", () => handlePopupClick(place));

    if (firstPhotoUrl) {
      const photoDiv = document.createElement("div");
      const img = document.createElement("img");
      img.classList.add("place-photo");
      img.src = firstPhotoUrl;
      img.onload = () => {
        photoDiv.appendChild(img);
        popupContent.appendChild(photoDiv);
      };
    }

    popupContent.appendChild(linkElement);

    return popupContent;
  };

  return {
    createPopUp,
  };
}

// import type { Place } from '@/types/interfaces'
// import router from '@/router'
// import PopUp from '@/components/map/PopUp.vue'
// import { convertBase64ToFiles } from '@/utils/typeConversion.ts'
// import { useMapStore } from '@/stores/mapStore'

// export function usePopup() {

//   const createPopUp = (place: Place) => {
//     const store = useMapStore()
//     const photos = convertBase64ToFiles(place.photos || [])
//     const firstPhotoUrl = photos.length > 0 ? URL.createObjectURL(photos[0]) : ''

//     const handlePopupClick = (place: Place) => {
//       store.setCurrentPlace(place)
//     }

//     return `
//       <div class="popup-content">
//         <a href="/place" target="_blank" class="popup-title" onclick="handlePopupClick('${JSON.stringify(place).replace(/"/g, '&quot;')}')">
//           ${place.title}
//         </a>
//         <div class="star-rating" data-rating="${place.rating}"></div>
//         ${firstPhotoUrl ? `<div><img src="${firstPhotoUrl}" class="place-photo" /></div>` : ''}
//       </div>
//     `
//   }

//   return {
//     createPopUp,
//   }
// }
