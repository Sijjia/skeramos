import { forwardRef, type HTMLAttributes, type ElementType } from 'react';

// Heading components
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  as?: ElementType;
}

const headingStyles: Record<HeadingLevel, string> = {
  1: 'text-4xl md:text-5xl font-bold tracking-tight',
  2: 'text-3xl md:text-4xl font-bold tracking-tight',
  3: 'text-2xl md:text-3xl font-semibold',
  4: 'text-xl md:text-2xl font-semibold',
  5: 'text-lg md:text-xl font-medium',
  6: 'text-base md:text-lg font-medium',
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 2, as, children, className = '', ...props }, ref) => {
    const Component = as || (`h${level}` as ElementType);

    return (
      <Component
        ref={ref}
        className={`text-zone-900 ${headingStyles[level]} ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = 'Heading';

// Shorthand components
export const H1 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={1} {...props} />
);
H1.displayName = 'H1';

export const H2 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={2} {...props} />
);
H2.displayName = 'H2';

export const H3 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={3} {...props} />
);
H3.displayName = 'H3';

export const H4 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={4} {...props} />
);
H4.displayName = 'H4';

export const H5 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={5} {...props} />
);
H5.displayName = 'H5';

export const H6 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={6} {...props} />
);
H6.displayName = 'H6';

// Body text
type BodySize = 'lg' | 'md' | 'sm';

interface BodyProps extends HTMLAttributes<HTMLParagraphElement> {
  size?: BodySize;
  muted?: boolean;
}

const bodySizeStyles: Record<BodySize, string> = {
  lg: 'text-lg leading-relaxed',
  md: 'text-base leading-relaxed',
  sm: 'text-sm leading-normal',
};

export const Body = forwardRef<HTMLParagraphElement, BodyProps>(
  ({ size = 'md', muted = false, children, className = '', ...props }, ref) => {
    const colorClass = muted ? 'text-muted-foreground' : 'text-neutral-600';

    return (
      <p
        ref={ref}
        className={`${colorClass} ${bodySizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </p>
    );
  }
);

Body.displayName = 'Body';

// Caption
interface CaptionProps extends HTMLAttributes<HTMLSpanElement> {
  muted?: boolean;
}

export const Caption = forwardRef<HTMLSpanElement, CaptionProps>(
  ({ muted = true, children, className = '', ...props }, ref) => {
    const colorClass = muted ? 'text-muted-foreground' : 'text-neutral-600';

    return (
      <span
        ref={ref}
        className={`text-xs leading-normal ${colorClass} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Caption.displayName = 'Caption';

// Label
interface LabelProps extends HTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ htmlFor, required = false, children, className = '', ...props }, ref) => {
    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={`text-sm font-medium text-zone-700 ${className}`}
        {...props}
      >
        {children}
        {required && <span className="text-error ml-1">*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label';
