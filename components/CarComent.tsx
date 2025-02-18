import { Box } from "@chakra-ui/react";
import { CommentForm } from "./CommentForm";


export const CarComent = () => {
  return (
    <Box
      position="relative"
      w="full"
      maxW="5xl"
      minH="400px"
      mx="auto"
      mt={["8", "12", "16"]}
      p={["0", "6", "8"]}
      overflow="hidden"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
     
     
      _hover={{
        transform: "translateY(-2px)",
        boxShadow: "0 12px 40px 0 rgba(31, 38, 135, 0.2)"
      }}
      transition="all 0.3s ease-in-out"
    >
    
    

      {/* Content container */}
      <Box
        position="relative"
        zIndex="1"
        width="100%"
        height="100%"
      >
        <CommentForm />
      </Box>
    </Box>
  );
};