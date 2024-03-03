import withAuth from "../hoc/withAuth";
import { Clipboard } from "lucide-react";

interface GameBoardProps {

}

function GameBoard({ }: GameBoardProps) {
    return (
        <div className="container mx-auto flex items-center justify-center">
            <div className="mt-5 max-w-sm flex items-stretch">
                <span className="bg-neutral -mr-2 z-10 flex items-center p-3 rounded-l-lg">
                    Room Link
                </span>

                <input type="text" className="pl-5 bg-base-200 pr-5 text-right border-none ring-0 outline-none" value="http://localhost:3000/room/1234" />

                <button className="btn btn-neutral rounded-l-none border-none">
                    <Clipboard size={24} />
                </button>
            </div>

        </div>
    );
};

export default withAuth(GameBoard);