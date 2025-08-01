

export default function Winner ({winner} : any){
    if (!winner) {
        return <div className="text-center mt-10 text-2xl">Match Finished! Calculating results...</div>;
    }
    return (
        <div className="text-center mt-10 p-8 bg-yellow-100 rounded-lg">
            <h1 className="text-4xl font-bold text-yellow-800">🏆 Match Finished! 🏆</h1>
            <p className="text-2xl mt-4">The winner is:</p>
            <p className="text-5xl font-bold text-yellow-900 mt-2">{winner.user.username}</p>
            <p className="text-xl mt-2">with a score of {winner.score}!</p>
        </div>
    );
}