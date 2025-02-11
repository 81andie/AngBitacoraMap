
export interface Coordinates{
  coordinatePoint?: number[],
  coordinateLineString?: number[][],
}

/*

coordinates: [122, 123, 5334, 453]

coordinates: [ [213, 546], [213, 546] ]  <--

coordinates: {
  coordinatePoint: null,
  coordinateLineString: [ [213, 546], [213, 546] ]
}
*/
