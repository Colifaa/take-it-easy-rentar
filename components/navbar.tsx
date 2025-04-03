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
  useDisclosure,
  useColorModeValue,
  Select
} from "@chakra-ui/react";  
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";  
import { useState, useEffect, useMemo, useCallback } from "react";  
import supabase from "@/supabase/authTest";  
import LoginForm from "../components/login";  
import { useLanguage } from "../hooks/use-language";  
import { languages } from "../lib/languages";  
import MusicPlayer from "./MusicPlayer";
import { FaFlag } from "react-icons/fa";
import { GiUsaFlag } from "react-icons/gi";
import { BsFlagFill } from "react-icons/bs";
import { MdFlag } from "react-icons/md";
import { TbFlag3Filled } from "react-icons/tb";
import { RiFlag2Fill, RiFlagFill } from "react-icons/ri";

interface User {  
  id: string;  
  email: string;  
  user_metadata: { name: string; avatar_url: string };  
}

const extractUsername = (email: string) => email.split('@')[0];

export default function Navbar() {  
  const { isOpen, onOpen, onClose } = useDisclosure();  
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();  
  const [user, setUser] = useState<User | null>(null);  
  const [isAdmin, setIsAdmin] = useState(false);  
  const { language, setLanguage } = useLanguage();  
  const t = languages[language];

  const bgColor = useColorModeValue("#CB9A99", "#8B5E5E");
  const textColor = useColorModeValue("gray.800", "white");
  const hoverColor = useColorModeValue("#009688", "#00B4A6");

  const fetchUser = useCallback(async () => {  
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
  }, []);  

  useEffect(() => {  
    fetchUser();  
  }, [fetchUser]);  

  const handleLogout = useCallback(async () => {  
    await supabase.auth.signOut();  
    setUser(null);  
    setIsAdmin(false);  
    window.location.reload();
  }, []);  

  const menuItems = useMemo(() => [  
    { label: t.navbar.home, href: "/" },  
    { label: t.navbar.about, href: "/about" },  
    { label: t.navbar.contact, href: "/contact" },  
  ], [t]);  

  const getFlag = () => {
    switch (language) {
      case 'es':
        return '/flags/es.svg';
      case 'en':
        return '/flags/en.svg';
      default:
        return '/flags/es.svg';
    }
  };

  return (  
    <Box 
      bg={bgColor}
      px={4} 
      boxShadow="xl"
      position="sticky"
      top={0}
      zIndex={1000}
      backdropFilter="blur(10px)"
      bgGradient="linear(to-r, #CB9A99, #D4A5A5)"
    > 
      <Flex h={20} alignItems="center" justifyContent="space-between" maxW="1200px" mx="auto">  
        <IconButton  
          size="md"  
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}  
          aria-label="Open Menu"  
          display={{ md: "none" }}  
          onClick={isOpen ? onClose : onOpen}  
          color={textColor}
          variant="ghost"
          _hover={{ bg: "rgba(255,255,255,0.1)" }}
        />  

        <ChakraLink href="/">  
          <Image 
            src="/logo.png" 
            alt="Logo" 
            boxSize="120px" 
            objectFit="contain"
            transition="all 0.3s ease"
            _hover={{ transform: "scale(1.05)" }}
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
          />  
        </ChakraLink>  

        <HStack as="nav" spacing={8} display={{ base: "none", md: "flex" }}>  
          {menuItems.map((item) => (  
            <ChakraLink  
              key={item.href}  
              href={item.href}  
              fontWeight="bold"
              color={textColor}  
              fontSize="lg"
              _hover={{ color: hoverColor, textDecoration: "underline" }}
              transition="all 0.3s ease"
            >  
              {item.label}  
            </ChakraLink>  
          ))}  
        </HStack>  

        <HStack spacing={4}>
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              size="sm"
              color={textColor}
              fontWeight="bold"
              _hover={{ bg: "rgba(255,255,255,0.1)" }}
              transition="all 0.3s ease"
              p={0}
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="none"
              bg="transparent"
            >
              <Image
                src={language === 'es' ? "/flags/esp.jpg" : "/flags/eng.jpg"}
                alt={language === 'es' ? "Español" : "English"}
                boxSize="32px"
                transition="all 0.3s ease"
                _hover={{ transform: "scale(1.1)" }}
                borderRadius="md"
                objectFit="cover"
              />
            </MenuButton>
            <MenuList bg={bgColor} borderColor={hoverColor}>
              <MenuItem 
                onClick={() => setLanguage('es')}
                fontWeight="bold"
                color={textColor}
                _hover={{ bg: "rgba(255,255,255,0.1)" }}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Image
                  src="/flags/esp.jpg"
                  alt="Español"
                  boxSize="24px"
                  borderRadius="md"
                  objectFit="cover"
                />
                Español
              </MenuItem>
              <MenuItem 
                onClick={() => setLanguage('en')}
                fontWeight="bold"
                color={textColor}
                _hover={{ bg: "rgba(255,255,255,0.1)" }}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Image
                  src="/flags/eng.jpg"
                  alt="English"
                  boxSize="24px"
                  borderRadius="md"
                  objectFit="cover"
                />
                English
              </MenuItem>
            </MenuList>
          </Menu>

          {user ? (  
            <Menu>  
              <MenuButton 
                as={Button} 
                rounded="full" 
                variant="link" 
                cursor="pointer" 
                minW={0}
                _hover={{ transform: "scale(1.1)" }}
                transition="transform 0.3s ease"
              >  
                <Avatar 
                  size="sm" 
                  src={user.user_metadata.avatar_url}
                  name={extractUsername(user.email)}
                  border="2px solid"
                  borderColor={hoverColor}
                />  
              </MenuButton>  
              <MenuList bg={bgColor} borderColor={hoverColor}>
                <MenuItem fontWeight="bold" color={textColor}>
                  {t.auth.welcome}, {extractUsername(user.email)}!
                </MenuItem>  
                {isAdmin && (  
                  <MenuItem>  
                    <ChakraLink 
                      href="/dashboard" 
                      textDecoration="none" 
                      fontWeight="bold" 
                      color={hoverColor}
                      _hover={{ color: "teal.600" }}
                    >  
                      {t.navbar.dashboard}  
                    </ChakraLink>  
                  </MenuItem>  
                )}  
                <MenuItem 
                  fontWeight="bold" 
                  onClick={handleLogout}
                  _hover={{ bg: "red.50", color: "red.500" }}
                >
                  {t.navbar.logout}
                </MenuItem>  
              </MenuList>  
            </Menu>  
          ) : (  
            <Button  
              bg={hoverColor}
              color="white"  
              fontWeight="bold"
              _hover={{ 
                bg: "transparent", 
                color: hoverColor, 
                border: `2px solid ${hoverColor}`,
                transform: "translateY(-2px)",
                boxShadow: "lg"
              }}
              transition="all 0.3s ease"
              onClick={openModal}
              px={6}
            >  
              {t.navbar.login}  
            </Button>  
          )}  
        </HStack>  
      </Flex>  

      {isOpen && (  
        <Box pb={4} display={{ md: "none" }}>  
          <Stack as="nav" spacing={4}>  
            {menuItems.map((item) => (  
              <ChakraLink  
                key={item.href}  
                href={item.href}  
                fontWeight="bold"
                color={textColor}  
                fontSize="lg"
                _hover={{ color: hoverColor, textDecoration: "underline" }}
                transition="all 0.3s ease"
                px={4}
                py={2}
              >  
                {item.label}  
              </ChakraLink>  
            ))}  
          </Stack>  
        </Box>  
      )}  

      <Modal size="full" isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent position="relative" bg="transparent" overflow="hidden">
          <ModalHeader color="white">{t.auth.loginMessage}</ModalHeader>
          <ModalCloseButton 
            color="white" 
            _hover={{ bg: hoverColor, color: "white" }} 
          />
          <ModalBody>
            <LoginForm />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>  
  );  
}  
