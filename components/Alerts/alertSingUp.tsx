"use client";

import { Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton, Box } from '@chakra-ui/react';
import { memo } from 'react';

interface AlertProps {
  message: string;
  type?: 'success' | 'error' | 'warning';
  onClose?: () => void;
}

const getAlertStyles = (type: AlertProps['type']) => {
  switch (type) {
    case 'success':
      return {
        bg: 'white',
        borderColor: '#009688',
        color: '#009688',
        icon: '✅',
        title: 'Éxito'
      };
    case 'error':
      return {
        bg: 'white',
        borderColor: '#CB9A99',
        color: '#CB9A99',
        icon: '❌',
        title: 'Error'
      };
    case 'warning':
      return {
        bg: 'white',
        borderColor: '#FFA500',
        color: '#FFA500',
        icon: '⚠️',
        title: 'Advertencia'
      };
    default:
      return {
        bg: 'white',
        borderColor: '#009688',
        color: '#009688',
        icon: 'ℹ️',
        title: 'Información'
      };
  }
};

const Alert1 = memo(({ message, type = 'success', onClose }: AlertProps) => {
  const styles = getAlertStyles(type);

  return (
    <Box
      position="fixed"
      top="20px"
      left="50%"
      transform="translateX(-50%)"
      zIndex={1000}
      width="90%"
      maxW="500px"
      transition="all 0.3s ease"
      _hover={{ transform: 'translateX(-50%) scale(1.02)' }}
    >
      <Alert
        status={type}
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        borderRadius="lg"
        boxShadow="xl"
        p={4}
        bg={styles.bg}
        borderLeft="4px solid"
        borderColor={styles.borderColor}
        color={styles.color}
      >
        <AlertIcon boxSize="24px" mr={0} />
        <AlertTitle mt={4} mb={2} fontSize="lg">
          {styles.title}
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          {message}
        </AlertDescription>
        {onClose && (
          <CloseButton
            position="absolute"
            right="8px"
            top="8px"
            onClick={onClose}
            _hover={{ bg: 'transparent', color: styles.color }}
          />
        )}
      </Alert>
    </Box>
  );
});

Alert1.displayName = 'Alert1';

export default Alert1;
