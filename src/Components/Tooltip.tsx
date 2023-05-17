import React, { useState, useRef, useEffect } from "react";
import { Placement } from "@popperjs/core";
import { usePopper } from "react-popper";

interface IProps {
  placement: Placement;
  content: React.ReactNode;
  children: React.ReactElement;
}
export default function Tooltip({ placement, content, children }: IProps) {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const [buttonRef, setButtonRef] = useState<HTMLElement | null>(null);
  const [tooltipRef, setTooltipRef] = useState<HTMLElement | null>(null);

  const { styles, attributes } = usePopper(buttonRef, tooltipRef, {
    placement,
  });

  const handleMouseEnter = () => {
    setTooltipVisible(true);
  };
  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  return (
    <>
      {React.cloneElement(children, {
        ref: setButtonRef,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      })}
      {tooltipVisible && (
        <div
          ref={setTooltipRef}
          style={styles.popper}
          {...attributes.popper}
          className="z-20 rounded bg-zinc-500 px-3 py-1 text-sm text-white shadow-lg"
        >
          {content}
        </div>
      )}
    </>
  );
}
