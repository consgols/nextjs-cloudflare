import { cn } from '@/lib/utils';

type TypographyPropsType = {
  children: React.ReactNode;
  className?: string;
};

export function H1(props: TypographyPropsType) {
  return (
    <h1 className={cn('scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl', props.className)}>
      {props.children}
    </h1>
  );
}

export function H2(props: TypographyPropsType) {
  return (
    <h2 className={cn('scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0', props.className)}>
      {props.children}
    </h2>
  );
}

export function H3(props: TypographyPropsType) {
  return (
    <h3 className={cn('scroll-m-20 text-2xl font-semibold tracking-tight', props.className)}> {props.children}</h3>
  );
}

export function H4(props: TypographyPropsType) {
  return <h4 className={cn('scroll-m-20 text-xl font-semibold tracking-tight', props.className)}> {props.children}</h4>;
}

export function P(props: TypographyPropsType) {
  return <p className={cn('leading-7 [&:not(:first-child)]:mt-6', props.className)}>{props.children}</p>;
}
