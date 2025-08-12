export default function getRank(XP : number | null ) : string{
    if(XP === null)return "";
    if (XP >= 6500) return "Legend";
    if (XP >= 4000) return "Diamond";
    if (XP >= 2500) return "Platinum";
    if (XP >= 1500) return "Gold";
    if (XP >= 1000) return "Silver";
    return "Bronze";
}