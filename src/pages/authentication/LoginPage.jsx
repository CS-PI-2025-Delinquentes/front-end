import { Button, ButtonText, InputRoot, InputField, InputIcon, InputLabel, InputMessage } from "@/components";
import { Eye, EyeSlash, UserList, LockSimpleOpen } from "phosphor-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SectionBox } from "@/components";
import { CloudinaryImage } from "@/components/CloudinaryImage.jsx";
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { localStorageUtils } from "../../utils/localStorageUtils";
import AuthService from "../../services/AuthService";
import Cookies from 'js-cookie';
import { toast, Toaster } from "sonner";

export function LoginPage() {
  const [isWainting, setIsWainting] = useState(false);
  const navigate = useNavigate();
  const authService = new AuthService();
  const expirationDays = parseInt(import.meta.env.VITE_COOKIE_EXPIRATION_DAYS);
  
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, touchedFields }
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur"
  });

  const onSubmit = async (values) => {
    if (isWainting) return;
    setIsWainting(true);
    values.cpf_cnpj = values.cpf_cnpj.replace(/\D/g, '');
    localStorageUtils.setItem("login", values);
    await login(values);
  };

  const login = async (usuario) => {
    try {
      const resposta = await authService.login(JSON.stringify(usuario));
      if (resposta.status === 200 && resposta.data.token) {
        Cookies.set('token', resposta.data.token, { expires: expirationDays, path: '/' });
        navigate("/app/home");
      }
    } catch (error) {
      setIsWainting(false);
      toast.error(error.response.data.message);
      const message = error.response.data.message;
      setError("cpf_cnpj", { type: "server", message });
      setError("password", { type: "server", message });
    }
  }

  return (
    <>
      <SectionBox className="pt-0">
        <CloudinaryImage publicId="vfq6dw8u2de9vcybxvka" className="w-64 justify-self-center" />
        <h4 className="font-bold text-center py-7 cursor-default">Entre na sua conta</h4>
        <div className="flex flex-col">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <FormField
                register={register}
                name="cpf_cnpj"
                title="CPF ou CNPJ"
                placeholder="Digite seu CPF ou CNPJ"
                dirty={touchedFields.cpf_cnpj}
                error={errors.cpf_cnpj}
                onChangeMask={(v) => maskInput(v, "cpf_cnpj")}
                icon={UserList}
              />
            </div>
            <div>
              <FormField
                register={register}
                name="password"
                title="Senha"
                placeholder="Digite sua senha"
                error={errors.password}
                dirty={touchedFields.password}
                type="password"
                icon={LockSimpleOpen}
                autoComplete="password"
              />
              <p className="font-bold text-right cursor-pointer text-blue-tx">
                <Link to='/recuperar'>
                  <span className="text-sm">Esqueceu a senha?</span>
                </Link>
              </p>
            </div>
            <div className="pt-4 pb-10">
              <Button className={"bg-red-tx"} type="submit">
                <ButtonText className="text-center text-white">
                  Entrar
                </ButtonText>
              </Button>
            </div>
          </form>
          <div className="grid justify-items-center">
            <p className="text-center cursor-default">Não possui uma conta Teruel Exepress?</p>
            <Link to="/cadastro" className="text-red-tx font-bold">
              Crie uma agora
            </Link>
          </div>
        </div>
        <Toaster position="top-right" richColors />
      </SectionBox>
    </>
  );

}

function FormField({ title, placeholder, register, name, error, type = "text", icon: Icon, onChangeMask, autoComplete = "off" }) {
  let status;
  if (error) {
    status = error ? "error" : "default"
  }

  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <InputLabel>{title}</InputLabel>
      <InputRoot status={status}>
        <InputIcon>
          {Icon && <Icon className="icon" />}
        </InputIcon>
        <InputField
          autoComplete={autoComplete}
          placeholder={placeholder}
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          {...register(name, onChangeMask ? {
            onChange: (e) => {
              e.target.value = onChangeMask(e.target.value);
            }
          } : {})}
        />
        {type === "password" && (
          <InputIcon onClick={() => setShowPassword((v) => !v)} className="cursor-pointer">
            {showPassword ? <Eye className="icon" /> : <EyeSlash className="icon" />}
          </InputIcon>
        )}
      </InputRoot>
      <InputMessage className="text-danger-base">{error?.message}</InputMessage>
    </>
  )
}

function maskInput(value) {
  const onlyDigits = value.replace(/\D/g, '');

  if (onlyDigits.length <= 11) {
    // Máscara CPF: 000.000.000-00
    return onlyDigits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    // Máscara CNPJ: 00.000.000/0000-00
    return onlyDigits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  }
}

const loginSchema = z.object({
  cpf_cnpj: z
    .string()
    .nonempty("Campo obrigatório")
    .refine((val) => {
      const digits = val.replace(/\D/g, "");
      if (digits.length === 11) return cpf.isValid(digits);
      if (digits.length === 14) return cnpj.isValid(digits);
      return false;
    }, { message: "CPF ou CNPJ inválido" }),

  password: z
    .string()
    .nonempty("Campo obrigatório")
    .min(8, "Mínimo de 8 caracteres")
});