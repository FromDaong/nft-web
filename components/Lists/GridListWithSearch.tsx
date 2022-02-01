import { FC, ReactNode } from "react";

export default function GridListWithSearch(props: GridListProps) {
  return (
    <div className="p-2">
      <div className="pb-4"></div>
      <div className={`grid grid-cols-${props.cols ? props.cols : 4}`}>
        {props.data.map((item) => props.render(item))}
      </div>
    </div>
  );
}

interface GridListProps {
  searchPlaceholder: string;
  render: (props) => ReactNode;
  data: Array<any>;
  cols?: Number;
}
