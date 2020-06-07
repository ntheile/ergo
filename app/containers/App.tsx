import React, { ReactNode, useState } from 'react';
type Props = {
  children: ReactNode;
};

export default function App(props: Props) {


  const { children } = props;
  return <>{children}</>;
}
