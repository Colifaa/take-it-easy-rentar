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
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import Link from "next/link";
import supabase from "@/supabase/authTest";
import LoginForm from "../components/login";

interface User {
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

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user as User | null);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
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
          <Link href="/" passHref>
            <Text fontSize="xl" fontWeight="bold">
              Take-It-Easy-Rentar
            </Text>
          </Link>
        </Flex>

        <HStack as={"nav"} spacing={8} display={{ base: "none", md: "flex" }}>
          <Link href="/" passHref>
            <Text _hover={{ color: "blue.500" }}>Inicio</Text>
          </Link>
          <Link href="/about" passHref>
            <Text _hover={{ color: "blue.500" }}>Sobre Nosotros</Text>
          </Link>
          <Link href="/contact" passHref>
            <Text _hover={{ color: "blue.500" }}>Contacto</Text>
          </Link>
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
                <MenuItem>
                  <Text>Hola, {user.user_metadata.name}!</Text>
                </MenuItem>
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
            <Link href="/" passHref>
              <Text _hover={{ color: "blue.500" }}>Inicio</Text>
            </Link>
            <Link href="/about" passHref>
              <Text _hover={{ color: "blue.500" }}>Sobre Nosotros</Text>
            </Link>
            <Link href="/contact" passHref>
              <Text _hover={{ color: "blue.500" }}>Contacto</Text>
            </Link>
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
