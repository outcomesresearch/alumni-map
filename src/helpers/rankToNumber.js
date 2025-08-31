import { RANKS } from "../assets/javascript/constants";

export function rankToNumber(rank) {
    const asArray = Object.values(RANKS);
    return asArray.indexOf(rank);
}
