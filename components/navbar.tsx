"use client"

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
import { useState, useEffect } from "react";
import supabase from "@/supabase/authTest";
import LoginForm from "../components/login";

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
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false); // Nuevo estado para verificar si es admin

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user as User | null);

      if (user) {
        // Verificar si el usuario es admin
        const { data, error } = await supabase
          .from("user_roles")
          .select("role_id")
          .eq("user_id", user.id)
          .single(); // Asumimos que un usuario tiene solo un rol

        if (data && data.role_id === 1) {
          setIsAdmin(true); // Cambiar el estado si es admin
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
    <Box bg="gray.100" px={4}>
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
            <Text fontSize="xl" fontWeight="bold">
              Take-It-Easy
            </Text>
          </ChakraLink>
        </Flex>

        <HStack as={"nav"} spacing={8} display={{ base: "none", md: "flex" }}>
          <ChakraLink href="/" textDecoration="none" _hover={{ color: "blue.500" }}>
            Inicio
          </ChakraLink>
          <ChakraLink href="/about" textDecoration="none" _hover={{ color: "blue.500" }}>
            Sobre Nosotros
          </ChakraLink>
          <ChakraLink href="/contact" textDecoration="none" _hover={{ color: "blue.500" }}>
            Contacto
          </ChakraLink>
        </HStack>

        <Flex alignItems={"center"}>
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
                  <Text>Hola, {user.user_metadata.name}!</Text>
                </MenuItem>
                <MenuDivider />
                {isAdmin && ( // Verificar si es admin
                  <MenuItem>
                    <ChakraLink href="/dashboard" textDecoration="none">
                      Dashboard
                    </ChakraLink>
                  </MenuItem>
                )}
                <MenuDivider />
                <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button colorScheme="teal" variant="outline" onClick={openModal}>
              Iniciar sesión
            </Button>
          )}
        </Flex>
      </Flex>

      {isOpen && (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as={"nav"} spacing={4}>
            <ChakraLink href="/" textDecoration="none" _hover={{ color: "blue.500" }}>
              Inicio
            </ChakraLink>
            <ChakraLink href="/about" textDecoration="none" _hover={{ color: "blue.500" }}>
              Sobre Nosotros
            </ChakraLink>
            <ChakraLink href="/contact" textDecoration="none" _hover={{ color: "blue.500" }}>
              Contacto
            </ChakraLink>
          </Stack>
        </Box>
      )}

      {/* Modal para Iniciar Sesión */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Iniciar Sesión</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <LoginForm />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeModal}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
