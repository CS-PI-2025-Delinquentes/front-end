import { Button, ButtonText, InputRoot, InputField, InputIcon, InputLabel, InputMessage } from "@/components";
import { Eye, EyeSlash } from "phosphor-react";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { SectionBox } from "@/components";
import { CloudinaryImage } from "@/components/CloudinaryImage.jsx";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import RecoverService from "../../services/RecoverService";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { z } from "zod";

export function Recover() {

  const [showCodeScreen, setShowCodeScreen] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [email, setEmail] = useState("");

  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: zodResolver(recoverSchema),
    mode: "onBlur"
  });

  const recoverService = new RecoverService()

  const gerarCodigo = async (emailToSend) => {
    try {
      setIsWaiting(true);
      await recoverService.gerarCodigo(emailToSend);
      toast.success("Código enviado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Erro ao enviar código");
      throw error;
    } finally {
      setIsWaiting(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await gerarCodigo(data.email);
      setEmail(data.email);
      setShowCodeScreen(true);
    } catch (error) {
      const message = error.response?.data?.message || "Não foi posivel gerar o codigo";
      setError("email", { type: "server", message });
    }
  };

  return (
    <>
      {showCodeScreen ? (
        <Code email={email} onBackToEmail={() => setShowCodeScreen(false)} onResendCode={gerarCodigo} />
      ) : (
        <SectionBox className="pt-0">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CloudinaryImage publicId="vfq6dw8u2de9vcybxvka" className="w-64 justify-self-center" />
            <h4 className="font-bold text-center py-7 cursor-default">Recupere sua conta</h4>
            <div className="flex flex-col mt-6">
              <InputLabel>Email</InputLabel>
              <InputRoot>
                <InputField
                  placeholder="Digite seu email" {...register("email")} />
              </InputRoot>
              <InputMessage className="text-danger-base">{errors.email?.message}</InputMessage>
              <Button type="submit" className={`text-center mt-4 ${isWaiting ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-tx cursor-pointer'}`} disabled={isWaiting}>
                <ButtonText className="text-white text-center">
                  {isWaiting ? "Enviando..." : "Enviar código"}
                </ButtonText>
              </Button>
            </div>
          </form>
        </SectionBox>
      )}
    </>
  );

}

function Code({ email, onBackToEmail, onResendCode }) {
  const { control, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: zodResolver(codeSchema),
    mode: "onBlur"
  });

  const [isWaiting, setIsWaiting] = useState(false);
  const [showPasswordScreen, setShowPasswordScreen] = useState(false);
  const [validatedCode, setValidatedCode] = useState("");

  const recoverService = new RecoverService()

  const onSubmitCode = async (data) => {
    try {
      setIsWaiting(true);
      const code = {
        code: data.code,
      };
      await recoverService.validarCodigo(email, code.code);
      setValidatedCode(code.code);
      setShowPasswordScreen(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao validar código");
      const message = error.response?.data?.message || "Código inválido";
      setError("code", { type: "server", message });
    } finally {
      setIsWaiting(false);
    }
  };

  return (
    <>
      {showPasswordScreen ? (
        <PasswordScreen email={email} code={validatedCode} />
      ) : (
        <SectionBox className="pt-0">
          <form onSubmit={handleSubmit(onSubmitCode)} noValidate>
            <CloudinaryImage publicId="vfq6dw8u2de9vcybxvka" className="w-64 justify-self-center" />
            <h4 className="font-bold text-center py-7 cursor-default">Recupere sua conta</h4>
            <div className="flex flex-col items-center">
              <div className="flex flex-col ">
                <InputLabel className=" text-left">Código</InputLabel>
                <Controller
                  name="code"
                  control={control}
                  render={({ field }) => (
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot index={1} />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator className="invisible" />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot index={4} />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  )} />
                <InputMessage className="text-danger-base">{errors.code?.message}</InputMessage>
                <Countdown email={email} onResendCode={onResendCode} />
                <Button type="submit" className={`text-center ${isWaiting ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-tx cursor-pointer'}`} disabled={isWaiting}>
                  <ButtonText className="text-white text-center">
                    {isWaiting ? "Confirmando..." : "Confirmar"}
                  </ButtonText>
                </Button>
                <p className="text-center leading-none"><span className="text-sm">Código enviado para</span><br />
                  <span className="text-xs ">{email}</span></p>
                <p className="text-center mt-1 cursor-pointer"
                  onClick={onBackToEmail}
                >
                  <span className="text-base font-bold">Mudar email</span>
                </p>
              </div>
            </div>
          </form>

        </SectionBox>
      )}
    </>
  );
}

