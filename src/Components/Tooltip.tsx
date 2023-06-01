import React, { useState } from "react";
import { Placement } from "@popperjs/core";
import { usePopper } from "react-popper";

import "./Tooltip.css";
import classNames from "../Util/classNames";

interface IProps {
  placement: Placement;
  content: React.ReactNode;
  hidden?: boolean;
  children: React.ReactElement;
}
export default function Tooltip({
  placement,
  content,
  hidden,
  children,
}: IProps) {
  //-- State and Refs --//
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [buttonRef, setButtonRef] = useState<HTMLElement | null>(null);
  const [tooltipRef, setTooltipRef] = useState<HTMLElement | null>(null);
  const [arrowRef, setArrowRef] = useState<HTMLElement | null>(null);

  //-- Popper --//
  const { styles, attributes } = usePopper(buttonRef, tooltipRef, {
    placement,
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 8],
        },
      },
      {
        name: "arrow",
        options: {
          element: arrowRef,
        },
      },
    ],
  });

  //-- Hover handlers --//
  const handleMouseEnter = () => {
    setTooltipVisible(true);
  };
  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  //-- Component Return --//
  return (
    <>
      {React.cloneElement(children, {
        ref: setButtonRef,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      })}
      {tooltipVisible && (
        <div
          id="tooltip"
          role="tooltip"
          ref={setTooltipRef}
          style={styles.popper}
          {...attributes.popper}
          className={classNames(
            "z-20 rounded bg-zinc-500 px-3 py-1 text-xs text-white shadow-lg",
            hidden ? "hidden" : ""
          )}
        >
          {content}
          <div id="arrow" ref={setArrowRef} style={styles.arrow} />
        </div>
      )}
    </>
  );
}
