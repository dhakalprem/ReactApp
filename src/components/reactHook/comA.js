import React, { createContext } from 'react'
import ComB from "./ComB";

const BioData = createContext();

const ComA = () => {
    return (
        <BioData.Provider value={"Prem Prakash Dhakal"}>
            <ComB />
        </BioData.Provider>
    ) 
}
export default ComA
export { BioData };

/*What is Props drilling?
Pass value componentwise one by one

Whate Context Api?
Context – Provider and Consumer

What is useContext?
Context-provider and useContext.*/
