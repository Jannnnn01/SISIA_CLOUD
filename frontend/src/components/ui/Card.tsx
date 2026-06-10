import { PropsWithChildren } from 'react';

export const Card = ({ children }: PropsWithChildren) => (
  <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">{children}</section>
);
