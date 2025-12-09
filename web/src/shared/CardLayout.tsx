import React from "react";

interface CardLayoutProps {
  children: React.ReactNode;
  title: React.ReactNode;
  titleClassName?: string;
  className?: string;
  onClick?: () => void;
  action?: React.ReactNode;
}

const CardLayout = ({
  children,
  title,
  titleClassName,
  className,
  onClick,
  action,
}: CardLayoutProps) => {
  return (
    <div
      className={`relative rounded-3xl border border-border bg-card p-6 flex flex-col transition-all duration-200 ${
        className || ""
      }`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          className={
            titleClassName ||
            "flex items-center gap-2 text-lg sm:text-xl font-semibold text-card-foreground leading-snug"
          }
        >
          {title}
        </h2>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  );
};

export default CardLayout;
