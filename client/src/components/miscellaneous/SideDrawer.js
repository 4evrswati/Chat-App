import { Avatar, Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import {BellIcon, ChevronDownIcon} from '@chakra-ui/icons'
import { ChatState } from '../../context/ChatProvider'
import ProfileModal from './ProfileModal'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ChatLoading from '../ChatLoading'
import UserListItem from '../UserAvatar/UserListItem'
import { getSender } from '../../config/ChatLogic'
import { Badge } from 'antd'

const SideDrawer = () => {

  const toast = useToast()
  const navigate = useNavigate()

  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState()

  const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const logoutHandler = () => {
    localStorage.removeItem('userInfo')
    navigate('/')
  }

  const handleSearch = async() => {
    try {
      if(!search) {
        toast({
          title:"Please..! Enter something to search",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: 'top-left'
        })
        return;
      }

      setLoading(true)

      const config = {
        headers: {
          Authorization: `${user.token}`,
        }
      }

      const { data } = await axios.get(`/api/user?search=${search}`, config)

      if(data?.success) {
        setSearchResult(data?.users)
      }

      setLoading(false)

    } catch (error) {
      toast({
        title:"Error Occured..!!",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: 'top-left'
      })
      setLoading(false)
    }
  }

  const accessChat = async(userId) => {
    try {
      setLoadingChat(true)

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `${user.token}`,
        }
      }

      const {data} = await axios.post('/api/chat', {userId}, config)

      if(!chats.find((c) => c._id === data._id))
        setChats([data, ...chats])

      setSelectedChat(data)
      setLoading(false)
      onClose()

    } catch (error) {
      toast({
        title:"Error in fetching the chats..!!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      })
    }
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems='center'
        bg='white'
        w='100%'
        p='5px 10px 5px 10px'
        borderWidth='5px'
      >
        <Tooltip 
          label="Search Users to chat"
          hasArrow
          placement='bottom-end'
        >
          <Button variant='ghost' onClick={onOpen}>
            <i class="fas fa-search"></i>
            <Text d={{base:"none", md:"flex"}} px='4'>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text as='b' fontSize="2xl" fontFamily='Work sans'>
          Chit-Chat
        </Text>
        <div>

          <Menu>
            <MenuButton p={1}>
              <Badge count={notification.length}>
                <BellIcon fontSize='2xl' m={1} />
              </Badge>
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map(notify => (
                <MenuItem 
                  key={notify._id} 
                  onClick={() => {
                    setSelectedChat(notify.chat)
                    setNotification(notification.filter((n) => n !== notify))
                  }}
                >
                  {notify.chat.isGroupChat ? 
                    `New Message in ${notify.chat.chatName}` : `New Message from ${getSender(user, notify.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton p={1} as={Button} rightIcon={<ChevronDownIcon />} >
              <Avatar size='sm' cursor="pointer" name={user.name} src={user.pic} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
                <MenuDivider />
                <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>

        </div>
      </Box>

      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>

          <DrawerBody>
            <Box display='flex' pb={2}>
              <Input
                placeholder='Search by name or email'
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>GO</Button>
            </Box>
            {
              loading ? (
                <ChatLoading />
              ) : (
                searchResult?.map(user => (
                  <UserListItem 
                    key={user._id}
                    user={user}
                    handleFunction = {() => accessChat(user._id)}
                  />
                ))
              )
            }
            {loadingChat && <Spinner ml='auto' display='flex' />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer