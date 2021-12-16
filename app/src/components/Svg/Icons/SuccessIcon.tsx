import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 56 56" {...props}>
      <rect
        id="Rectangle_2055"
        data-name="Rectangle 2055"
        width="56"
        height="56"
        rx="8"
        fill="#14f195"
      />
      <g id="info" transform="translate(38 38) rotate(180)">
        <circle
          id="Ellipse_1"
          data-name="Ellipse 1"
          cx="10"
          cy="10"
          r="10"
          fill="none"
          stroke="#0c0c13"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          id="Path_61"
          data-name="Path 61"
          d="M0,0"
          transform="translate(10 10)"
          fill="none"
          stroke="#0c0c13"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <g id="check" transform="translate(15 13) rotate(180)">
          <path
            id="check-2"
            data-name="check"
            d="M14,6,7.125,13,4,9.818"
            transform="translate(-4 -6)"
            fill="none"
            stroke="#0c0c13"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </g>
      </g>{" "}
    </Svg>
  );
};

export default Icon;
