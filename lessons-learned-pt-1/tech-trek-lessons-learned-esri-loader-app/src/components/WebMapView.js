import React from 'react';
import { loadModules } from 'esri-loader';

export class WebMapView extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef(); 
  }

  componentDidMount() {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/layers/FeatureLayer',
      'esri/renderers/DotDensityRenderer',
      'esri/widgets/Legend',
      'esri/widgets/Bookmarks',
      'esri/widgets/Expand'
      ], { css: 'https://js.arcgis.com/4.14/esri/themes/dark/main.css' })
      .then(([
        ArcGISMap, 
        MapView,
        FeatureLayer,
        DotDensityRenderer,
        Legend,
        Bookmarks,
        Expand
      ]) => {
        const map = new ArcGISMap({
          basemap: 'dark-gray'
        });
  
        this.view = new MapView({
          container: this.mapRef.current,
          map: map,
          center: [-79, 42],
          highlightOptions: {
            fillOpacity: 0,
            color: [50, 50, 50]
          },
          popup: {
            dockEnabled: true,
            dockOptions: {
              position: "top-right",
              breakpoint: false
            }
          },
          zoom: 6
        });
        
        this.view.when().then(function() {
          const dotDensityRenderer = new DotDensityRenderer({
            dotValue: 100,
            outline: null,
            referenceScale: 577790, // 1:577,790 view scale
            legendOptions: {
              unit: "people"
            },
            attributes: [
              {
                field: "B03002_003E",
                color: "#f23c3f",
                label: "White (non-Hispanic)"
              },
              {
                field: "B03002_012E",
                color: "#e8ca0d",
                label: "Hispanic"
              },
              {
                field: "B03002_004E",
                color: "#00b6f1",
                label: "Black or African American"
              },
              {
                field: "B03002_006E",
                color: "#32ef94",
                label: "Asian"
              },
              {
                field: "B03002_005E",
                color: "#ff7fe9",
                label: "American Indian/Alaskan Native"
              },
              {
                field: "B03002_007E",
                color: "#e2c4a5",
                label: "Pacific Islander/Hawaiian Native"
              },
              {
                field: "B03002_008E",
                color: "#ff6a00",
                label: "Other race"
              },
              {
                field: "B03002_009E",
                color: "#96f7ef",
                label: "Two or more races"
              }
            ]
          });

          // Add renderer to the layer and define a popup template
          const url =
            "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Population_by_Race_and_Hispanic_Origin_Boundaries/FeatureServer/2";
          const layer = new FeatureLayer({
            url: url,
            minScale: 20000000,
            maxScale: 35000,
            title: "Current Population Estimates (ACS)",
            popupTemplate: {
              title: "{County}, {State}",
              content: [
                {
                  type: "fields",
                  fieldInfos: [
                    {
                      fieldName: "B03002_003E",
                      label: "White (non-Hispanic)",
                      format: {
                        digitSeparator: true,
                        places: 0
                      }
                    },
                    {
                      fieldName: "B03002_012E",
                      label: "Hispanic",
                      format: {
                        digitSeparator: true,
                        places: 0
                      }
                    },
                    {
                      fieldName: "B03002_004E",
                      label: "Black or African American",
                      format: {
                        digitSeparator: true,
                        places: 0
                      }
                    },
                    {
                      fieldName: "B03002_006E",
                      label: "Asian",
                      format: {
                        digitSeparator: true,
                        places: 0
                      }
                    },
                    {
                      fieldName: "B03002_005E",
                      label: "American Indian/Alaskan Native",
                      format: {
                        digitSeparator: true,
                        places: 0
                      }
                    },
                    {
                      fieldName: "B03002_007E",
                      label: "Pacific Islander/Hawaiian Native",
                      format: {
                        digitSeparator: true,
                        places: 0
                      }
                    },
                    {
                      fieldName: "B03002_008E",
                      label: "Other race",
                      format: {
                        digitSeparator: true,
                        places: 0
                      }
                    },
                    {
                      fieldName: "B03002_009E",
                      label: "Two or more races",
                      format: {
                        digitSeparator: true,
                        places: 0
                      }
                    }
                  ]
                }
              ]
            },
            renderer: dotDensityRenderer
          });

          map.add(layer);

          this.view.ui.add(
            [
              new Expand({
                view: this.view,
                content: new Legend({ view: this.view }),
                group: "top-left",
                expanded: true
              }),
              new Expand({
                view: this.view,
                content: new Bookmarks({ view: this.view }),
                group: "top-left"
              })
            ],
            "top-left"
          );
  
      });
    });
  }

  componentWillUnmount() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
  }

  render() {
    return (
      <div className="webmap" ref={this.mapRef}/>
    );
  }
}