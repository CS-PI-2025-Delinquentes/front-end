import { Button, ButtonText, InputRoot, InputField, InputIcon, InputLabel, InputMessage, Section } from "@/components";
import { CaretDown, CaretUp, MapPin, Package } from "phosphor-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { normalize } from "@/utils/normalize";


export function ServicedRoutes() {
  const [cities, setCities] = useState([]);
  const [isMap, setIsMap] = useState(true);


  useEffect(() => {
    fetch('https://raw.githubusercontent.com/CS-PI-2025-Delinquentes/json-end/refs/heads/main/cities.json').
      then(data => data.json()).
      then(data => setCities(data))
  }, []);

  return (
    <div className="relative">
      <div className="bg-white">
        <Section id="routes">
          <h2 className="pb-3">Rotas atendidas</h2>
          <p className="pb-3">Atuamos em toda a região Noroeste do Paraná, com destaque para as áreas de Londrina e Maringá. Confira abaixo a lista completa de rotas atendidas pela Teruel Express e verifique a disponibilidade de entregas em sua localidade.
</p>

          <div className="flex justify-evenly font-bold pb-7">
            <p onClick={() => setIsMap(true)} className={isMap ? "border-b-3 border-red-tx" : "hover:cursor-pointer"}>Mapa</p>
            <p onClick={() => setIsMap(false)} className={!isMap ? "border-b-3 border-red-tx" : "hover:cursor-pointer"}>Ver lista</p>
          </div>

          {isMap ? <Map data={cities} /> : <List data={cities} />}
          <div className="lg:place-self-end">
            <Link to="/login">
              <Button className="bg-red-tx mt-5 lg:w-auto">
                <Package className="icon text-white" />
                <ButtonText className="text-white">
                  Solicitar orçamento
                </ButtonText>
              </Button>
            </Link>
          </div>
        </Section>

      </div>
    </div>
  )
}

function CitySearch({ suggestions, title, placeholder }) {
  const [status, setStatus] = useState('default');
  const [inputStyle, setInputStyle] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [returnMessage, setReturnMessage] = useState(null);
  const [isWriting, setIsWriting] = useState(false);

  function check(status) {
    if (status === "error") {
      setStatus(status);
      setInputStyle("text-danger-base");
      setReturnMessage(false);
    }
    else if (status === "validated") {
      setStatus(status);
      setInputStyle("text-success-base");
      setReturnMessage(true);
    }
    else {
      setStatus("default");
      setInputStyle("");
      setReturnMessage(null);
    }
  }

  const handleChange = (event) => {
    const inputValue = event.target.value;
    setInputValue(inputValue);
    check();

    if(isWriting === false) setIsWriting(true); 

    const filteredSuggestions = suggestions.filter(suggestion =>
      normalize(suggestion).includes(normalize(inputValue))
    )

    if (filteredSuggestions.length === 0) check("error");
    setFilteredSuggestions(filteredSuggestions);
  };

  const handleSelect = (value) => {
    check("validated");
    setInputValue(value);
    setFilteredSuggestions([]);
    setIsWriting(false);
  };

  return (
    <div className="relative">
      <InputLabel>{title}</InputLabel>
      <InputRoot data-status={status}>
        <InputIcon>
          <MapPin className={`icon ${inputStyle}`} />
        </InputIcon>
        <InputField value={inputValue} onChange={handleChange} placeholder={placeholder} onFocus={() => {if(normalize(inputValue)===normalize(filteredSuggestions[0])) setIsWriting(false); else setIsWriting(true)}} onBlur={() => { if(normalize(inputValue)===normalize(filteredSuggestions[0])) {check("validated"); setInputValue(filteredSuggestions[0]);} else { setIsWriting(true);} setIsWriting(false)}} />
      </InputRoot>
      <InputMessage className={inputStyle}>
        {returnMessage ? "Atendemos essa cidade!" : returnMessage === null ? null : "Cidade fora da rota!"}
      </InputMessage>

      {isWriting && <ul className="bg-gray-50 rounded-2xl absolute top-full z-50 w-full">
        {filteredSuggestions.map((suggestion, index) => (
          <li key={index} onMouseDown={() => handleSelect(suggestion)} onBlur={() => setIsWriting(false)}>
            <p className="hover:bg-gray-100 hover:cursor-pointer rounded-2xl overflow-hidden pl-5 py-2 "> {suggestion}</p>
          </li>
        ))}
      </ul>}
    </div>
  );
};

function Map({ data }) {
  return (
    <div className="relative">
      <div className="block lg:grid lg:grid-cols-2 lg:gap-x-5">
        <CitySearch suggestions={data} title="Cidade de origem" placeholder="Ex: Paranavaí" />
        <CitySearch suggestions={data} title="Cidade de destino" placeholder="Ex: Maringá" />
      </div>
    </div>
  )
}

function List({ data }) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="relative">
      <div id="container" className="bg-gray-50 rounded-2xl p-6 font-bold flex flex-col gap-y-4">

        <ul className="space-y-2 lg:grid lg:grid-cols-2">
          {data.slice(0, 5).map(city => (
            <li key={data.indexOf(city)}>
              <p className="flex">
                <MapPin className="icon mr-4" />
                {city}
              </p>
            </li>
          ))}
          {showMore && data.slice(5).map(city => (
            <li key={data.indexOf(city)}>
              <p className="flex">
                <MapPin className="icon mr-4" />
                {city}
              </p>
            </li>
          ))}
        </ul>

        {<Button className="bg-gray-50" onClick={() => setShowMore(showMore ? false : true)}>
          {showMore ? <CaretUp className="icon" /> : <CaretDown className="icon" />}
          <ButtonText className="text-black">
            {showMore ? "Mostrar menos" : "Mostrar mais cidades"}
          </ButtonText>
        </Button>}
      </div>
    </div>
  )
}


