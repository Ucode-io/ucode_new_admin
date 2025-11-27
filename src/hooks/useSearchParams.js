
import { useCallback } from "react";
import { useSearchParams as useSearchParamsReact } from "react-router-dom";


const useSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParamsReact();

  const updateSearchParam = useCallback((key, value) => {
    // Создаем копию текущих параметров
    const newSearchParams = new URLSearchParams(searchParams);
    // Устанавливаем новый параметр
    newSearchParams.set(key, value);
    // Обновляем параметры в URL
    setSearchParams(newSearchParams);
  }, [searchParams, setSearchParams]);

  return [searchParams, setSearchParams, updateSearchParam]
}


export default useSearchParams