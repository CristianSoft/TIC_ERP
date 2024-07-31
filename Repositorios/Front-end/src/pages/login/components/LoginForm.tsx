import { Box, Button, Flex, Heading, Link } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { FormField } from '../../../components/FormField';
import { LoginUser } from '../../../types/organizational-models';
import { loginUserSchema } from '../../../utils/admin-validations-helper';

interface LoginFormProps {
  onSubmit: (formData: LoginUser) => void;
}

export const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginUser>({
    resolver: yupResolver(loginUserSchema),
  });

  const onSubmitForm = (data: LoginUser) => {
    console.log(data);
    onSubmit(data);
  };

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px',
        borderColor: 'brand.blue',
        roundedBottomLeft: { sm: 'none', md: 'xl' },
        roundedTopLeft: 'xl',
        roundedTopRight: { sm: 'xl', md: 'none' },
        w: '400px',
        h: '480px',
        p: 'xl',
      }}
    >
      <Heading
        sx={{ textAlign: 'center', fontSize: 'heading.desktop.subtitle' }}
      >
        Inicio de sesión
      </Heading>
      <Flex
        sx={{
          width: '100%',
          flexDirection: 'column',
          textAlign: 'center',
          color: 'text.default',
          fontSize: 'text.md',
        }}
      >
        <Box>
          <FormField
            id="email"
            label="Correo Institucional"
            placeholder="Ingrese el correo institucional"
            type="email"
            register={register}
            errors={errors.email}
          />
          <FormField
            id="password"
            label="Contraseña"
            placeholder="Ingrese una contraseña"
            register={register}
            errors={errors.password}
            type="password"
            showPasswordToggle={true}
          />
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Link
            href="/cambiar-clave"
            sx={{ color: 'brand.blue', fontSize: 'text.sm' }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </Box>
      </Flex>
      <Flex sx={{ justifyContent: 'center' }}>
        <Button type="submit" onClick={handleSubmit(onSubmitForm)}>
          Ingresar
        </Button>
      </Flex>
    </Flex>
  );
};
