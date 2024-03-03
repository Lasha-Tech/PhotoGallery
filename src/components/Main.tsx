import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, {css} from 'styled-components';
import { Link } from 'react-router-dom';
import { useQueryClient, useQuery } from 'react-query';
import PhotoModal from './Modal';

export interface Photo {
  id: string;
  likes: number;
  urls: {
    regular: string;
    full: string;
  };
}

interface UnsplashResponse {
  results: Photo[];
}

type SearchedWords = string[];


const Main: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [focused, setFocused] = useState<boolean>(false)
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const queryClient = useQueryClient();

  // States For Modal
  const [photoId, setPhotoId] = useState<string>('')
  const [modalRender, setModalRender] = useState<Boolean>(false)
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoLikes, setPhotoLikes] = useState<number>(0)

  const handlePhotoClick = (photoId: string, url: string, likes: number) => {
    setPhotoId(photoId)
    setPhotoUrl(url)
    setPhotoLikes(likes)
    setModalRender(true)
  }

  const handleModalRender = (render: Boolean) => {
    setModalRender(render)
  }

  const fetchPopular = async (page: number): Promise<Photo[]> => {
    const response = await axios.get(`https://api.unsplash.com/photos?page=${page}&per_page=20&order_by=popular&client_id=ihpsdWQhpiIDTs7vDnAerKG89tbc2P77dGvAN9PiZk0`);
    return response.data;
  };
  
  const fetchPhotosByWord = async (query: string, page: number): Promise<Photo[]> => {
    const response = await axios.get<UnsplashResponse>(`https://api.unsplash.com/search/photos?&page=${page}&per_page=20`, {
      params: {
        client_id: 'ihpsdWQhpiIDTs7vDnAerKG89tbc2P77dGvAN9PiZk0',
        query: query,
      },
    });
    queryClient.setQueryData(['search', query, page], response.data.results);
    return response.data.results;
  };
  
  
  const debounce = (func: Function, delay: number) => {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const delayedFetchPhotos = debounce((value: string) => {
    setQuery(value);
  }, 1000);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    delayedFetchPhotos(value);
  };

  useEffect(() => {
    setPage(1); // Reset page number when query changes
    setPhotos([]);
  }, [query]);

  const fetchPopularPhotos = async () => {
    const cachedData: Photo[] = queryClient.getQueryData(['popular', page]) as Photo[];

    if (cachedData) {
      setPhotos(cachedData)
      return cachedData;
    } else {
      const data = await fetchPopular(page);
      setPhotos(prev => [...prev, ...data]);
      queryClient.setQueryData(['popular', page], data);
      return data;
    }
  };

  const fetchSearchedPhotos = async () => {
    if (!query) return fetchPopularPhotos(); // If query is empty, fetch popular photos
    const cachedData: Photo[] = queryClient.getQueryData<Photo[]>(['search', query, page]) as Photo[];
    if (cachedData) {
      setPhotos(cachedData)
      return cachedData;
    } else {
      const data = await fetchPhotosByWord(query, page);
      setPhotos(prev => [...prev, ...data]);
      // Save searched word in cache
      const searchedWords = queryClient.getQueryData<SearchedWords>('searchedWords') || [];
      if (!searchedWords.includes(query)) {
        queryClient.setQueryData('searchedWords', [...searchedWords, query]);
      }
      queryClient.setQueryData(['search', query, page], data);
      return data;
    }
  };
  
  const handleScroll = () => {
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;
    const scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

    if (scrolledToBottom) {
      setPage(prevPage => prevPage + 1)
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const { data, isLoading, isError } = useQuery(['photos', query, page], fetchSearchedPhotos);
  const searchedWords = queryClient.getQueryData<string[]>('searchedWords') || [];

  console.log('Searched Words:', searchedWords);
  console.log(data)
    return (
        <MainDiv>
            <Header>
                <InputDiv focused={focused}>
                    <SearchInput placeholder="ძებნა"
                    onChange={handleInputChange}
                    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}/>
                    <svg width='20' height='20' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg> 
                </InputDiv>

                <Link to='/History' style={{color: 'inherit', textDecoration: 'none'}}>
                    <PageLink>
                        ისტორია
                    </PageLink>
                </Link>
                
            </Header>

            <ImgContainer>
              {photos && photos.map((photo: Photo) => (
              <Img key={photo.id} src={photo.urls.regular} alt={`Photo ${photo.id}`}
              onClick={() => handlePhotoClick(photo.id, photo.urls.full, photo.likes)}/>
              ))}
              {isLoading && <Spinner/>}
              {isError && <ErrorText>ფოტო ვერ მოიძებნა  :(</ErrorText>}
            </ImgContainer>

            {modalRender && <PhotoModal render={handleModalRender} photoId={photoId} photoLikes={photoLikes} photoUrl={photoUrl}/>}
        </MainDiv>
    );
}
 
export default Main;

const MainDiv = styled.div`
    width: 70%;
`

const ImgContainer = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 25px;
    align-items: flex-start;
    justify-content: space-between;
`

const Img = styled.img`
    height: 300px;
    width: 230px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all .3s ease-in-out;
    object-fit: cover;

    &:hover {
        transition: all .3s ease-in-out;
        transform: scale(1.1);
    }
` 

const Spinner = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: inline-block;
    border-top: 3px solid #323334;
    border-right: 3px solid transparent;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    margin: 0 auto;

    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    } 
`

const Header = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 80px;
`

const InputDiv = styled.div<{ focused: boolean }>(
    ({focused}) => css`
        width: 400px;
        max-width: 60%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        background-color: #323334;
        color: #fff;
        fill: ${focused? '#4b6781': '#fff'};
        font-size: 18px;
        padding-right: 10px;
        border-radius: 4px;
        transition: all .3s ease-in-out;
        border: 3px solid ${focused? '#4b6781': 'transparent'};

        &:hover {
            transition: all .3s ease-in-out;
            background-color: ${focused? '#323334': '#4b6781'};
        }
    `
)

const SearchInput = styled.input`
    width: 100%;
    height: 100%;
    padding: 10px 0px 10px 10px;
    outline: none;
    border: none;
    font-size: inherit;
    border-radius: inherit;
    background-color: inherit;
    color: inherit;
    font-family: inherit;

    &::placeholder {
        color: #fff;
        font-weight: 500;
    }
`

const PageLink = styled.div`
    padding: 10px 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    color: #fff;
    background-color: #323334;
    border: 2px solid transparent;
    cursor: pointer;
    font-weight: 600;
    transition: all .3s ease;

    &:hover {
        color: #323334;
        background-color: #fff;
        border: 2px solid #323334;
    }
`

const ErrorText = styled.p`
  color: #C62828;
  font-size: 30px;
  font-weight: 600;
  margin: 0 auto;
`