import { FunctionComponent, useMemo, type CSSProperties } from "react";

type ItemCardType = {
  menuItemCode?: string;
  itemName?: string;
  itemPrice?: string;

  /** Style props */
  itemCardItemImageFrameWidth?: CSSProperties["width"];
  itemCardItemImageIconWidth?: CSSProperties["width"];
  itemCardItemImageIconAlignSelf?: CSSProperties["alignSelf"];
  itemCardItemImageIconOverflow?: CSSProperties["overflow"];

  /** Action props */
  onItemCardContainerClick?: () => void;
};

const ItemCard: FunctionComponent<ItemCardType> = ({
  menuItemCode,
  itemName = "Bigs Mac",
  itemPrice = "$9.99",
  itemCardItemImageFrameWidth,
  itemCardItemImageIconWidth,
  itemCardItemImageIconAlignSelf,
  itemCardItemImageIconOverflow,
  onItemCardContainerClick,
}) => {
  const itemCardItemImageFrameStyle: CSSProperties = useMemo(() => {
    return {
      width: itemCardItemImageFrameWidth,
    };
  }, [itemCardItemImageFrameWidth]);

  const itemCardItemImageIconStyle: CSSProperties = useMemo(() => {
    return {
      width: itemCardItemImageIconWidth,
      alignSelf: itemCardItemImageIconAlignSelf,
      overflow: itemCardItemImageIconOverflow,
    };
  }, [
    itemCardItemImageIconWidth,
    itemCardItemImageIconAlignSelf,
    itemCardItemImageIconOverflow,
  ]);

  return (
    <div
      className="bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] box-border w-80 h-[416px] flex flex-col items-center justify-center gap-[10px] text-left text-13xl text-gray-100 font-aleo border-[1px] border-solid border-gainsboro cursor-pointer"
      onClick={onItemCardContainerClick}
    >
      <div
        className="flex flex-col items-start justify-start py-[7px] px-0"
        style={itemCardItemImageFrameStyle}
      >
        <img
          className="relative w-[238px] h-[227px] object-cover"
          alt=""
          src={menuItemCode}
          style={itemCardItemImageIconStyle}
        />
      </div>
      <div className="flex flex-row items-start justify-center">
        <b className="relative">{itemName}</b>
      </div>
      <div className="flex flex-row items-start justify-start text-5xl">
        <b className="relative">{itemPrice}</b>
      </div>
    </div>
  );
};

export default ItemCard;
