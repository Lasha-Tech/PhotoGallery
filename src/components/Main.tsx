import styled from "styled-components";
import Header from "./Header";
import axios from "axios";
import { useEffect, useState } from "react";

interface Photo {
    id: string;
    urls: {
      regular: string;
    };
  }

const Main: React.FC = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [error, setError] = useState<Boolean>(false)

    const getData = async () => {
      try {
        // const response = await axios.get(`https://api.unsplash.com/photos?per_page=20&order_by=popular&client_id=ihpsdWQhpiIDTs7vDnAerKG89tbc2P77dGvAN9PiZk0`)
        const newPhotos: Photo[] = response.data;
        setPhotos(newPhotos);
        setError(false)

      } catch (error) {
        setError(true)
        console.log(error)
      }
    }

    useEffect(() => {
        getData();
    }, [])


    return (
        <MainDiv>
            <Header/>

            <ImgContainer>
                {photos.map(photo => {
                    return (
                        <Img key={photo.id} src={photo.urls.regular}/>
                    )
                })}
            </ImgContainer>
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



