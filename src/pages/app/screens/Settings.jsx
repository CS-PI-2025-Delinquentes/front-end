import { Button, ButtonText, InputRoot, InputField, InputIcon, InputLabel, InputMessage, AppHeader,SectionApp } from "@/components";
import { CheckCircle, Pencil, FloppyDiskBack, LockKeyOpen } from "phosphor-react";
import { useState } from "react";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function Settings() {

  const {
          register,
          handleSubmit,
          formState: { errors, touchedFields }
      } = useForm({
          resolver: zodResolver(schemaEditData),
          mode: "onBlur",
          defaultValues: {
            name: "João Silva", 
            email: "joao@email.com", 
            phone: "(11) 9 8765-4321" 
          }
      });

  const {
          register: registerPassword,
          handleSubmit: handleSubmitPassword,
          reset: resetPassword,
          formState: { errors: errorsPassword, touchedFields: touchedFieldsPassword }
      } = useForm({
          resolver: zodResolver(schemaPassword),
          mode: "onBlur"
      });

  const [isEditingData, setisEditingData]= useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const onSubmitEdit = (data) => {
    localStorage.setItem("user-data", JSON.stringify(data))
    setisEditingData(false)
    toast.success("Cadastro atualizado!")
  };

  const onSubmitPassword = (data) => {
    localStorage.setItem("pass", JSON.stringify(data))
    setIsEditingPassword(false);
    resetPassword(); 
    toast.success("Senha atualizada!")
  };

  return (
    <>
      <SectionApp>
            <AppHeader screenTitle="Configurações"/>
            <div className=" lg:max-w-3xl mx-auto mt-4">
            <div>
            <div className="flex items-center">
              <div className=" w-18 h-18 rounded-full  bg-gray-50 flex items-center justify-center text-center mr-3">
                <Pencil size={42} />
              </div>
              
              <div className="flex flex-col">
                <span className="font-bold text-base md:text-xl">Nome do cliente</span>
                <span className="font-bold -mt-1 text-xs sm:text-sm">Pessoa física</span>
                <span className="text-base -mt-1 md:text-xl">000.000.000-00</span>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border rounded-2xl border-gray-600 mt-4 p-3 w-full">
              <form onSubmit={handleSubmit(onSubmitEdit)} className="m-2 ">
                <h5 className="font-bold text-2xl">Dados da conta</h5>
                  <FormField
                    readOnly={!isEditingData}
                    register={register}
                    name={"name"}
                    title="Nome"
                    placeholder="Digite seu nome"
                    error={errors.name}
                    dirty={touchedFields.cep}
                    type="text"
                  />
                  <FormField
                    readOnly={!isEditingData}
                    register={register}
                    name={"email"}
                    title="Email"
                    placeholder="Digite seu email"
                    error={errors.email}
                    dirty={touchedFields.cep}
                    type="email"
                  />
                  <FormField
                    readOnly={!isEditingData}
                    register={register}
                    name={"phone"}
                    title="Telefone"
                    placeholder="Digite seu número"
                    error={errors.phone}
                    dirty={touchedFields.cep}
                    type="text"
                    onChangeMask={(v) => maskInputPhone(v)}
                  />
                    <Button type="submit" variant="complementary" className={`ml-auto w-auto mt-3 ${!isEditingData && "hidden"}`}>
                      <FloppyDiskBack className="icon " />
                      <ButtonText >
                          Salvar
                      </ButtonText>
                    </Button>       
                    <Button type="button" variant="complementary" className={`ml-auto w-auto mt-3 ${isEditingData && "hidden"}`} onClick={() => setisEditingData(true)}>
                      <Pencil className="icon " /> 
                      <ButtonText >
                          Editar
                      </ButtonText>
                    </Button>
              </form>
            </div>
            <div className="border rounded-2xl border-gray-600 mt-4 w-full p-3">
              <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="m-2 ">
                <h5 className="font-bold text-2xl">Senha</h5>
                  <FormField
                    readOnly={!isEditingPassword}
                    register={registerPassword}
                    name={"currentPassword"}
                    title="Senha atual"
                    placeholder="Digite sua senha atual"
                    error={errorsPassword.currentPassword}
                    dirty={touchedFieldsPassword.currentPassword}
                    type="password"
                  />
                  <FormField
                    readOnly={!isEditingPassword}
                    register={registerPassword}
                    name={"password"}
                    title="Nova senha"
                    placeholder="Digite sua nova senha"
                    error={errorsPassword.password}
                    dirty={touchedFieldsPassword.password}
                    type="password"
                  />
                  <FormField
                    readOnly={!isEditingPassword}
                    register={registerPassword}
                    name={"confirmPassword"}
                    title="Confirmar nova senha"
                    placeholder="Confirme sua nova senha"
                    error={errorsPassword.confirmPassword}
                    dirty={touchedFieldsPassword.confirmPassword}
                    type="password"
                  />
                    <Button type="submit" variant="complementary" className={`ml-auto w-auto mt-3 ${!isEditingPassword && "hidden"}`}>
                      <FloppyDiskBack className="icon " />
                      <ButtonText >
                          Salvar
                      </ButtonText>
                    </Button>       
                    <Button type="button" variant="complementary" className={`ml-auto w-auto mt-3 ${isEditingPassword && "hidden"}`} onClick={() => setIsEditingPassword(true)}>
                      <LockKeyOpen className="icon " /> 
                      <ButtonText >
                          Alterar senha
                      </ButtonText>
                    </Button>
              </form>
            </div>
            </div> 
            </div>
            </div>

      </SectionApp>
    </>
  );
}

