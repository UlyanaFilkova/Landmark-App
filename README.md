# Landmark App

## Task

[https://docs.google.com/document/d/1nCHuBjLxwJvzXHCDFUMZMPh5VyTI4bJj0waSy1RntHk/edit?usp=sharing](https://docs.google.com/document/d/1nCHuBjLxwJvzXHCDFUMZMPh5VyTI4bJj0waSy1RntHk/edit?usp=sharing)

## How to Run the App

```bash
git https://github.com/UlyanaFilkova/Landmark-App.git
npm install
npm run dev
```

## Database snapshot

```
users
  │── username
  │── password
  │── role


places
  │── title
  │── description
  │── location
  │── photos
  │── rating
  │── voices
  │── authorId


ratings
  │── rating
  │── userId
  │── placeId
```

## Application stack

**Frontend Framework**: Vue.js + TypeScript

**Routing**: Vue Router

**State Management**: Pinia

**Form Validation**: Vuelidate

**Database**: Firebase

**Build Tool**: Vite

**Linting and Formatting**: ESLint, Prettier

**Mapping**: Leaflet

**Lightbox**: Vue Easy Lightbox

**Rating Component**: Morpheme Rating

**Virtual Scrolling**: Vue Virtual Scroller
