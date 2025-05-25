import { FC, ReactNode } from "react";

import Header from "./Header";
import Footer from "./Footer";

interface Props {
      children: ReactNode;
}
   //<div className="bg-gypsum overflow-hidden flex flex-col min-h-screen">
const Layout: FC<Props> = ({ children }) => {
  return (
    <>
     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
       <div className="mx-auto max-w-2xl">
         <Header />
         <div>
           {children}
         </div>
         <Footer />
       </div>
    </div>
    </>
  );
};

export default Layout
