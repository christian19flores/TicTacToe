import withAuth from "../hoc/withAuth";

interface CreateGameProps {

}

function CreateGame({ }: CreateGameProps) {

    return (
        <div>
            <label className="input input-bordered flex items-center gap-2">
                <input type="text" className="grow" placeholder="Search" />
                <kbd className="kbd kbd-sm">⌘</kbd>
                <kbd className="kbd kbd-sm">K</kbd>
            </label>
        </div>
    );
};

export default withAuth(CreateGame);