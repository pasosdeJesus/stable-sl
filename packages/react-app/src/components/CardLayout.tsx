import { FC, ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Card } from "@/components/ui/card";

interface Props {
  children: ReactNode;
}

const CardLayout: FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="relative overflow-hidden xs:max-w-md xs:m-auto xs:my-8 md:my-16 xs:rounded-xl w-full shadow-xl bg-surface-100 dark:bg-surface-700">
          <div className="overscroll-auto flex flex-col h-full">
            <Header />
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CardLayout;