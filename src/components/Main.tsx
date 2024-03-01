import styled, {css} from "styled-components";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Photo {
    id: string;
    urls: {
      regular: string;
    };
  }

interface InputDivProps {
    focused: Boolean;
}

const Main: React.FC = () => {
    const [focused, setFocused] = useState<Boolean>(false);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [error, setError] = useState<Boolean>(false)

    const getData = async () => {
        try {
        //   const response = await axios.get(`https://api.unsplash.com/photos?per_page=20&order_by=popular&client_id=ihpsdWQhpiIDTs7vDnAerKG89tbc2P77dGvAN9PiZk0`)
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
            <Header>
                <InputDiv focused={focused}>
                    <SearchInput placeholder="ძებნა"
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
    cursor: pointer;
    transition: all .3s ease-in-out;

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

const InputDiv = styled.div<InputDivProps>(
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

