import { ReactNode } from "react";
import Navbar from "./navbar";

type ContainerProps = {
  title?: string;
  children: ReactNode;
};

export default function Container({ title = "My Folders", children }: ContainerProps) {
  return (
    <>
      <Navbar title={title} />
      <div className="mx-auto h-[calc(100vh-50px)] w-full max-w-6xl overflow-y-auto overflow-x-hidden px-4">
        {children}
      </div>
    </>
  );
}