const schemaEditData = z.object({
  name: z.string().nonempty("O nome é obrigatório"),
  email: z
    .string()
    .email("Email inválido"),
  phone: z
    .string()
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => val.length === 10 || val.length === 11, { message: "Telefone inválido" }),
});

const schemaPassword = z.object({
  currentPassword: z.string().nonempty("Campo obrigatório"),
  password: z
    .string()
    .min(1, "Campo obrigatório")
    .min(8, "Mínimo de 8 caracteres")
    .refine((val) => /[A-Z]/.test(val), { message: "Deve conter 1 letra maiúscula" })
    .refine((val) => /[0-9]/.test(val), { message: "Deve conter 1 número" })
    .refine((val) => /[@#$?]/.test(val), { message: "Deve conter 1 caractere especial" }),
  confirmPassword: z.string().nonempty("Campo obrigatório"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});


function maskInputPhone(value) {
  const onlyDigits = value.replace(/\D/g, '');

    if (onlyDigits.length > 10) {
      return onlyDigits
        .replace(/^(\d{2})(\d{1})(\d{4})(\d{4}).*/, '($1) $2 $3-$4')
        .replace(/^(\d{2})(\d{1})(\d{4})(\d{0,4})/, '($1) $2 $3-$4');
    }

    return onlyDigits
      .replace(/^(\d{2})(\d{4})(\d{4}).*/, '($1) $2-$3')
      .replace(/^(\d{2})(\d{0,4})(\d{0,4})/, (match, ddd, first, last) => {
        if (!first) return ddd ? `(${ddd}` : '';
        if (!last) return `(${ddd}) ${first}`;
        return `(${ddd}) ${first}-${last}`;
      });
}

function FormField({ title, placeholder="", register, name, error, dirty, type = "text", onChangeMask, readOnly=false }) {
    console.log(`FormField ${name} - readOnly:`, readOnly); // Debug
    
    let status;
    if (dirty) {
        status = error ? "error" : "validated"
    }

    return (
        <>
            <InputLabel className="pt-4">{title}</InputLabel>
            <InputRoot
              status={status}
              className={readOnly ? "bg-gray-50 pointer-events-none" : ""}
            >
              <InputField
                readOnly={readOnly}
                disabled={readOnly}
                placeholder={placeholder}
                type={type}
                {...register(name, onChangeMask ? {
                  onChange: (e) => {
                    e.target.value = onChangeMask(e.target.value);
                  }
                } : {})}
              />
              {status === "validated" && (
                <InputIcon>
                  <CheckCircle size={32} className="text-success-base" />
                </InputIcon>
              )}
            </InputRoot>

            <InputMessage className="text-danger-base">{error?.message}</InputMessage>
        </>
    );
}
