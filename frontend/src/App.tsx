import axios, { AxiosError } from "axios";
import { Frown, Loader, Search } from "lucide-react";
import { useState } from "react";
import Results from "./components/Results.Component";
import { ResultProps } from "./components/ResultContainer.Component";
import { extractNextLinkHeader } from "./utils/common";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<ResultProps[]>([]);
  const [nextPage, setNextPage] = useState<string | null>("");
  const [error, setError] = useState<Record<string, string>>({});

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const [isUserSearching, setIsUserSearching] = useState(false);

  const handleSearch = async () => {
    try {
      setIsUserSearching(false);
      setIsLoading(true);
      setResults([]);
      setError({});
      setNextPage("");

      const response = await axios.post(`${apiUrl}/api/execute`, {
        message: search,
      });

      const { data, next_page } = response.data;

      setResults(data?.results || []);
      setNextPage(extractNextLinkHeader(next_page));
    } catch (error) {
      const err = error as AxiosError<{ detail: string }>;
      console.error(err);

      setError({
        fetch:
          err?.response?.data?.detail || "Something went wrong while searching",
      });
    } finally {
      setIsLoading(false);
      setIsUserSearching(true);
    }
  };

  const handlePageChange = async () => {
    try {
      setIsLoadingNextPage(true);
      setError({});

      const response = await axios.post(`${apiUrl}/api/fetch-page`, {
        link: nextPage,
      });

      const { data, next_page } = response.data;

      if (data?.results.length > 0) {
        setResults((prevResults) => [...prevResults, ...data.results]);
      }

      setNextPage(extractNextLinkHeader(next_page));
    } catch (error) {
      const err = error as AxiosError<{ detail: string }>;
      console.error(err);

      setError({
        nextPage:
          err?.response?.data?.detail ||
          "Something went wrong while fetching the next page",
      });
    } finally {
      setIsLoadingNextPage(false);
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="flex flex-col max-w-3xl items-center py-20">
          <p className="sm:text-5xl text-3xl text-center font-bold">
            Find What Feeds You
          </p>
          <p className="px-16 text-sm pt-2 text-center">
            A smart restaurant finder — and maybe more 👀
          </p>
          <div className="w-full max-w-lg mt-8 md:px-0 px-8">
            <div className="flex flex-col">
              <textarea
                placeholder="Search for restaurants..."
                className={`w-full px-6 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent resize-none ${
                  isLoading && "bg-gray-300"
                }`}
                rows={6}
                onChange={(e) => setSearch(e.target.value)}
                disabled={isLoading}
              />
              <button
                className={`flex items-center justify-center mt-4 py-3 rounded-md w-full text-sm ${
                  !search || isLoading
                    ? "bg-gray-300"
                    : "bg-black hover:cursor-pointer"
                } text-white`}
                onClick={handleSearch}
                disabled={!search || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader size={16} className="me-2" /> Searching
                  </>
                ) : (
                  <>
                    <Search className="pe-2" /> Search
                  </>
                )}
              </button>
            </div>

            {!isLoading && isUserSearching && (
              <>
                {results.length > 0 ? (
                  <Results results={results} />
                ) : (
                  <div className="flex flex-col items-center mt-12">
                    <div className="flex flex-row items-center">
                      <Frown size={18} strokeWidth={2.5} className="me-2" />
                      <p className="font-semibold text-xl">No Results</p>
                    </div>
                    {error?.fetch && (
                      <p className="text-sm text-center pt-4">{error?.fetch}</p>
                    )}
                  </div>
                )}
              </>
            )}

            <div className="flex flex-row items-center justify-center mt-8">
              {isLoadingNextPage ? (
                <>
                  <Loader size={16} className="me-2" /> Loading
                </>
              ) : (
                <div className="flex flex-col items-center">
                  {nextPage && (
                    <button
                      onClick={handlePageChange}
                      className="py-2 px-6 bg-black text-white rounded-full hover:cursor-pointer"
                    >
                      {" "}
                      Load Next Page
                    </button>
                  )}

                  {error?.nextPage && (
                    <p className="text-sm text-center pt-4">
                      {error?.nextPage}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
