import styled, {css} from "styled-components";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient, useQuery } from 'react-query';

interface Photo {
    id: string;
    url: string;
  }
  
  type SearchedWords = string[];
  
  interface UnsplashResponse {
    results: Photo[];
  }

const History: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const queryClient = useQueryClient();
    const searchedWords = queryClient.getQueryData<string[]>('searchedWords') || [];

    const fetchSearchedPhotos = async (query: string, page: number) => {
        const cachedData = queryClient.getQueryData(['search', query, page]);
        if (cachedData) {
          return cachedData;
        } else {
            const response = await axios.get<UnsplashResponse>(`https://api.unsplash.com/search/photos?&page=${page}&per_page=20`, {
                params: {
                  client_id: 'ihpsdWQhpiIDTs7vDnAerKG89tbc2P77dGvAN9PiZk0',
                  query: query,
                },
              });
              queryClient.setQueryData(['search', query, page], response.data.results);

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
console.log(photos)
    return (
        <MainDiv>
            <Header>
                <SearchedWords>
                    ბოლოს მოძებნილი: 
                    {searchedWords.map((word: string, index: number) => (
                    <Chips onClick={() =>  handleChipClick(word)}
                    key={index}>
                        {word}
                        <svg className='x' width='15' height='15' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                    </Chips>
                    ))}
                </SearchedWords>

                <Link to='/' style={{color: 'inherit', textDecoration: 'none'}}>
                    <PageLink>
                        მთავარი
                    </PageLink>
                </Link>
            </Header>

            <ImgContainer>
            {query? 
            <>
            {photos && photos.map((photo: Photo) => (
            <Img key={photo.id} src={photo.urls.regular} alt={`Photo ${photo.id}`} />
            ))}
            </>:
            <Alert>აირჩიეთ საძიებო სიტყვა</Alert>
            }
            </ImgContainer>
        </MainDiv>
    );
}
 
export default History;

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

const SearchedWords = styled.p`
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
    padding: 5px;
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

