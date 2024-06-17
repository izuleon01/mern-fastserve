import { FunctionComponent, useCallback } from "react";
import { Input } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

type ItemDetailsCardType = {
  itemDetailsCardItemImage?: string;
  itemDetailsCardItemName?: string;
  itemDetailsCardItemPrice?: string;
};

const ItemDetailsCard: FunctionComponent<ItemDetailsCardType> = ({
  itemDetailsCardItemImage,
  itemDetailsCardItemName,
  itemDetailsCardItemPrice,
}) => {
  const navigate = useNavigate();

  const onButtonContainerClick = useCallback(() => {
    navigate("/homepage");
  }, [navigate]);

  return (
    <div className="bg-white flex flex-row items-start justify-start gap-[41px] text-left text-3xl text-gray-300 font-aleo sm:flex-col sm:gap-[41px] sm:items-center sm:justify-start">
      <img
        className="relative w-[238px] h-[227px] object-cover sm:flex"
        alt=""
        src={itemDetailsCardItemImage}
      />
      <div className="self-stretch flex flex-col items-start justify-start gap-[10px] sm:items-start sm:justify-start">
        <div className="flex-1 flex flex-row items-center justify-start gap-[50px] sm:flex-col">
          <div className="flex flex-col items-start justify-start gap-[5px] md:flex-col md:gap-[15px] md:pb-0 md:box-border sm:flex-col sm:items-center sm:justify-start">
            <div className="flex flex-row items-start justify-start md:h-auto md:flex-row sm:flex-col">
              <b className="relative">{itemDetailsCardItemName}</b>
            </div>
            <div className="flex flex-col items-start justify-start text-base md:flex-row">
              <b className="relative">{itemDetailsCardItemPrice}</b>
            </div>
          </div>
          <div className="w-[539px] flex flex-row items-start justify-start text-base sm:w-auto sm:[align-self:unset]">
            <div className="flex-1 relative sm:flex">
              The Big Mac is a 100% beef burger with a taste like no other. The
              mouthwatering perfection starts with two 100% pure all beef
              patties and Big Mac sauce sandwiched between a sesame seed bun.
              It’s topped off with pickles.
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-center justify-end gap-[50px] sm:flex-col sm:gap-[20px] sm:items-end sm:justify-start">
          <div className="flex flex-row items-center justify-start gap-[10px]">
            <img
              className="relative rounded-10xs w-[23px] h-[23px] object-cover"
              alt=""
              src="/itemdetailscardincrementquantityframe@2x.png"
            />
            <Input
              className="bg-[transparent] font-aleo font-bold text-base text-gray-100"
              placeholder="1"
              size="sm"
            />
            <img
              className="relative rounded-10xs w-[23px] h-[23px] object-cover"
              alt=""
              src="/itemdetailscarddecrementquantityframe@2x.png"
            />
          </div>
          <Button
            buttonText="Add To Order"
            onButtonContainerClick={onButtonContainerClick}
            buttonMinWidth="unset"
          />
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsCard;
