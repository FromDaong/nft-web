import { FC, ReactNode } from "react";

export default function GridListWithSearch(props: GridListProps) {
  return <div></div>;
}

interface GridListProps {
  searchPlaceholder: string;
  render: (props) => ReactNode;
  data: Array<any>;
}
