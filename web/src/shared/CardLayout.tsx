import React from 'react';

interface CardLayoutProps {
  children: React.ReactNode;
  title: React.ReactNode;
  titleClassName?: string;
  className?: string;
}

const CardLayout = ({ children, title, titleClassName, className }: CardLayoutProps) => {
  return (
    <div
      className={`relative rounded-3xl border border-black-100 bg-white p-6 flex flex-col transition-all duration-200 ${
        className || ''
      }`}
    >
      <h2
        className={
          titleClassName ||
          'flex items-center gap-2 text-lg sm:text-xl font-semibold text-gray-900 leading-snug mb-4'
        }
      >
        {title}
      </h2>
      {children}
    </div>
  );
};

export default CardLayout;
