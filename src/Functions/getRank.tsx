export default function getRank(XP : number | null ) : string{
    if(XP === null)return "";
    if (XP >= 6000) return "Legend";
    if (XP >= 3400) return "Diamond";
    if (XP >= 2000) return "Platinum";
    if (XP >= 1200) return "Gold";
    if (XP >= 800) return "Silver";
    return "Bronze";
}