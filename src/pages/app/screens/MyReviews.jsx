import { Button, ButtonText, Image, InputRoot, InputField, InputIcon, InputLabel, InputMessage, SectionApp, AppHeader, Shape, ModalSm } from "@/components";
import { Star, ArrowLeft, ArrowRight } from "phosphor-react";
import { useState, useEffect } from "react";
import ReviewService from "../../../services/ReviewService";

export function MyReviews() {
  return (
    <>
      <SectionApp>
        <AppHeader screenTitle="Minhas avaliações" />
        <CardsWithPagination />
      </SectionApp>
    </>
  );
}

const CardsWithPagination = () => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalSmOpen, setIsModalSmOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const reviewService = new ReviewService();

  useEffect(() => {
    loadReviews(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const loadReviews = async (page) => {
    try {
      const response = await reviewService.findAllByPessoaId(page);
      const reviews = response.data.content || [];
      setTotalPages(response.data.totalPages);

      const itemsIds = reviews.map((review) => ({
        id: review.id,
        nomeCliente: review.nomeAvaliador,
        avaliacao: review.descricao,
        rating: review.nota,
        data: formatDate(review.dataAvaliacao),
      }));
      setItems(itemsIds);
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
      setItems([]);
    }
  };

  const formatDate = (dateArray) => {
    if (!dateArray) return "";
    const [year, month, day] = dateArray;
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  };

  const goToPage = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const openModal = (reviewContent) => {
    setSelectedReview(reviewContent);
    setIsModalSmOpen(true);
  };

  const closeModal = () => {
    setIsModalSmOpen(false);
    setSelectedReview(null);
  };

  const getChars = () => {
    if (windowWidth < 380) {
      return 60;
    } else if (windowWidth < 500) {
      return 100;
    } else {
      return 140;
    }
  };

  const maxChars = getChars();

  return (
    <div className="w-full p-4">
      {items.length === 0 && (
        <p className="text-center text-gray-600 mb-4">
          Nenhuma avaliação encontrada.
        </p>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch hover:cursor-pointer">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => openModal(item.avaliacao)}
            className="hover:scale-101 transition duration-200 shadow-md p-4 lg:max-w-full rounded-2xl h-full"
          >
            <div className="flex items-center mb-2">
              <div className="w-16 h-16 rounded-full bg-gray-50 items-center justify-center"></div>
              <div className="pl-2">
                <p className="font-bold">{item.nomeCliente}</p>
                <div className="flex">
                  {[...Array(5)].map((_, starIndex) =>
                    starIndex < item.rating ? (
                      <StarFull key={starIndex} />
                    ) : (
                      <Star
                        key={starIndex}
                        className="icon text-gray-100"
                      />
                    )
                  )}
                </div>
              </div>
            </div>
            {item.avaliacao ? (
              <p className="break-words h-auto lg:h-[10rem] xl:h-[8rem]">
                {truncateText(item.avaliacao, maxChars)}{" "}
                {item.avaliacao.length > maxChars && (
                  <span className="text-red-tx font-bold"> ver mais</span>
                )}
              </p>
            ) : (
              <p className="italic h-auto md:h-[8rem] lg:h-[10rem] text-gray-600 xl:h-[8rem]">
                Sem descrição
              </p>
            )}
            <p className="pt-1 text-gray-600">{item.data}</p>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2 mt-4 justify-end">
          <Button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 0}
            className="disabled:opacity-50 disabled:pointer-events-none w-auto"
            variant="secondary"
          >
            <ArrowLeft className="icon" />
          </Button>
          <span className="text-sm text-gray-600 mx-2">
            {currentPage + 1} de {totalPages}
          </span>
          <Button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="disabled:opacity-50 disabled:pointer-events-none w-auto"
            variant="secondary"
          >
            <ArrowRight className="icon" />
          </Button>
        </div>
      )}
      <ModalSm open={isModalSmOpen} onClose={closeModal}>
        {selectedReview ? (
          <div className="">
            <h4 className="text-center">Avaliação</h4>
            <p className="break-words py-3">{selectedReview}</p>
            <div className="flex items-center justify-center">
              <Button onClick={closeModal} variant="secondary">
                <ButtonText className="text-center">
                  Fechar
                </ButtonText>
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-3">
            <h4 className="text-center">Avaliação</h4>
            <p className="italic text-gray-600 py-3">Sem descrição</p>
            <div className="flex items-center justify-center">
              <Button onClick={closeModal} variant="secondary">
                <ButtonText className="text-center">
                  Fechar
                </ButtonText>
              </Button>
            </div>
          </div>
        )}
      </ModalSm>
    </div>
  );
};


function StarFull() {
  return (
    <div className="relative w-6 sm:w-8" >
      <Star className="absolute inset-0 text-star icon" weight="fill" />
      <Star className="absolute inset-0 text-star-border icon" weight="regular" />
    </div>
  )
}