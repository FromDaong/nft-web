import { ReactNode } from "react";

export type FieldType = {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  validation: RegExp;
};

export type StepType = {
  id: string;
  title: string;
  description: string;
  type: string;
  fields?: FieldType[];
  onSubmit: () => any;
};

export type CustomComponent = {
  name: string;
  component: ReactNode;
};
