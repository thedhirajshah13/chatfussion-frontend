import { useEffect } from "react";

import { useSocketContext } from "./context/socketContext";
import {useConversationContext} from "./context/conversationContext";
import notificationSound from "./assets/sound/mixkit-correct-answer-tone-2870.wav"

const useListenMessage =()=>{
    const {socket} = useSocketContext();
    const {currentConversation, setConversation} = useConversationContext();

    useEffect(()=>{
       socket?.on("newmessage",(newmessage)=>{
        const sound=new Audio(notificationSound)
        sound.play()
        setConversation([...currentConversation,newmessage])
       })
       return ()=> socket?.off("newmessage")
    },[socket,currentConversation, setConversation])
}

export default useListenMessage