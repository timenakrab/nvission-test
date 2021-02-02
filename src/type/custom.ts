import { Params } from 'next/dist/next-server/server/router';

export type ButtonType = 'button' | 'submit' | 'reset';

export type QueryParams = Params;
export type ObjectAnyType = any; // eslint-disable-line @typescript-eslint/no-explicit-any
export type ChildrenProps = React.ReactElement | HTMLElement | (React.ReactElement | HTMLElement)[];
export type InputCurrentType = {
  current: {
    value: string;
  };
};

export interface EmptyObject {
  [key: string]: unknown;
}
