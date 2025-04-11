import { MapPinned } from "lucide-react";
import {
  generateGoogleMapsLink,
  separateCapitalizedWords,
} from "../utils/common";
import Category from "./Category.Component";

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
};

type ResultContainerProps = {
  result: ResultProps;
};

const ResultContainer = ({ result }: ResultContainerProps) => {
  const lat = result?.geocodes?.main?.latitude;
  const long = result?.geocodes?.main?.longitude;

  return (
    <>
      <div className="flex flex-col p-6 my-2 border rounded-lg border-gray-100 justify-between">
        <div>
          <div className="flex flex-row justify-between items-center pb-2">
            <p className="text-xl font-bold">{result?.name}</p>
            <a
              href={generateGoogleMapsLink(lat, long)}
              target="_blank"
              className="text-sm"
            >
              <MapPinned size={16} />
            </a>
          </div>
          <p className="text-sm pb-2">{result?.location?.formatted_address}</p>
          <p className="text-sm">
            Open: {separateCapitalizedWords(result?.closed_bucket)}
          </p>
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
