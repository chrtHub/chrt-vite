//-- react --//
import { useState, createContext, useContext, PropsWithChildren } from "react";

//-- types --//

//-- Create interface and Context --//
export interface ITemplateContext {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}

//-- Create context --//
const TemplateContext = createContext<ITemplateContext | undefined>(undefined);

//-- Custom Provider Component --//
function TemplateContextProvider({ children }: PropsWithChildren) {
  //-- State values --//
  const [state, setState] = useState<boolean>(false);

  //-- Bundle values into templateContextValue --//
  const templateContextValue: ITemplateContext = {
    state,
    setState,
  };

  //-- Return context provider --//
  return (
    <TemplateContext.Provider value={templateContextValue}>
      {children}
    </TemplateContext.Provider>
  );
}

//-- Custom Consumer Hook --//
function useTemplateContext() {
  const context = useContext(TemplateContext);

  if (context === undefined) {
    throw new Error(
      "useTemplateContext must be used within a TemplateContextProvider"
    );
  }
  return context;
}

//-- Export Provider Component and Consumer Hook ---//
export { TemplateContextProvider, useTemplateContext };

//-- TO BE SET UP IN THE COMPONENT TREE ABOVE ALL CONSUMERS OF THIS CONTEXT --//

//-- FOR USE IN OTHER COMPONENTS --//
// import { useTemplateContext } from "../../Context/TemplateContext";
// let TemplateContext = useTemplateContext();
