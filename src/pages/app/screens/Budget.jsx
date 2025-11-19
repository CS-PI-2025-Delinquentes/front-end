import { Button, ButtonText, InputRoot, InputField, InputIcon, InputLabel, InputMessage, AppHeader, SectionApp, Shape, ModalConfirm, ModalSm } from "@/components";
import { CheckCircle, Package, HouseLine, ToteSimple, File, CaretRight, CaretDown, Plus, Minus, Info } from "phosphor-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from "react-router-dom";
import { fetchCep } from "@/services/cep";
import BudgetService from "@/services/BudgetService";
import { toast } from "sonner";

export function Budget() {
    const [showDetails, setShowDetails] = useState(false);
    const [packages, setPackages] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const [isEmptyListModalVisible, setIsEmptyListModalVisible] = useState(false);
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [packageToDelete, setPackageToDelete] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const budgetService = new BudgetService();

    useEffect(() => {
        fetch('https://raw.githubusercontent.com/CS-PI-2025-Delinquentes/json-end/refs/heads/main/cities.json')
            .then(res => res.json())
            .then(citiesData => {
                setCityList(citiesData);
            });
    }, []);

    const toggleDetails = () => {
        setShowDetails((prev) => !prev);
    };

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        setError,
        clearErrors,
        reset,
        formState: { errors, touchedFields, isValid }
    } = useForm({
        resolver: zodResolver(generalSchema(cityList)),
        mode: "onBlur"
    });

    const handleIncreaseAmount = (index) => {
        const updatedPackages = [...packages];
        updatedPackages[index].amount = (updatedPackages[index].amount || 1) + 1;
        setPackages(updatedPackages);
    };

    const handleDecreaseAmount = (index) => {
        const updatedPackages = [...packages];
        updatedPackages[index].amount = (updatedPackages[index].amount || 1) - 1;

        if (updatedPackages[index].amount < 1) {
            setPackageToDelete(index);
            setIsDeleteModalVisible(true);
        } else {
            setPackages(updatedPackages);
        }
    };

    const confirmDeletePackage = () => {
        const updatedPackages = packages.filter((_, index) => index !== packageToDelete);
        setPackages(updatedPackages);
        setIsDeleteModalVisible(false);
        setPackageToDelete(null);
    };

    const handleCancelDelete = () => {
        setIsDeleteModalVisible(false);
        setPackageToDelete(null);
    };

    const handleSubmitOrder = async () => {
        const lastPackage = packages[packages.length - 1];

        const finalJson = {
            addressOrigin: lastPackage.origin,
            addressDestiny: lastPackage.destination,
            listPackages: packages.map((pkg) => ({
                width: pkg.width || 0,
                height: pkg.height || 0,
                length: pkg.length || 0,
                weight: pkg.weight || 0,
                loadType: pkg.loadType?.toUpperCase(),
                amount: pkg.amount || 1,
            })),
        };

        try {
            setIsSubmitting(true);
            console.log("JSON enviado:", finalJson);
            await budgetService.create(finalJson);
            toast.success("Solicitação de orçamento enviada com sucesso!");
            setIsSuccessModalVisible(true);
            setPackages([]);
            reset();
        } catch (error) {
            console.error("Erro ao enviar solicitação:", error);
            toast.error(error.response?.data?.message || "Erro ao enviar solicitação de orçamento");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddPackage = (e) => {
        e.preventDefault();
        if (!isValid) {
            setIsAlertModalVisible(true);
            return;
        }
        handleSubmit((formData) => {
            const updatedOrders = [...packages, formData];
            setPackages(updatedOrders);
            resetPackageDimensions();
        })();
    };

    const handleSend = (e) => {
        e.preventDefault();

        if (packages.length === 0) {
            setIsEmptyListModalVisible(true);
            return;
        }

        setIsConfirmationModalVisible(true);
    };

    const handleConfirmSend = async () => {
        setIsConfirmationModalVisible(false);
        await handleSubmitOrder();
    };

    const resetPackageDimensions = () => {
        setValue("loadType", "");
        setValue("width", "");
        setValue("height", "");
        setValue("length", "");
        setValue("weight", "");
        touchedFields.height = null;
        touchedFields.weight = null;
        touchedFields.width = null;
        touchedFields.length = null;
    };

    const handleCancel = () => {
        setIsCancelModalVisible(true);
    };

    const confirmCancel = () => {
        setIsCancelModalVisible(false);
        window.location.href = "/app/home";
    };

    return (
        <>
            <SectionApp className="xl:grid grid-cols-2">
                <AppHeader screenTitle="Orçamento" />
                <p className="pb-4 grid col-span-2 pt-4">Preencha o formulário a seguir para solicitar um orçamento para seu frete.</p>
                <form className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:col-span-2">
                    <Shape className="border border-gray-600">
                        <h4 className="pb-2">Endereço origem</h4>
                        <AddressForm
                            register={register}
                            errors={errors.origin || {}}
                            touchedFields={touchedFields.origin || {}}
                            watch={watch}
                            setValue={setValue}
                            setError={setError}
                            clearErrors={clearErrors}
                            prefix="origin."
                        />
                    </Shape>
                    <Shape className="border border-gray-600">
                        <h4 className="pb-2">Endereço destino</h4>
                        <AddressForm
                            register={register}
                            errors={errors.destination || {}}
                            touchedFields={touchedFields.destination || {}}
                            watch={watch}
                            setValue={setValue}
                            setError={setError}
                            clearErrors={clearErrors}
                            prefix="destination."
                        />
                    </Shape>
                    <div className="col-span-2">
                        <div className="grid gap-6 lg:grid lg:grid-cols-2 col-span-2">
                            <div className="flex flex-col gap-4">
                                <Shape className="border border-gray-600">
                                    <h4 className="pb-2">Tipo da carga*</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3 gap-2">
                                        <label className="flex gap-1">
                                            <input type="radio" value="caixa" {...register("loadType")} className="accent-red-tx" />
                                            <Package className="icon" />
                                            <p>Caixa</p>
                                        </label>
                                        <label className="flex gap-1">
                                            <input type="radio" value="envelope" {...register("loadType")} className="accent-red-tx" />
                                            <File className="icon" />
                                            <p>Envelope</p>
                                        </label>
                                        <label className="flex gap-1">
                                            <input type="radio" value="sacola" {...register("loadType")} className="accent-red-tx" />
                                            <ToteSimple className="icon" />
                                            <p>Sacola</p>
                                        </label>
                                    </div>
                                </Shape>

                                <div className="hidden lg:block space-y-2">
                                    <div className="flex gap-3">
                                        <Info className="icon" />
                                        <p>Todos os pacotes serão enviados para o mesmo endereço informado acima.</p>
                                    </div>
                                    <Shape className="bg-gray-50">
                                        <PackageList
                                            packages={packages}
                                            onIncrease={handleIncreaseAmount}
                                            onDecrease={handleDecreaseAmount}
                                        />
                                    </Shape>
                                </div>
                            </div>


                            <div className="flex flex-col gap-4">
                                <p onClick={toggleDetails} className="cursor-pointer flex items-center">
                                    {showDetails ? <CaretDown className="icon" /> : <CaretRight className="icon" />}
                                    Mais detalhes sobre a carga (opcional)
                                </p>

                                {showDetails && (
                                    <Shape className="border border-gray-600 xl:col-span-3">
                                        <h4 className="pb-2">Dimensões da carga</h4>
                                        <div>
                                            <MeasuresForms
                                                register={register}
                                                errors={errors}
                                                touchedFields={touchedFields}
                                            />
                                        </div>
                                    </Shape>
                                )}

                                <div className="space-y-2 lg:hidden">
                                    <div className="flex gap-3">
                                        <Info className="icon" />
                                        <p>Todos os pacotes serão enviados para o mesmo endereço informado acima.</p>
                                    </div>
                                    <Shape className="bg-gray-50">
                                        <PackageList
                                            packages={packages}
                                            onIncrease={handleIncreaseAmount}
                                            onDecrease={handleDecreaseAmount}
                                        />
                                    </Shape>
                                </div>

                                <div className="grid xs:grid-cols-2 gap-3 py-4 items-end xl:py-0 order-4">
                                    <Button
                                        className="bg-blue-tx xs:col-span-2 md:row-start-1 md:col-start-1"
                                        onClick={handleAddPackage}
                                        type="button"
                                    >
                                        <ButtonText className="text-center text-white">
                                            Adicionar pacote
                                        </ButtonText>
                                    </Button>
                                    <Button
                                        className={`xs:col-span-2 md:col-span-1 md:row-start-2 md:col-start-2 ${isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-tx cursor-pointer'}`}
                                        onClick={handleSend}
                                        type="button"
                                        disabled={isSubmitting}
                                    >
                                        <ButtonText className="text-white text-center">
                                            {isSubmitting ? "Enviando..." : "Enviar"}
                                        </ButtonText>
                                    </Button>
                                    <Button
                                        className="bg-gray-50 xs:col-span-2 md:col-span-1 md:row-start-2 md:col-start-1"
                                        onClick={handleCancel}
                                        type="button"
                                    >
                                        <ButtonText className="text-black text-center">
                                            Cancelar
                                        </ButtonText>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </SectionApp>

            <ModalSm open={isAlertModalVisible} onClose={() => setIsAlertModalVisible(false)} >
                <p className="mb-4 text-lg font-semibold">Preencha os campos obrigatórios!</p>
                <Button variant="secondary" onClick={() => setIsAlertModalVisible(false)}>
                    <ButtonText className="text-center">Fechar</ButtonText>
                </Button>
            </ModalSm>

            <ModalSm open={isSuccessModalVisible} onClose={() => setIsSuccessModalVisible(false)}>
                <CheckCircle className="icon size-36 text-success-light justify-self-center" weight="fill" />
                <h4 className="text-center text-lg font-semibold ">Solicitação enviada!</h4>
                <p className="text-center my-6">Tudo certo, recebemos a sua solicitação, responderemos em breve via email e WhatsApp.</p>
                <div className="flex flex-col gap-2">
                    <Button className="bg-red-tx" onClick={() => {
                        setIsSuccessModalVisible(false);
                        window.scrollTo({ top: 0, left: 0 });
                    }} >
                        <Package className="icon text-white" />
                        <ButtonText className="text-white">Solicitar novo orçamento</ButtonText>
                    </Button>
                    <Link to="/app/home">
                        <Button className="bg-white border border-gray-600">
                            <HouseLine className="icon text-red-tx" />
                            <ButtonText className="text-black">Ir para tela inicial</ButtonText>
                        </Button>
                    </Link>
                </div>
            </ModalSm>

            <ModalSm open={isEmptyListModalVisible} onClose={() => setIsEmptyListModalVisible(false)}>
                <p className="mb-4 text-lg font-semibold">Adicione no mínimo um pacote!</p>
                <Button variant="secondary" onClick={() => setIsEmptyListModalVisible(false)}>
                    <ButtonText className=" text-center">Fechar</ButtonText>
                </Button>
            </ModalSm>

            <ModalConfirm
                message="Deseja finalizar e realizar o pedido?"
                open={isConfirmationModalVisible}
                options={["Não", "Sim"]}
                good
                action={() => handleConfirmSend()}
                onClose={() => setIsConfirmationModalVisible(false)}
            />

            <ModalConfirm
                message="Deseja excluir este pacote da lista?"
                open={isDeleteModalVisible}
                options={["Não", "Sim"]}
                action={confirmDeletePackage}
                onClose={handleCancelDelete}
            />

            <ModalConfirm
                message="Cancelar e voltar para a página inicial?"
                open={isCancelModalVisible}
                options={["Não", "Sim"]}
                action={confirmCancel}
                onClose={() => setIsCancelModalVisible(false)}
            />
        </>
    )
}

function PackageList({ packages, onIncrease, onDecrease }) {
    return (
        <div className="flex flex-col gap-2">
            {packages.length === 0 ? (
                <p className="text-gray-600 text-center">Nenhum pacote adicionado</p>
            ) : (
                packages.map((pkg, index) => (
                    <div key={index} className="flex gap-3 justify-between">
                        <div className="flex gap-2">
                            {pkg.loadType === "caixa" && <Package className="icon" />}
                            {pkg.loadType === "envelope" && <File className="icon" />}
                            {pkg.loadType === "sacola" && <ToteSimple className="icon" />}
                            <p className="capitalize">{pkg.loadType}</p>
                            <p>{`${pkg.width || 0}x${pkg.height || 0}x${pkg.length || 0}cm    ${pkg.weight || 0}kg`}</p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Minus
                                className="cursor-pointer"
                                size={20}
                                onClick={() => onDecrease(index)}
                            />
                            <p>{pkg.amount || 1}</p>
                            <Plus
                                className="cursor-pointer"
                                size={20}
                                onClick={() => onIncrease(index)}
                            />
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

function FormField({ title, placeholder, register, name, error, dirty, type = "text", onChangeMask }) {
    let status;
    if (dirty) {
        status = error ? "error" : "validated"
    }

    return (
        <>
            <InputLabel className="pt-4">{title}</InputLabel>
            <InputRoot status={status}>
                <InputField
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

function AddressForm({ register, errors, touchedFields, watch, setValue, setError, clearErrors, prefix }) {
    const cep = watch(`${prefix}cep`);

    useEffect(() => {
        const fetchAddress = async () => {
            const cleanedCep = cep?.replace(/\D/g, "");
            if (cleanedCep?.length === 8) {
                try {
                    const data = await fetchCep(cleanedCep);
                    if (data.erro) {
                        setError(`${prefix}cep`, { type: "manual", message: "CEP inválido" });
                        return;
                    }
                    clearErrors(`${prefix}cep`);
                    setValue(`${prefix}street`, data.logradouro, { shouldTouch: true, shouldValidate: true });
                    setValue(`${prefix}neighborhood`, data.bairro, { shouldTouch: true, shouldValidate: true });
                    setValue(`${prefix}city`, data.localidade, { shouldTouch: true, shouldValidate: true });
                    setValue(`${prefix}state`, data.uf, { shouldTouch: true, shouldValidate: true });
                } catch {
                    setError(`${prefix}cep`, { type: "manual", message: "Erro ao buscar o CEP" });
                }
            }
        };
        fetchAddress();
    }, [cep, setValue, setError, clearErrors, prefix]);

    return (
        <>
            <FormField
                register={register}
                name={`${prefix}cep`}
                title="CEP*"
                placeholder="Digite seu CEP"
                error={errors.cep}
                dirty={touchedFields.cep}
                type="text"
                onChangeMask={(v) => maskInput(v, "cep")}
            />
            <FormField
                register={register}
                name={`${prefix}state`}
                title="Estado*"
                placeholder="Digite seu Estado"
                error={errors.state}
                dirty={touchedFields.state}
            />
            <FormField
                register={register}
                name={`${prefix}city`}
                title="Cidade*"
                placeholder="Digite sua Cidade"
                error={errors.city}
                dirty={touchedFields.city}
            />
            <FormField
                register={register}
                name={`${prefix}neighborhood`}
                title="Bairro*"
                placeholder="Digite seu Bairro"
                error={errors.neighborhood}
                dirty={touchedFields.neighborhood}
            />
            <FormField
                register={register}
                name={`${prefix}street`}
                title="Rua*"
                placeholder="Digite sua Rua"
                error={errors.street}
                dirty={touchedFields.street}
            />
            <FormField
                register={register}
                name={`${prefix}number`}
                title="Número*"
                placeholder="Digite seu Número"
                error={errors.number}
                dirty={touchedFields.number}
            />
        </>
    );
}

function MeasuresForms({ register, errors, touchedFields }) {
    return (
        <>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-6 lg:grid-cols-2">
                <div>
                    <FormField
                        register={register}
                        name="width"
                        title="Largura (cm)"
                        placeholder="cm"
                        error={errors.width}
                        dirty={touchedFields.width}
                        type="number"
                    />
                </div>
                <div>
                    <FormField
                        register={register}
                        name="height"
                        title="Altura (cm)"
                        placeholder="cm"
                        error={errors.height}
                        dirty={touchedFields.height}
                        type="number"
                    />
                </div>
                <div>
                    <FormField
                        register={register}
                        name="length"
                        title="Comprimento (cm)"
                        placeholder="cm"
                        error={errors.length}
                        dirty={touchedFields.length}
                        type="number"
                    />
                </div>
                <div>
                    <FormField
                        register={register}
                        name="weight"
                        title="Peso (kg)"
                        placeholder="kg"
                        error={errors.weight}
                        dirty={touchedFields.weight}
                        type="number"
                    />
                </div>
            </div>
        </>
    )
}

function addressSchema(cityList) {
    return z.object({
        cep: z
            .string()
            .transform((val) => val.replace(/\D/g, ""))
            .refine((val) => val.length === 8, { message: "CEP inválido" }),

        state: z
            .string()
            .nonempty("Campo obrigatório")
            .refine(
                (val) => ["Paraná", "PR", "parana", "pr"].includes(val),
                { message: "Só atendemos o Paraná no momento." }
            ),

        city: z
            .string()
            .nonempty("Campo obrigatório")
            .refine(
                (val) => cityList.includes(val),
                { message: "Cidade não atendida." }
            ),

        neighborhood: z
            .string()
            .nonempty("Campo obrigatório"),

        street: z
            .string()
            .nonempty("Campo obrigatório"),

        number: z
            .string()
            .nonempty("Campo obrigatório"),
    });
}

function generalSchema(cityList) {
    return z.object({
        origin: addressSchema(cityList),
        destination: addressSchema(cityList),
        loadType: z
            .string()
            .nonempty("Selecione o tipo de carga"),
        width: z
            .string()
            .optional()
            .transform((val) => (val ? Number(val.replace(",", ".")) : undefined))
            .refine((val) => val === undefined || (!isNaN(val) && val > 0), { message: "Informe um número válido" }),
        height: z
            .string()
            .optional()
            .transform((val) => (val ? Number(val.replace(",", ".")) : undefined))
            .refine((val) => val === undefined || (!isNaN(val) && val > 0), { message: "Informe um número válido" }),
        length: z
            .string()
            .optional()
            .transform((val) => (val ? Number(val.replace(",", ".")) : undefined))
            .refine((val) => val === undefined || (!isNaN(val) && val > 0), { message: "Informe um número válido" }),
        weight: z
            .string()
            .optional()
            .transform((val) => (val ? Number(val.replace(",", ".")) : undefined))
            .refine((val) => val === undefined || (!isNaN(val) && val > 0), { message: "Informe um número válido" }),
    });
}

function maskInput(value, field) {
    const onlyDigits = value.replace(/\D/g, '');

    if (field === "cep") {
        // CEP: 99999-999
        return onlyDigits.replace(/^(\d{5})(\d{0,3})/, (match, p1, p2) => {
            if (p2) return `${p1}-${p2}`;
            return p1;
        }).slice(0, 9);
    }

    return value;
}