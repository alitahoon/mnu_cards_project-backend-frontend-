import React from "react";
import PropTypes from "prop-types";

const CustomBottom = ({
  text,
  textStyle,
  title,
  onClick,
  styles,
  buttonStyles,
  rigthIcon,
}) => {
  return (
    <div className={`flex justify-center ${styles}`}>
      <button
        title={title}
        onClick={onClick}
        className={`
          group
          relative
          inline-flex
          items-center
          justify-center
          gap-2
          px-6
          py-3
          bg-gradient-to-r
          from-blue
          to-mint-blue
          text-light-pink
          hover:from-mint-green
          hover:to-blue
          focus:outline-none
          focus:ring-2
          focus:ring-offset-2
          focus:ring-mint-green
          font-semibold
          rounded-lg
          shadow-lg
          transition-all
          duration-300
          hover:shadow-xl
          hover:scale-105
          ${buttonStyles}
        `}
      >
        <span className={`text-sm md:text-base ${textStyle}`}>{text}</span>
        {rigthIcon && (
          <span className="text-lg ml-1 transition-transform group-hover:translate-x-1">
            {rigthIcon}
          </span>
        )}
      </button>
    </div>
  );
};

CustomBottom.propTypes = {
  text: PropTypes.string.isRequired,
  title: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  styles: PropTypes.string,
  buttonStyles: PropTypes.string,
  textStyle: PropTypes.string,
  rigthIcon: PropTypes.node,
};

CustomBottom.defaultProps = {
  title: "Button",
  styles: "",
  buttonStyles: "",
  textStyle: "",
};

export default CustomBottom;
