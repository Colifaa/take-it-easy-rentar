"use client";  

import {  
  Box,  
  Flex,  
  Avatar,  
  HStack,  
  Text,  
  IconButton,  
  Button,  
  Menu,  
  MenuButton,  
  MenuList,  
  MenuItem,  
  MenuDivider,  
  useDisclosure,  
  Stack,  
  Modal,  
  ModalOverlay,  
  ModalContent,  
  ModalHeader,  
  ModalCloseButton,  
  ModalBody,  
  ModalFooter,  
  Link as ChakraLink,  
} from "@chakra-ui/react";  
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";  
import { Languages } from "lucide-react"; // Asegúrate de tener este icono instalado  
import { useState, useEffect } from "react";  
import supabase from "@/supabase/authTest";  
import LoginForm from "../components/login";  

import { useLanguage } from "../hooks/use-language";  
import { languages } from "../lib/languages";  

interface User {  
  id: string;  
  email: string;  
  user_metadata: {  
    name: string;  
    avatar_url: string;  
  };  
}  

export default function Navbar() {  
  const { isOpen, onOpen, onClose } = useDisclosure();  
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();  
  const [user, setUser] = useState<User | null>(null);  
  const [isAdmin, setIsAdmin] = useState(false);  
  const { language, setLanguage } = useLanguage();  
  const t = languages[language];  

  useEffect(() => {  
    const fetchUser = async () => {  
      const {  
        data: { user },  
      } = await supabase.auth.getUser();  

      setUser(user as User | null);  
      if (user) {  
        const { data, error } = await supabase  
          .from("user_roles")  
          .select("role_id")  
          .eq("user_id", user.id)  
          .single();  

        if (data && data.role_id === 1) {  
          setIsAdmin(true);  
        }  
      }  
    };  
    fetchUser();  
  }, []);  

  const handleLogout = async () => {  
    await supabase.auth.signOut();  
    setUser(null);  
    setIsAdmin(false);  
  };  

  return (  
    <Box bg="linear-gradient(to right, #4facfe, #00f2fe)" px={4}>  
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>  
        <IconButton  
          size={"md"}  
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}  
          aria-label={"Open Menu"}  
          display={{ md: "none" }}  
          onClick={isOpen ? onClose : onOpen}  
        />  

        <Flex alignItems="center">  
          <ChakraLink href="/" textDecoration="none">  
            <Text fontSize="xl" fontWeight="bold" color="white">  
              Take-It-Easy  
            </Text>  
          </ChakraLink>  
        </Flex>  

        <HStack as={"nav"} spacing={8} display={{ base: "none", md: "flex" }}>  
          <ChakraLink href="/" textDecoration="none" _hover={{ color: "yellow.400" }}>  
            {t.navbar.home}  
          </ChakraLink>  
          <ChakraLink href="/about" textDecoration="none" _hover={{ color: "yellow.400" }}>  
            {t.navbar.about}  
          </ChakraLink>  
          <ChakraLink href="/contact" textDecoration="none" _hover={{ color: "yellow.400" }}>  
            {t.navbar.contact}  
          </ChakraLink>  
        </HStack>  

        <Flex alignItems={"center"} gap={4}>  
          <Button  
            variant="ghost"  
            size="sm"  
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}  
            color="white"  
            _hover={{ color: "yellow.400" }}  
          >  
            <Languages className="h-5 w-5" />  
            <Text ml={2}>{language.toUpperCase()}</Text>  
          </Button>  

          {user ? (  
            <Menu>  
              <MenuButton  
                as={Button}  
                rounded={"full"}  
                variant={"link"}  
                cursor={"pointer"}  
                minW={0}  
              >  
                <Avatar size={"sm"} src={user.user_metadata.avatar_url} />  
              </MenuButton>  
              <MenuList>  
                <MenuDivider />  
                <MenuItem>  
                  <Text>{t.auth.welcome}, {user.user_metadata.name}!</Text>  
                </MenuItem>  
                <MenuDivider />  
                {isAdmin && (  
                  <MenuItem>  
                    <ChakraLink href="/dashboard" textDecoration="none">  
                      {t.navbar.dashboard}  
                    </ChakraLink>  
                  </MenuItem>  
                )}  
                <MenuDivider />  
                <MenuItem onClick={handleLogout}>{t.navbar.logout}</MenuItem>  
              </MenuList>  
            </Menu>  
          ) : (  
            <Button colorScheme="yellow" variant="outline" onClick={openModal}>  
              {t.navbar.login}  
            </Button>  
          )}  
        </Flex>  
      </Flex>  

      {isOpen && (  
        <Box pb={4} display={{ md: "none" }}>  
          <Stack as={"nav"} spacing={4}>  
            <ChakraLink href="/" textDecoration="none" _hover={{ color: "yellow.400" }}>  
              {t.navbar.home}  
            </ChakraLink>  
            <ChakraLink href="/about" textDecoration="none" _hover={{ color: "yellow.400" }}>  
              {t.navbar.about}  
            </ChakraLink>  
            <ChakraLink href="/contact" textDecoration="none" _hover={{ color: "yellow.400" }}>  
              {t.navbar.contact}  
            </ChakraLink>  
          </Stack>  
        </Box>  
      )}  

      <Modal isOpen={isModalOpen} onClose={closeModal}>  
        <ModalOverlay />  
        <ModalContent>  
          <ModalHeader>{t.auth.loginMessage}</ModalHeader>  
          <ModalCloseButton />  
          <ModalBody>  
            <LoginForm />  
          </ModalBody>  
          <ModalFooter>  
            <Button colorScheme="blue" mr={3} onClick={closeModal}>  
              {t.auth.createAccountButton}  
            </Button>  
          </ModalFooter>  
        </ModalContent>  
      </Modal>  
    </Box>  
  );  
}