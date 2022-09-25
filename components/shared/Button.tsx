export default function Button(props: ButtonProps) {
  return (
    <button onClick={props.onClick} className="">
      {props.children}
    </button>
  );
}

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  theme?: string;
  colorScheme?: string;
};
