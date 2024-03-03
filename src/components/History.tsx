import styled from "styled-components";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient, useQuery } from 'react-query';
import { Photo } from "./Main";
import PhotoModal from "./Modal";

interface UnsplashResponse {
  results: Photo[];
}

const History: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [emptyCache, setEmptyCache] = useState<Boolean>(false)
    const [page, setPage] = useState<number>(1);
    const queryClient = useQueryClient();
    const searchedWords = queryClient.getQueryData<string[]>('searchedWords') || [];
    const [photo, setPhoto] = useState<Photo[]>([]);

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

    const fetchSearchedPhotos = async (query: string, page: number) => {
        const cachedData: Photo[] = queryClient.getQueryData<Photo[]>(['search', query, page]) as Photo[];
        if (cachedData) {
          setPhoto(cachedData)
          setEmptyCache(true)
          return cachedData;
        } else {
            setEmptyCache(false)
            const response = await axios.get<UnsplashResponse>(`https://api.unsplash.com/search/photos?&page=${page}&per_page=20`, {
                params: {
                  client_id: 'ihpsdWQhpiIDTs7vDnAerKG89tbc2P77dGvAN9PiZk0',
                  query: query,
                },
              });
              queryClient.setQueryData(['search', query, page], response.data.results);
              setPhoto(prev => [...prev, ...response.data.results]);
              
          return response.data.results;
        }
      };

      const { data: photos } = useQuery(['photos', query, page], () => fetchSearchedPhotos(query, page), {
        enabled: query !== '' && page !== 0
      });
    
      const handleChipClick = (word: string) => {
        setQuery(word);
        setPage(1);
      };

      const handleScroll = () => {
        const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight || window.innerHeight;
        const scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
    
        if (scrolledToBottom && photo) {
          setPage(prevPage => prevPage + 1)
        }
      };
    
      useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);


console.log(photos)
    return (
        <MainDiv>
            <Header>
                <SearchWords>
                    ბოლოს მოძებნილი: 
                    {searchedWords.map((word: string, index: number) => (
                    <Chips onClick={() =>  handleChipClick(word)}
                    key={index}>
                        {word}
                    </Chips>
                    ))}
                </SearchWords>

                <Link to='/' style={{color: 'inherit', textDecoration: 'none'}}>
                    <PageLink>
                        მთავარი
                    </PageLink>
                </Link>
            </Header>

            <ImgContainer>
            {query? 
            <>
            {photo && photo.map((photo: Photo) => (
            <Img key={photo.id} src={photo.urls.regular} alt={`Photo ${photo.id}`}
            onClick={() => handlePhotoClick(photo.id, photo.urls.full, photo.likes)}/>
            ))}
            </>:
            <Alert>აირჩიეთ საძიებო სიტყვა</Alert>
            }
            {emptyCache && <ErrorText>ფოტო ვერ მოიძებნა :(</ErrorText>}
            {modalRender && <PhotoModal render={handleModalRender} photoId={photoId} photoLikes={photoLikes} photoUrl={photoUrl}/>}
            </ImgContainer>
        </MainDiv>
    );
}
 
export default History;

const MainDiv = styled.div`
    width: 70%;
    position: relative;
    z-index: 1;
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

// const Spinner = styled.div`
//     width: 48px;
//     height: 48px;
//     border-radius: 50%;
//     display: inline-block;
//     border-top: 3px solid #323334;
//     border-right: 3px solid transparent;
//     box-sizing: border-box;
//     animation: rotation 1s linear infinite;
//     margin: 0 auto;

//     @keyframes rotation {
//         0% {
//             transform: rotate(0deg);
//         }
//         100% {
//             transform: rotate(360deg);
//         }
//     } 
// `

const Header = styled.div`
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 80px;
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

const SearchWords = styled.p`
    font-size: 20px;
    font-weight: 700;
    color: #323334;
    width: 70%;
    display: inline-flex;
    align-items: flex-start;
    flex-wrap: wrap;
    row-gap: 5px;
    column-gap: 8px;
`

const Chips = styled.div`
    font-size: 16px;
    font-weight: 500;
    width: fit-content;
    padding: 5px 15px;
    color: #fff;
    fill: #fff;
    background-color: #1079e1;
    border: 2px solid transparent;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 5px;
    cursor: pointer;
    transition: all .2s ease;

    &:hover {
        background-color: #fff;
        border: 2px solid #1079e1;
        color: #1079e1;
        fill: #1079e1;
    }
 
    .x:hover {
        padding: 2px;
        background-color: #1079e1;
        border-radius: 50%;
        fill: #fff;
        transform: scale(1.4);
        transition: transform .1s ease;

    }   
`

const Alert = styled.p`
    font-size: 30px;
    color: #1079e1;
    font-weight: 700;
    margin: 0 auto;
    animation: zoom-in-zoom-out 3s ease infinite;

    @keyframes zoom-in-zoom-out {
  0% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1.5, 1.5);
  }
  100% {
    transform: scale(1, 1);
  }
}
`

const ErrorText = styled.p`
  color: #C62828;
  font-size: 30px;
  font-weight: 600;
  margin: 0 auto;
`