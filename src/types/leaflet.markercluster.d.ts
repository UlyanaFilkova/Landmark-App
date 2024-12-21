import * as L from 'leaflet'

declare module 'leaflet' {
  function markerClusterGroup(options?: any): MarkerClusterGroup

  class MarkerClusterGroup extends FeatureGroup {
    constructor(options?: any)
    addLayer(layer: Layer): this
    clearLayers(): this
  }
}
