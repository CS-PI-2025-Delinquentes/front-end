import { Button, ButtonText, Image, InputRoot, InputField, InputIcon, InputLabel, InputMessage, SectionApp, Shape, AppHeader, ModalSm } from "@/components";
import { Eye, EyeSlash, UserList, LockSimpleOpen, CheckCircle, Star, Package, HouseLine, StarHalf, StarFour, FolderSimpleStar } from "phosphor-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { useNavigate } from 'react-router-dom';
import ReviewService from "../../../services/ReviewService";

export function Review() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { dirtyFields }
  } = useForm({
    mode: "onBlur"
  });

  const navigate = useNavigate();

  const reviewService = new ReviewService();

  const [isModalSmOpen, setIsModalSmOpen] = useState(false);
  const avaliacao = watch("avaliacao", "");
  const rating = watch('rating', 0);

  const handleCloseModalSm = () => {
    setIsModalSmOpen(false);
  }

  const onError = (errors) => {
    if (errors.rating) {
      toast.warning("Selecione entre 1 e 5 estrelas.");
    }
  };

  const onSubmit = async (values) => {
    try {
      const newReview = {
        nota: values.rating,
        descricao: values.avaliacao
      };

      await reviewService.insert(newReview);

      reset();
      setIsModalSmOpen(true);
    } catch (error) {
      toast.error("Erro ao enviar avaliação.");
      console.error("Erro ao salvar avaliação:", error);
    }
  };

  return (
    <>
      <SectionApp>
        <AppHeader screenTitle="Avaliar" />
        <Toaster richColors position="top-right" />
        <div className="max-w-sm sm:max-w-lg mx-auto mt-30" >
          <form onSubmit={handleSubmit(onSubmit, onError)} >
            <div className=" shadow-md p-4 rounded-2xl ">
              <div className="flex gap-2">
                <div className="w-16 h-16 rounded-full  bg-gray-50 flex items-center justify-center">
                </div>
                <div>
                  <FormField
                    register={register}
                    name="star"
                    title="Nome do cliente"
                    dirty={dirtyFields?.star}
                    rating={rating}
                    setValue={setValue}
                  />
                </div>
              </div>
              <div className="relative">
                <textarea
                  className="w-full h-auto text-lg bg-gray-50 rounded-2xl p-2 mt-4 overflow-hidden scrollbar-hidden overflow-y-auto resize-none gap-1 outline-blue-500"
                  maxLength={300}
                  placeholder="Digite sua avaliação aqui"
                  rows={6}
                  {...register("avaliacao")}
                ></textarea>
                <span className="absolute bottom-2 right-2 text-sm  text-gray-600 text-gray-500">
                  {avaliacao.length}/300
                </span>
              </div>

            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 sm:gap-4 sm:mt-4">
              <Link to="/app/home">
                <Button className={"bg-gray-50"} type="button" onClick={() => reset()}>
                  <ButtonText className="text-center ">
                    Cancelar
                  </ButtonText>
                </Button>
              </Link>
              <Button className={"bg-red-tx"} type="submit">
                <ButtonText className="text-center text-white">
                  Enviar
                </ButtonText>
              </Button>
            </div>
          </form>
          <ModalView open={isModalSmOpen} onClose={handleCloseModalSm} />

        </div>
      </SectionApp>
    </>
  );
}



function ModalView({ open, onClose }) {

  const navigate = useNavigate();

  return (
    <ModalSm open={open} onClose={onClose}>
      <CheckCircle className="icon size-36 text-success-light justify-self-center" weight="fill" />
      <h4 className="text-center text-lg font-semibold ">Avaliação enviada!</h4>
      <p className="text-center my-6">A Teruel Express agradece a sua avaliação!</p>
      <div className="flex flex-col gap-2">
        <Button
          variant="secondary"
          onClick={() => {
            onClose();
            navigate("/app/home");
          }}
        >
          <ButtonText className="text-center">Fechar</ButtonText>
        </Button>
      </div>
    </ModalSm>
  )
}

function FormField({ title, error, dirty, rating, register, setValue, autoComplete = "off" }) {
  let status;
  if (dirty) {
    status = error ? "error" : "default"
  }


  return (
    <>
      <InputLabel className="text-base">{title}</InputLabel>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} onClick={() => setValue('rating', star)} className="cursor-pointer transition">
            {star <= rating ? (
              <StarFull />
            ) : (
              <Star className="text-gray-100 icon" />
            )}
          </span>
        ))}
      </div>
      <InputRoot status={status} className="hidden border-0">
        <InputField
          autoComplete={autoComplete}
          type="hidden" {...register('rating', { required: true })}
        />
      </InputRoot>
    </>
  )
}

function StarFull() {
  return (
    <div className="relative w-6 sm:w-8" >
      <Star className="absolute inset-0 text-star icon" weight="fill" />
      <Star className="absolute inset-0 text-star-border icon" weight="regular" />
    </div>
  )
}
