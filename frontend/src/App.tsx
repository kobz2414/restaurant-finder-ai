import axios from "axios";
import { Loader, Search } from "lucide-react";
import { useState } from "react";

function App() {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("http://localhost:8000/api/execute", {
        message: search,
      });

      console.log(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="flex flex-col max-w-3xl items-center py-20">
          <p className="md:text-5xl text-2xl font-semibold">
            Next Gen Restaurant Finder
          </p>
          <p className="px-16 text-sm pt-2 text-center">
            A simple restaurant finder powered by bleeding edge AI tech
          </p>
          <div className="w-full max-w-md mt-8 md:px-0 px-8">
            <div className="flex flex-col">
              <textarea
                placeholder="Search for restaurants..."
                className="w-full px-6 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent resize-none"
                rows={6}
                onChange={(e) => setSearch(e.target.value)}
              />
                <button
                className={`flex items-center justify-center mt-4 py-3 rounded-md w-full text-sm ${
                  !search ? 'bg-gray-300' : 'bg-black hover:cursor-pointer'
                } text-white`}
                onClick={handleSearch}
                disabled={!search}
                >
                {isLoading ? <><Loader>Sample</Loader></> : <><Search className="pe-2" /> Search</>}
                
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
