declare module '@morpheme/rating' {
  import { DefineComponent, PropType } from 'vue'

  export const Rating: DefineComponent<{
    rating: PropType<number>
    readonly: PropType<boolean>
  }>

  export default Rating
}
