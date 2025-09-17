import React, { createContext, useContext, useState } from "react";

export const ConversationContext = createContext();

export const useConversationContext = () => {
  return useContext(ConversationContext);
};

export const ConversationContextProvider = ({ children }) => {
  const [currentConversation, setCurrentConversation] = useState([]);

  const setConversation = (conversation) => {
    setCurrentConversation(conversation);
  };

  return (
    <ConversationContext.Provider
      value={{ currentConversation, setConversation }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
