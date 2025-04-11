import ResultContainer, { ResultProps } from "./ResultContainer.Component"

export type ResultsProps = {
  results: ResultProps[];
}

const Results = ({ results }: ResultsProps) => {
  return (
    <>
      <div className="font-bold pt-10 pb-2 text-lg">Search Results</div>
      <div className="grid md:grid-cols-2 gap-4">
        {results.map((result: ResultProps) => (
          <ResultContainer key={result.fsq_id} result={result} />
        ))}
      </div>
    </>
  );
};

export default Results;
