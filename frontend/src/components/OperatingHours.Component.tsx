import { intToWeekday, separateCapitalizedWords } from "../utils/common";
import { ResultProps } from "./ResultContainer.Component";

type ResultData = {
  result: ResultProps;
};

const OperatingHours = ({ result }: ResultData) => {
  const isOpen =
    result.hours?.open_now || separateCapitalizedWords(result?.closed_bucket);
  const regularHours = result.hours?.regular || [];

  return (
    <div>
      <p>
        <span className="font-semibold">Open now: </span>
        {isOpen}
      </p>

      {regularHours.length > 0 && (
        <div className="py-2">
          <p className="font-semibold">Store Hours</p>
          <div>
            {regularHours?.map((hour) => (
              <div key={hour.day}>
                <p>{`${intToWeekday(hour.day)} ${hour.open}-${hour.close}`}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OperatingHours;
