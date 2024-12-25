declare module 'vue-star-rating' {
    import { DefineComponent, PropType } from 'vue';
  
    const StarRating: DefineComponent<{
      value: PropType<number>;
      readonly: PropType<boolean>;
      starSize: PropType<number>;
      iconSize: PropType<number>;
      showRating: PropType<boolean>;
    }>;
  
    export default StarRating;
  }
  