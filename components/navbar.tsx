'use client'

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
  useColorModeValue,
  Stack,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import supabase from '@/supabase/authTest'

interface User {
  email: string
  user_metadata: {
    name: string
    avatar_url: string
  }
}

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user as User | null)
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        {/* Botón hamburguesa para móviles */}
        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />

        {/* Logo y enlaces de navegación en desktop */}
        <Flex justifyContent="center" alignItems="center" display={{ base: "flex", md: 'flex', xl: 'flex'  }}> 
          <Link href="/" passHref>
            <Text fontSize="xl" fontWeight="bold">
              Take-It-easy-rentar
            </Text>
          </Link>
          </Flex>

           <Flex justifyContent="center">
    <HStack as={'nav'} spacing={8}  display={{ base: 'none', md: 'flex' }}>
      <Link href="/" passHref>
        <Text _hover={{ color: 'blue.500' }}>Inicio</Text>
      </Link>
      <Link href="/about" passHref>
        <Text _hover={{ color: 'blue.500' }}>Sobre Nosotros</Text>
      </Link>
      <Link href="/contact" passHref>
        <Text _hover={{ color: 'blue.500' }}>Contacto</Text>
      </Link>
    </HStack>
    
  </Flex>
       

        {/* Avatar y menú desplegable */}
        <Flex alignItems={'center'}>
          {user ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
              >
                <Avatar
                  size={'sm'}
                  src={user.user_metadata.avatar_url}
             
                />
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
            <Link href="/login" passHref>
              <Button colorScheme="teal" variant="outline">
                Iniciar sesión
              </Button>
            </Link>
          )}
        </Flex>
      </Flex>

      {/* Menú para móviles */}
      {isOpen ? (
        <Box pb={4}  display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            <Link href="/" passHref>
              <Text _hover={{ color: 'blue.500' }}>Inicio</Text>
            </Link>
            <Link href="/about" passHref>
              <Text _hover={{ color: 'blue.500' }}>Sobre Nosotros</Text>
            </Link>
            <Link href="/contact" passHref>
              <Text _hover={{ color: 'blue.500' }}>Contacto</Text>
            </Link>
          </Stack>
        </Box>
      ) : null}
    </Box>
  )
}
