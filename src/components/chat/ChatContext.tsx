import { ReactNode, createContext, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useMutation } from "@tanstack/react-query";

type StreamResponse = {
    addMessage: void,
    message: string,
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    isLoading: boolean,
}

export const ChatContex = createContext<StreamResponse>({
    addMessage:() = {},
    message: '',
    handleInputChange: () = {},
    isLoading: false,
});

interface Props {
    fileId: string;
    children: ReactNode;
}

export const ChatContextProvider =({fileId, children}: Props) => {
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {toast} = useToast();
// the reason we don't use trpc, we want to stream back a response from the API to this client; trpc does't work, only for JSON
    const {mutate: sendMessage} = useMutation({
        mutationFn: async ({message}:{message: string}) => {
            const response = await fetch ('/api/message',{
                method: 'POST',
                body: JSON.stringify({fileId, message}),
            });
            if (!response.ok) {
                throw new Error('Failed to send message');
            }
            return response.body
        },
    })
const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
}
const addMessage =  () => sendMessage({message});

    return (
    <ChatContex.Provider value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
    }} > {children}
    </ChatContex.Provider>
    )
}