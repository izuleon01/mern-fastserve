import { FunctionComponent, useMemo, type CSSProperties } from "react";

type NotificationMsgType = {
  notificationIconFrame?: string;
  notificationMainMessage?: string;

  /** Style props */
  notificationBackgroundColor?: CSSProperties["backgroundColor"];
  notificationMainMessageFrFlex?: CSSProperties["flex"];
  notificationSecondaryMessFlex?: CSSProperties["flex"];
};

const NotificationMsg: FunctionComponent<NotificationMsgType> = ({
  notificationBackgroundColor,
  notificationIconFrame,
  notificationMainMessageFrFlex,
  notificationMainMessage,
  notificationSecondaryMessFlex,
}) => {
  const notificationStyle: CSSProperties = useMemo(() => {
    return {
      backgroundColor: notificationBackgroundColor,
    };
  }, [notificationBackgroundColor]);

  const notificationMainMessageFrameStyle: CSSProperties = useMemo(() => {
    return {
      flex: notificationMainMessageFrFlex,
    };
  }, [notificationMainMessageFrFlex]);

  const notificationSecondaryMessageFrStyle: CSSProperties = useMemo(() => {
    return {
      flex: notificationSecondaryMessFlex,
    };
  }, [notificationSecondaryMessFlex]);

  return (
    <section
      className="self-stretch rounded-6xl bg-lightgoldenrodyellow flex flex-row items-center justify-start py-[25px] px-7 gap-[34px] text-left text-21xl text-gray-200 font-roboto border-[1px] border-solid border-lightgoldenrodyellow lg:flex-row lg:gap-[20px] lg:items-center lg:justify-start md:self-stretch md:w-auto md:flex-row md:gap-[5px] md:items-center md:justify-start md:pr-7 md:box-border"
      style={notificationStyle}
    >
      <img
        className="relative w-[75px] h-[75px] overflow-hidden shrink-0 object-cover"
        alt=""
        src={notificationIconFrame}
      />
      <div
        className="flex-1 flex flex-row items-center justify-start md:flex-1 md:items-center md:justify-start"
        style={notificationMainMessageFrameStyle}
      >
        <b className="relative">{notificationMainMessage}</b>
      </div>
      <div
        className="flex-1 flex flex-row items-center justify-start text-13xl text-gray-300 font-work-sans md:flex-1 sm:gap-[10px]"
        style={notificationSecondaryMessageFrStyle}
      >
        <div className="relative md:flex" />
      </div>
    </section>
  );
};

export default NotificationMsg;
