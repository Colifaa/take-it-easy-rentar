// components/AlertComponent.tsx
import { Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton } from '@chakra-ui/react';

interface AlertComponentProps {
  message: string;
}

const AlertComponent: React.FC<AlertComponentProps> = ({ message }) => {
  return (
    <Alert status="warning" variant="subtle" borderRadius="md">
      <AlertIcon />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default AlertComponent;
