import { FunctionComponent, memo, useMemo, type CSSProperties } from "react";

type ButtonType = {
  buttonText?: string;

  /** Style props */
  buttonMinWidth?: CSSProperties["minWidth"];

  /** Action props */
  onButtonContainerClick?: () => void;
};

const Button: FunctionComponent<ButtonType> = memo(
  ({ buttonText = "View Orders", onButtonContainerClick, buttonMinWidth }) => {
    const buttonStyle: CSSProperties = useMemo(() => {
      return {
        minWidth: buttonMinWidth,
      };
    }, [buttonMinWidth]);

    return (
      <div
        className="bg-gray-100 flex flex-col items-start justify-start py-2.5 px-[15px] text-sm text-white font-aleo border-[1px] border-solid border-black cursor-pointer text-center"
        onClick={onButtonContainerClick}
        style={buttonStyle}
      >
        <div className="relative w-full">{buttonText}</div>
      </div>
    );
  },
);

export default Button;
