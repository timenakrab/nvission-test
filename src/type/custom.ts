import { Params } from 'next/dist/next-server/server/router';

export type ButtonType = 'button' | 'submit' | 'reset';

export type QueryParams = Params;
export type ObjectAnyType = any; // eslint-disable-line @typescript-eslint/no-explicit-any
export type ChildrenProps = React.ReactElement | HTMLElement | (React.ReactElement | HTMLElement)[];

export type PositionObj = {
  bounding_box: {
    bottom: number;
    left: number;
    right: number;
    top: number;
  };
  confidence: number;
  name: string;
  parent: string;
};
export type ResultNvision = {
  service_id: string;
  detected_objects: PositionObj[];
};

export interface EmptyObject {
  [key: string]: unknown;
}
