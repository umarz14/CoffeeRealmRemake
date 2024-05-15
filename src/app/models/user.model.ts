import { ShopLocation } from "./shop-location.model";

export interface User {
    uid: string,
    displayName: string,
    pfpUrl: string,
    email: string,
    created: Date,
    bio: string,
    favoriteShopsId: string[],
    blogPostsId: string[],
}