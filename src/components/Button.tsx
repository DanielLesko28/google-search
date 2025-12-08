interface ButtonProps<T> {
  onClickFunction: (data: T) => void;
  data: T;
  title?: string;
  className?: string;
}

interface SimpleButtonProps {
  onClickFunction: () => void;
  title?: string;
  className?: string;
}

export const Button = <T,>({
  onClickFunction,
  data,
  title,
  className,
}: ButtonProps<T>) => {
  return (
    <button onClick={() => onClickFunction(data)} className={className}>
      {title}
    </button>
  );
};

export const SimpleButton: React.FC<SimpleButtonProps> = ({
  onClickFunction,
  title,
  className,
}) => {
  return (
    <button
      onClick={onClickFunction}
      className={className || "p-2 bg-gray-500 text-white rounded"}
    >
      {title}
    </button>
  );
};
