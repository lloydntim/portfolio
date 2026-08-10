import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

type ButtonBaseProps = {
  size?: 'md' | 'lg';
  className?: string;
};

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsAnchor = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const base =
  'inline-flex items-center gap-2.5 whitespace-nowrap font-heading font-semibold text-white bg-accent transition-colors duration-200 motion-reduce:transition-none hover:bg-accent-hover-strong';

const sizeClasses: Record<NonNullable<ButtonBaseProps['size']>, string> = {
  md: 'px-6.5 py-3.5 text-[15px]',
  lg: 'px-[30px] py-4 text-[15px]',
};

export function Button({ size = 'lg', className, ...props }: ButtonProps) {
  const classes = [base, sizeClasses[size], className].filter(Boolean).join(' ');

  if ('href' in props && props.href !== undefined) {
    const { href, ...rest } = props;
    return (
      <a href={href} className={classes} {...rest}>
        {props.children}
      </a>
    );
  }

  const { children, ...rest } = props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
