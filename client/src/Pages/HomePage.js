import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import {useEffect} from 'react'
import Login from '../components/auth/Login'
import Signup from '../components/auth/Signup'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {

    const navigate = useNavigate()

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userInfo'))

        if(user)
            navigate('/chats')
    },[navigate])

  return (
    <Container maxW='xl' centerContent>
        <Box
            display="flex"
            justifyContent="center"
            p={3}
            bg="white"
            w="100%"
            m="40px 0 15px 0"
            borderRadius="lg"
            borderWidth="1px"
        >
            <Text as='b' fontSize="4xl" fontFamily="Work Sans" color="black">Chit-Chat</Text>
        </Box>
        <Box
            p={4}
            bg="white"
            w="100%"
            borderRadius="lg"
            borderWidth="1px"
            color="black"
        >
            <Tabs variant='soft-rounded'>
            <TabList mb="1em">
                <Tab w="50%">Log In</Tab>
                <Tab w="50%">Sign Up</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <Login />
                </TabPanel>
                <TabPanel>
                    <Signup />
                </TabPanel>
            </TabPanels>
            </Tabs>
        </Box>
    </Container>
  )
}

export default HomePage