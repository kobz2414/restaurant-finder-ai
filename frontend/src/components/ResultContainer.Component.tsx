import { MapPinned } from "lucide-react";
import {
  generateGoogleMapsLink,
} from "../utils/common";
import Category from "./Category.Component";
import Rating from "./Rating.Component";
import OperatingHours from "./OperatingHours.Component";

type Category = {
  id: number;
  name: string;
  short_name: string;
  plural_name: string;
  icon: {
    prefix: string;
    suffix: string;
  };
};

export type Hours = {
  open_now: boolean;
  display: boolean;
  is_local_holiday: boolean;
  regular?: {
    open: string;
    close: string;
    day: number;
  }[];
};

export type ResultProps = {
  fsq_id: string;
  categories: Category[];
  chains: [];
  closed_bucket: string;
  distance: number;
  geocodes: {
    main: {
      latitude: number;
      longitude: number;
    };
    roof?: {
      latitude: number;
      longitude: number;
    };
    drop_off?: {
      latitude: number;
      longitude: number;
    };
  };
  link: string;
  location: {
    address?: string;
    address_extended?: string;
    country?: string;
    cross_street?: string;
    formatted_address: string;
    locality?: string;
    region?: string;
    postcode?: string;
  };
  name: string;
  related_places: {
    parent?: {
      fsq_id: string;
      categories: Category[];
      name: string;
    };
  };
  timezone: string;
  rating?: number;
  price?: string;
  hours?: Hours;
};

type ResultContainerProps = {
  result: ResultProps;
};

const ResultContainer = ({ result }: ResultContainerProps) => {
  const lat = result?.geocodes?.main?.latitude;
  const long = result?.geocodes?.main?.longitude;
  const price = result?.price;
  const rating = result?.rating || 0;

  return (
    <>
      <div className="flex flex-col p-6 my-2 border rounded-lg border-gray-100 justify-between">
        <div>
          <div>
            <div className="flex flex-row justify-between items-center pb-1">
              <p className="text-xl font-bold">{result?.name}</p>
              <a
                href={generateGoogleMapsLink(lat, long)}
                target="_blank"
                className="text-sm"
              >
                <MapPinned size={16} />
              </a>
            </div>
            {rating > 0 && <Rating rating={rating!} />}
          </div>

          <p className="text-sm pt-4 pb-2">
            {result?.location?.formatted_address}
          </p>
          <div className="text-sm">
            {price && <p>Price: {price}</p>}
            <OperatingHours result={result}/>
          </div>
        </div>

        <div className="flex flex-row flex-wrap gap-2 pt-4">
          {result?.categories.map((category, index) => (
            <Category key={index} category={category?.name} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ResultContainer;
