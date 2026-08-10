import type { ReactNode } from 'react';

export type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={`mx-auto max-w-(--container-max) px-8 md:px-10 lg:px-16 2xl:max-w-(--container-max-wide) ${className ?? ''}`}
    >
      {children}
    </div>
  );
}
