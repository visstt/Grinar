import React from "react";

import cn from "classnames";

import styles from "./Button.module.css";

export default function Button({
  children,
  variant = "primary",
  size = "medium",
  className = "",
  ...props
}) {
  return (
    <button
      className={cn(styles.button, styles[variant], styles[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
