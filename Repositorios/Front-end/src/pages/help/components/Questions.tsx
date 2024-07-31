import { Flex, Box, Text, Image, Heading } from '@chakra-ui/react';

interface Props {
  question: string;
  text?: string;
  image?: string;
  video?: string;
}

export const Questions = ({ question, text, image, video }: Props) => {
  return (
    <Flex sx={{ flexDirection: 'column', gap: 'md' }}>
      <Flex sx={{ flexDirection: 'column', gap: 'sm' }}>
        {question ? (
          <Heading sx={{ fontSize: 'text.lg', textColor: 'brand.blue' }}>
            {question}
          </Heading>
        ) : null}
        {text ? (
          <Text sx={{ textColor: 'text.default', textAlign: 'justify' }}>
            {text}
          </Text>
        ) : null}
        {image ? <Image src={image} alt="" /> : null}
        {/*{video ? (
          <Box sx={{ my: 'sm', mx: 'auto' }}>
            <video controls autoPlay muted src={video}></video>
          </Box>
        ) : null}*/
        }
      </Flex>
    </Flex>
  );
};
