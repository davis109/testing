import React, { createContext, useState, useContext, ReactNode } from 'react';

interface CamContextType {
    camdata: string;
    setCamdata: (text: string) => void;
}



const CamContext = createContext<CamContextType | undefined>(undefined);

export const CamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [camdata, setCamdata] = useState<string>('');




    return (
        <CamContext.Provider value={{ camdata, setCamdata }}>
            {children}
        </CamContext.Provider>
    );
};

export const useCam = () => {
    const context = useContext(CamContext);

    if (context === undefined) {
        throw new Error('useCam must be used within an CamProvider');
    }

    return context;
};

export { CamContext };