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
  Stack,  
  Modal,  
  ModalOverlay,  
  ModalContent,  
  ModalHeader,  
  ModalCloseButton,  
  ModalBody,  
  ModalFooter,  
  Link as ChakraLink,  
  Image,  
  useDisclosure  
} from "@chakra-ui/react";  
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";  
import { Languages } from "lucide-react";  
import { useState, useEffect, useMemo } from "react";  
import supabase from "@/supabase/authTest";  
import LoginForm from "../components/login";  
import { useLanguage } from "../hooks/use-language";  
import { languages } from "../lib/languages";  

interface User {  
  id: string;  
  email: string;  
  user_metadata: { name: string; avatar_url: string };  
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
      const { data: { user } } = await supabase.auth.getUser();  
      setUser(user as User | null);  

      if (user) {  
        const { data } = await supabase  
          .from("user_roles")  
          .select("role_id")  
          .eq("user_id", user.id)  
          .single();  

        setIsAdmin(data?.role_id === 1);  
      }  
    };  

    fetchUser();  
  }, []);  

  const handleLogout = async () => {  
    await supabase.auth.signOut();  
    setUser(null);  
    setIsAdmin(false);  
    window.location.reload();
  };  

  const menuItems = useMemo(() => (  
    [  
      { label: t.navbar.home, href: "/" },  
      { label: t.navbar.about, href: "/about" },  
      { label: t.navbar.contact, href: "/contact" },  
    ]  
  ), [t]);  

  return (  
    <Box bg="#D0F4F4" px={4} boxShadow="md">  
      <Flex h={20} alignItems="center" justifyContent="space-between">  
        {/* Botón menú hamburguesa */}
        <IconButton  
          size="md"  
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}  
          aria-label="Open Menu"  
          display={{ md: "none" }}  
          onClick={isOpen ? onClose : onOpen}  
          color="gray.700"
        />  

        {/* Logo */}
        <ChakraLink href="/">  
          <Image src="/logoo2.png" alt="Logo" boxSize="150px" objectFit="contain" />  
        </ChakraLink>  

        {/* Menú de Navegación */}
        <HStack as="nav" spacing={6} display={{ base: "none", md: "flex" }}>  
          {menuItems.map((item) => (  
            <ChakraLink  
              key={item.href}  
              href={item.href}  
              fontWeight="bold"
              color="gray.800"  
              fontSize="lg"
              _hover={{ color: "#009688", textDecoration: "underline" }}  
            >  
              {item.label}  
            </ChakraLink>  
          ))}  
        </HStack>  

        {/* Botones y Usuario */}
        <Flex alignItems="center" gap={4}>  
          {/* Selector de idioma */}
          <Button  
            variant="ghost"  
            size="sm"  
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}  
            color="gray.800"  
            fontWeight="bold"
            _hover={{ color: "#009688" }}  
          >  
            <Languages className="h-5 w-5" />  
            <Text ml={2}>{language.toUpperCase()}</Text>  
          </Button>  

          {/* Usuario Autenticado */}
          {user ? (  
            <Menu>  
              <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={0}>  
                <Avatar size="sm" src={user.user_metadata.avatar_url} />  
              </MenuButton>  
              <MenuList bg="white" color="gray.800">  
                <MenuItem fontWeight="bold">{t.auth.welcome}, {user.user_metadata.name}!</MenuItem>  
                {isAdmin && (  
                  <MenuItem>  
                    <ChakraLink href="/dashboard" textDecoration="none" fontWeight="bold" color="#009688">  
                      {t.navbar.dashboard}  
                    </ChakraLink>  
                  </MenuItem>  
                )}  
                <MenuItem fontWeight="bold" onClick={handleLogout}>{t.navbar.logout}</MenuItem>  
              </MenuList>  
            </Menu>  
          ) : (  
            <Button  
              bg="#009688"  
              color="white"  
              fontWeight="bold"
              _hover={{ bg: "white", color: "#009688", border: "2px solid #009688" }}  
              onClick={openModal}  
            >  
              {t.navbar.login}  
            </Button>  
          )}  
        </Flex>  
      </Flex>  

      {/* Menú Responsive */}
      {isOpen && (  
        <Box pb={4} display={{ md: "none" }}>  
          <Stack as="nav" spacing={4}>  
            {menuItems.map((item) => (  
              <ChakraLink  
                key={item.href}  
                href={item.href}  
                fontWeight="bold"
                color="gray.800"  
                fontSize="lg"
                _hover={{ color: "#009688", textDecoration: "underline" }}  
              >  
                {item.label}  
              </ChakraLink>  
            ))}  
          </Stack>  
        </Box>  
      )}  

      {/* Modal de Login */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>  
        <ModalOverlay />  
        <ModalContent>  
          <ModalHeader>{t.auth.loginMessage}</ModalHeader>  
          <ModalCloseButton />  
          <ModalBody>  
            <LoginForm />  
          </ModalBody>  
          <ModalFooter>  
            <Button colorScheme="teal" mr={3} onClick={closeModal}>  
              {t.auth.createAccountButton}  
            </Button>  
          </ModalFooter>  
        </ModalContent>  
      </Modal>  
    </Box>  
  );  
}  
