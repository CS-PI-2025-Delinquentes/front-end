import { Button, ButtonText, Image, InputRoot, InputField, InputIcon, InputLabel, InputMessage, SectionApp, AppHeader, Shape } from "@/components";
import { Eye, EyeSlash, UserList, LockSimpleOpen, CheckCircle, Star } from "phosphor-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SectionBox } from "@/components";
import { CloudinaryImage } from "@/components/CloudinaryImage.jsx";

export function MyReviews() {
  return (
    <>
      <SectionApp>
            <AppHeader screenTitle="Minhas avaliações"/>
            <CardsWithPaginationAndLocalStorage/>
      </SectionApp>
    </>
  );
}


const CardsWithPaginationAndLocalStorage = () => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  useEffect(() => {
    const loadReviewsLocalStorage = () => {
      try {
        const storedReviews = localStorage.getItem('jsonReview');
        if (storedReviews) {
          const reviews = JSON.parse(storedReviews);

         
          const itemsIds = reviews.map((review, index) => ({
            id: index + 1, 
            nomeCliente: 'Nome cliente', 
            avaliacao: review.avaliacao,
            rating: review.rating,
            data: '10/06/2025', 
          }));
          setItems(itemsIds);
        } 
        
      } catch (error) {
        console.error("Erro ao carregar  'jsonReview' do localStorage:", error);
        setItems([]);
      }
    };

    loadReviewsLocalStorage();
  }, []); 

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="max-w-full  xl:max-w-full mx-auto p-4">
      {items.length === 0 && (
        <p className="text-center text-gray-600 mb-4">
          Nenhuma avaliação encontrada.
        </p>
      )}
      <div className=" grid grid-cols-2 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4 "> 
        {currentItems.map((item) => (
          <div key={item.id} className="shadow-md p-4 rounded-2xl"> 
            <div className="flex items-center mb-2">
              <div className=" w-16 h-16 rounded-full  bg-gray-50 flex items-center justify-center"></div>
              <div className="pl-2">
                <p className="text-base font-bold">{item.nomeCliente}</p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      weight={starIndex < item.rating? "fill" : "regular"} 
                      size={32}
                      className={starIndex < item.rating ? "text-star" : "text-gray-100"}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm break-words h-[7.5rem] overflow-y-auto">{item.avaliacao}</p>
            <p className="text-xs ">{item.data}</p> 
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2 mt-4 justify-end">
          <Button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="border-1 border-black disabled:opacity-50 w-28 h-10 "
          >
            <ButtonText className="text-center disabled:opacity-50">
              Voltar
            </ButtonText>
          </Button>

          <Button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border-1 border-black disabled:opacity-50 w-28 h-10"
          >
            <ButtonText className="text-center disabled:opacity-50">
              Próximo
            </ButtonText>
          </Button>
        </div>
      )}
    </div>
  );
};
