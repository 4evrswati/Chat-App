import {createContext, useState, useEffect, useContext} from 'react'

const ChatContext = createContext()

const ChatProvider = ({children}) => {

    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState()
    const [chats, setChats] = useState([])
    const [notification, setNotification] = useState([])

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo')

        if(userInfo) {
            setUser(JSON.parse(userInfo))
        }
    },[])

  return (
    <ChatContext.Provider 
      value={{
        user, setUser, 
        selectedChat, setSelectedChat, 
        chats, setChats, 
        notification, setNotification
      }}
    >
        {children}
    </ChatContext.Provider>
  )
}

const ChatState = () => useContext(ChatContext)

export { ChatProvider, ChatState }