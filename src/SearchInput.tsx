
import { SyntheticEvent, useEffect, useRef } from "react"
import axios from 'axios'

const API_KEY = "20524329-a56f712174c95d9a33f77f075"

const SearchInput = (props:{setImageData:(data:string[]) => void}) => {
  
  const timeout = useRef(0);
  const el = useRef<HTMLInputElement>(null);

  const requestData = async (term:string) => {

    const res = await axios.get('https://pixabay.com/api/',
      {
        params: {
          key:API_KEY,
          q:encodeURIComponent(term),
          image_type: 'photo',
          per_page:30,
          orientation:'vertical'
        }
      })
    props.setImageData(res.data.hits.map((it:any) => it.webformatURL));
  }

  useEffect(() => {

    // Default search term
    requestData('tiger');
  }, []);

  const changeHandler = (e:SyntheticEvent) => {

    clearTimeout(timeout.current);

    // Query images after timeout
    timeout.current = setTimeout(() => {

      const el = e.target as HTMLInputElement;
      if (el.value.length > 0) {
        requestData(el.value);
      }
    }, 600);
  }

  return (
    <input className="rounded block my-2 py-1 bg-white w-64 text-lg text-center text-black" type="text" onChange={changeHandler} ref={el}/>
  )
}

export default SearchInput