function PasswordScreen({ email, code }) {
  const navigate = useNavigate();
  const [isWaiting, setIsWaiting] = useState(false);
  const { handleSubmit, register, formState: { errors }, setError } = useForm({
    resolver: zodResolver(passwordSchema),
    mode: "onBlur"
  });

  const recoverService = new RecoverService()

  const onSubmitPassword = async (data) => {
    try {
      setIsWaiting(true);
      await recoverService.atualizarSenha(email, code, data.password);
      toast.success("Senha atualizada com sucesso! Redirecionando para login...");

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao atualizar senha");
      const message = error.response?.data?.message || "Erro";
      setError("password", { type: "server", message });
    } finally {
      setIsWaiting(false);
    }
  };
  return (
    <>
      <SectionBox className="pt-0">
        <form onSubmit={handleSubmit(onSubmitPassword)} noValidate>
          <CloudinaryImage publicId="vfq6dw8u2de9vcybxvka" className="w-64 justify-self-center" />
          <h4 className="font-bold text-center py-7 cursor-default">Recupere sua conta</h4>
          <div className="mb-3 mt-5">
            <FormField
              register={register}
              name="password"
              title="Nova senha"
              type="password"
              error={errors.password}
            />
          </div>
          <div className="mb-4">
            <FormField
              register={register}
              name="newPassword"
              title="Confirmar nova senha"
              type="password"
              error={errors.newPassword}
            />
          </div>

          <Button type="submit" className={`text-center ${isWaiting ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-tx cursor-pointer'}`} disabled={isWaiting}>
            <ButtonText className="text-white text-center">
              {isWaiting ? "Salvando..." : "Salvar"}
            </ButtonText>
          </Button>

        </form>
      </SectionBox>
    </>
  )
}

const Countdown = ({ email, onResendCode }) => {
  const [seconds, setSeconds] = useState(60);
  const [isActive, setIsActive] = useState(true);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const handleResend = async () => {
    try {
      setIsResending(true);
      await onResendCode(email);
      setSeconds(60);
      setIsActive(true);
    } catch (error) {
      console.error("Erro ao reenviar código:", error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <p
      className={`text-center font-bold my-2  ${seconds === 0 && !isResending ? "cursor-pointer" : ""}`}
      onClick={seconds === 0 && !isResending ? handleResend : null}
    ><span className="text-base">
        {isResending ? "Enviando..." : (seconds === 0 ? "Reenviar código" : `Enviar código novamente (${seconds}s)`)}
      </span>
    </p>
  );
};


function FormField({ title, placeholder, register, name, error, dirty, type = "text", icon: Icon, onChangeMask, autoComplete = "off" }) {
  let status;
  if (dirty) {
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

const recoverSchema = z.object({
  email: z
    .string()
    .nonempty("O campo de email não pode ser vazio.")
    .email("Por favor, digite um email válido."),
});

const codeSchema = z.object({
  code: z
    .string()
    .nonempty("O campo não pode ser vazio.")
    .length(6, "Por favor, preencha todos os 6 dígitos."),
});

const passwordSchema = z.object({
  password: z
    .string()
    .nonempty("Campo obrigatório")
    .min(8, "Mínimo de 8 caracteres")
    .refine((val) => /[A-Z]/.test(val), { message: "Deve conter ao menos 1 letra maiúscula" })
    .refine((val) => /[0-9]/.test(val), { message: "Deve conter ao menos 1 número" })
    .refine((val) => /[@#$?]/.test(val), { message: "Deve conter ao menos 1 caractere especial (@, #, $, ?)" }),
  newPassword: z.string().nonempty("Campo obrigatório"),
}).refine((data) => data.password === data.newPassword, {
  message: "As senhas não coincidem",
  path: ["newPassword"],
});