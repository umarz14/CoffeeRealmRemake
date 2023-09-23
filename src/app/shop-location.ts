// export interface ShopLocation {
//     placeId: string,
//     name: string,
//     // location: string,
//     latitude: number,
//     longitude: number,
//     photo: string,
//     phone_number: string,
//     address: string,
//     website: string,
//     rating: number,
//     times_open: string,


// }
export interface ShopLocation {
    name: string,
    placeId: string,
    address: string,
    location: google.maps.LatLngLiteral,
    imageUrl: string,
    iconUrl: string,
    phone_number: string,
    website: string,
}
