
interface win  {
    matches : number,
    wins : number
}
function WinPercentage({matches , wins} : win) {
  const win = Math.ceil((wins/matches) * 100 )
  return win;
}

export default WinPercentage