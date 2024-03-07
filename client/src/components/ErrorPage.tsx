import { useMemo } from "react";
import { useLocation } from "react-router-dom";

interface ErrorPageProps {

}

function useQuery() {
    const { search } = useLocation();
  
    return useMemo(() => new URLSearchParams(search), [search]);
  }

export default function ErrorPage({ }: ErrorPageProps) {
    // get query params
    const query = useQuery();


    return (
        <div>
            <main className="grid min-h-full place-items-center bg-base-100 px-6 py-24 sm:py-32 lg:px-8">
                <div className="text-center">
                    <p className="text-base font-semibold text-primary">{ query.get('error') ? '400' : '404' }</p>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-content sm:text-5xl">An Error Has Occurred</h1>
                    <p className="mt-6 text-base leading-7 text-base-content">
                        {query.get('error') || 'The page you are looking for does not exist.'}
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <a
                            href="/"
                            className="btn btn-secondary"
                        >
                            Go back home
                        </a>
                        <a href="/" className="text-sm font-semibold text-base-content">
                            Contact support <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
};
